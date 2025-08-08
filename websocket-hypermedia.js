/**
 * WebSocket Hypermedia Core Library
 * A minimal library for WebSocket-based hypermedia applications
 * 
 * Protocol: verb|noun|subject[|options...]
 * Examples:
 * - update|content|<p>New content</p>
 * - append|news_list|<li>New item</li>
 * - prepend|messages|<div>New message</div>
 * - replace|form|<form>...</form>
 * - remove|old_element|
 * - update|breaking-news|<p>Breaking news!</p>|priority-high|code-black
 * 
 * Usage:
 * ```javascript
 * // Basic usage
 * const ws = new WebSocketHypermedia("ws://localhost:8765");
 * 
 * // With options
 * const ws = new WebSocketHypermedia("ws://localhost:8765", {
 *     autoReconnect: true,
 *     reconnectDelay: 1000,
 *     maxReconnectAttempts: 5,
 *     onConnect: () => console.log('Connected!'),
 *     onDisconnect: () => console.log('Disconnected!'),
 *     onError: (error) => console.error('Error:', error),
 *     onMessage: (data) => console.log('Message:', data)
 * });
 * 
 * // Send actions
 * ws.send('ping');
 * ws.send('get_time');
 * 
 * // Add custom message handlers
 * ws.addMessageHandler('custom_verb', (element, subject, noun, options) => {
 *     // Custom handling logic
 * });
 * ```
 * 
 * Size: ~7.3KB uncompressed, ~2.2KB gzipped
 */

class WebSocketHypermedia {
    constructor(url, options = {}) {
        this.url = url;
        this.options = {
            autoReconnect: true,
            reconnectDelay: 1000,
            maxReconnectAttempts: 5,
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
        
        this._connect();
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
            console.log('WebSocket connected');
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            onConnect?.();
        };
        
        this.ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            this.isConnecting = false;
            onDisconnect?.(event);
            
            if (this.options.autoReconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
                this.scheduleReconnect();
            }
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.handleError(error);
        };
        
        this.ws.onmessage = (event) => {
            this.handleMessage(event.data);
            onMessage?.(event.data);
        };
    }
    
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.options.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
        
        setTimeout(() => {
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                this._connect();
            }
        }, delay);
    }
    
    handleMessage(data) {
        console.log('Received message:', data);
        
        try {
            const parts = data.split("|");
            
            if (parts.length >= 3) {
                const verb = parts[0];
                const noun = parts[1];
                const subject = parts[2];
                const options = parts.slice(3); // Capture all additional parameters
                
                this.processAction(verb, noun, subject, options);
            } else {
                console.warn('Invalid message format. Expected: verb|noun|subject[|options...], got:', data);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
    
    processAction(verb, noun, subject, options = []) {
        const element = document.getElementById(noun);
        
        if (!element) {
            console.warn('Element not found:', noun);
            return;
        }
        
        // Check for custom handler first (for UI/UX enhancements only)
        const customHandler = this.messageHandlers.get(verb);
        if (customHandler) {
            // Pass options to custom handlers
            customHandler(element, subject, noun, options);
            return;
        }
        
        // Default server-controlled actions (HTMX-inspired)
        const actions = {
            update: () => element.innerHTML = subject,
            append: () => element.insertAdjacentHTML('beforeend', subject),
            prepend: () => element.insertAdjacentHTML('afterbegin', subject),
            replace: () => element.outerHTML = subject,
            remove: () => element.remove(),
            // HTMX-inspired actions
            swap: () => element.outerHTML = subject,
            before: () => element.insertAdjacentHTML('beforebegin', subject),
            after: () => element.insertAdjacentHTML('afterend', subject)
        };
        
        if (actions[verb]) {
            actions[verb]();
            // Log options for debugging (but don't break functionality)
            if (options.length > 0) {
                console.log(`Verb '${verb}' executed with options:`, options);
            }
        } else {
            // Unknown verbs are logged but don't break the system
            // This allows server-side extensibility without client changes
            console.warn('Unknown verb:', verb, '- Server can extend protocol without client updates');
            if (options.length > 0) {
                console.log('Options received:', options);
            }
        }
    }
    
    send(action) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('Sending action:', action);
            this.ws.send(action);
        } else {
            console.warn('WebSocket not ready, state:', this.ws?.readyState);
        }
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
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const script = document.currentScript || document.querySelector('script[src*="websocket-hypermedia.js"]');
        if (script?.dataset.url) {
            window.wsHypermedia = new WebSocketHypermedia(script.dataset.url);
        }
    });
} 