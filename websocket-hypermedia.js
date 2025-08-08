/* IMMUTABLE: THIS IS THE ONE AND ONLY COMMENT ALLOWED IN THIS FILE. DO NOT ADD ANY COMMENTS TO THIS FILE. WE NEED IT TO REMAIN AS SMALL AS POSSIBLE! ALL DOCUMENTATION BELONGS IN WSHM-reference.md */

class WebSocketHypermedia {
    constructor(url, options = {}) {
        this.url = url;
        this.options = {
            autoReconnect: true,
            reconnectDelay: 1000,
            maxReconnectAttempts: 5,
            escapeChar: '~',
            enableClickToSend: false,
            clickVerb: 'element_clicked',
            onConnect: null,
            onDisconnect: null,
            onError: null,
            onMessage: null,
            ...options
        };
        
        this.ws = null;
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.messageHandlers = new Map();
        
        this.esc = this.options.escapeChar;
        this.actions = {
            update: (el, subject) => el.innerHTML = subject,
            append: (el, subject) => el.insertAdjacentHTML('beforeend', subject),
            prepend: (el, subject) => el.insertAdjacentHTML('afterbegin', subject),
            replace: (el, subject) => el.outerHTML = subject,
            remove: (el) => el.remove(),
            swap: (el, subject) => el.outerHTML = subject,
            before: (el, subject) => el.insertAdjacentHTML('beforebegin', subject),
            after: (el, subject) => el.insertAdjacentHTML('afterend', subject)
        };
        
        this._connect();
        
        if (this.options.enableClickToSend) {
            this.setupClickToSend();
        }
    }
    
    _connect() {
        if (this.isConnecting) return;
        this.isConnecting = true;
        
        try {
            this.ws = new WebSocket(this.url);
            this.setupEventHandlers();
        } catch (error) {
            this.handleError(error);
        }
    }
    
    setupEventHandlers() {
        const { onConnect, onDisconnect, onError, onMessage } = this.options;
        
        this.ws.onopen = () => {
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            onConnect?.();
        };
        
        this.ws.onclose = (event) => {
            this.isConnecting = false;
            onDisconnect?.(event);
            
            if (this.options.autoReconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
                this.scheduleReconnect();
            }
        };
        
        this.ws.onerror = (error) => {
            this.handleError(error);
        };
        
        this.ws.onmessage = async (event) => {
            await this.handleMessage(event.data);
            onMessage?.(event.data);
        };
    }
    
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.options.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        setTimeout(() => {
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                this._connect();
            }
        }, delay);
    }
    
    async handleMessage(data) {
        try {
            const parts = this.parseMessage(data);
            
            if (parts.length >= 3) {
                const [verb, noun, subject, ...options] = parts;
                await this.processAction(verb, noun, subject, options);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
    
    parseMessage(data) {
        const parts = [];
        let currentPart = '';
        let i = 0;
        let inEscaped = false;
        const esc = this.esc;
        const len = data.length;
        
        while (i < len) {
            const char = data[i];
            
            if (char === esc && !inEscaped) {
                inEscaped = true;
                i++;
                continue;
            } else if (char === esc && inEscaped) {
                inEscaped = false;
                i++;
                continue;
            } else if (char === '|' && !inEscaped) {
                parts.push(currentPart);
                currentPart = '';
                i++;
                continue;
            }
            
            currentPart += char;
            i++;
        }
        
        if (currentPart.length > 0 || parts.length > 0) {
            parts.push(currentPart);
        }
        
        return parts;
    }
    
    async processAction(verb, noun, subject, options = []) {
        const el = document.getElementById(noun);
        
        if (!el) {
            console.warn('Element not found:', noun);
            return;
        }
        
        const customHandler = this.messageHandlers.get(verb);
        if (customHandler) {
            const result = customHandler(el, subject, noun, options);
            if (result && typeof result.then === 'function') {
                await result;
            }
            return;
        }
        
        const action = this.actions[verb];
        if (action) {
            action(el, subject);
        } else {
            console.warn('Unknown verb:', verb, '- Server can extend protocol without client updates');
        }
    }
    
    send(action) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(action);
        } else {
            console.warn('WebSocket not ready, state:', this.ws?.readyState);
        }
    }
    
    createMessage(verb, noun, subject, ...options) {
        return [verb, noun, subject, ...options].join('|');
    }
    
    sendEscaped(verb, noun, subject, ...options) {
        const esc = this.esc;
        const escapedSubject = esc + subject + esc;
        this.send(this.createMessage(verb, noun, escapedSubject, ...options));
    }
    
    addMessageHandler(action, handler) {
        this.messageHandlers.set(action, handler);
    }
    
    removeMessageHandler(action) {
        this.messageHandlers.delete(action);
    }
    
    handleError(error) {
        console.error('WebSocket Hypermedia error:', error);
        this.options.onError?.(error);
    }
    
    disconnect() {
        this.ws?.close();
    }
    
    connect() {
        this._connect();
    }
    
    get readyState() {
        return this.ws?.readyState ?? WebSocket.CLOSED;
    }
    
    setupClickToSend() {
        document.addEventListener('click', (event) => {
            const el = event.target;
            
            if (this.shouldSkipElement(el)) {
                return;
            }
            
            if (!this.isInteractiveElement(el)) {
                event.preventDefault();
            }
            
            this.sendClickedElement(el);
        });
    }
    
    shouldSkipElement(el) {
        const skipTags = ['INPUT', 'BUTTON', 'A', 'SELECT', 'TEXTAREA', 'LABEL'];
        const skipTypes = ['submit', 'button', 'reset', 'checkbox', 'radio'];
        
        return skipTags.includes(el.tagName) || 
               (el.type && skipTypes.includes(el.type)) ||
               el.onclick !== null ||
               el.getAttribute('onclick') !== null;
    }
    
    isInteractiveElement(el) {
        const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
        const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio'];
        
        return interactiveTags.includes(el.tagName) ||
               interactiveRoles.includes(el.getAttribute('role'));
    }
    
    sendClickedElement(el) {
        const id = el.id || el.className || el.tagName.toLowerCase();
        this.sendEscaped(this.options.clickVerb, id, el.outerHTML);
    }
    
    enableClickToSend() {
        if (!this.options.enableClickToSend) {
            this.options.enableClickToSend = true;
            this.setupClickToSend();
        }
    }
    
    disableClickToSend() {
        this.options.enableClickToSend = false;
        console.log('Click-to-send disabled (requires page reload to fully remove)');
    }
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const script = document.currentScript || document.querySelector('script[src*="websocket-hypermedia.js"]');
        if (script?.dataset.url) {
            window.wsHypermedia = new WebSocketHypermedia(script.dataset.url);
        }
    });
} 