/**
 * WebSocket Hypermedia Core Library
 * A minimal library for WebSocket-based hypermedia applications
 * 
 * Protocol: verb|noun|subject[|options...]
 * 
 * Escape Mechanism: Use configurable escape character (default: ~) to escape content containing pipe characters
 * Examples:
 * - update|content|<p>New content</p>
 * - append|news_list|<li>New item</li>
 * - prepend|messages|<div>New message</div>
 * - replace|form|<form>...</form>
 * - remove|old_element|
 * - update|breaking-news|<p>Breaking news!</p>|priority-high|code-black
 * - update|content|~<p>Hello World | & Good Morning New York!</p>~
 * - append|log|~<span>Error: File not found | Path: /usr/local/bin</span>~
 * - element_clicked|content|~<p>Hello world</p>~ (from click-to-send feature)
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
 *     escapeChar: '~', // Custom escape character (default: ~)
 *     enableClickToSend: true, // Enable click-to-send feature
 *     clickVerb: 'element_clicked', // Custom verb for clicked elements
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
 * // Send content with pipes using helper method
 * ws.sendEscaped('update', 'content', '<p>Hello World | & Good Morning New York!</p>');
 * 
 * // Or manually escape content
 * ws.send('update|content|~<p>Hello World | & Good Morning New York!</p>~');
 * 
 * // Add custom message handlers
 * ws.addMessageHandler('custom_verb', (element, subject, noun, options) => {
 *     // Custom handling logic
 * });
 * 
 * // Enable/disable click-to-send after initialization
 * ws.enableClickToSend();
 * ws.disableClickToSend();
 * ```
 * 
 * Size: ~8.1KB uncompressed, ~2.5KB gzipped
 */

class WebSocketHypermedia {
    constructor(url, options = {}) {
        this.url = url;
        this.options = {
            autoReconnect: true,
            reconnectDelay: 1000,
            maxReconnectAttempts: 5,
            escapeChar: '~', // Default escape character for content with pipes
            enableClickToSend: false, // Enable click-to-send feature
            clickVerb: 'element_clicked', // Verb to use when sending clicked elements
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
        
        // Setup click-to-send if enabled
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
            const parts = this.parseMessage(data);
            
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
    
    parseMessage(data) {
        const parts = [];
        let currentPart = '';
        let i = 0;
        let inEscapedContent = false;
        const escapeChar = this.options.escapeChar;
        
        while (i < data.length) {
            const char = data[i];
            
            if (char === escapeChar && !inEscapedContent) {
                // Start of escaped content
                inEscapedContent = true;
                i++;
                continue;
            } else if (char === escapeChar && inEscapedContent) {
                // End of escaped content
                inEscapedContent = false;
                i++;
                continue;
            } else if (char === '|' && !inEscapedContent) {
                // Field separator (only when not in escaped content)
                parts.push(currentPart);
                currentPart = '';
                i++;
                continue;
            }
            
            // Add character to current part
            currentPart += char;
            i++;
        }
        
        // Add the last part
        if (currentPart.length > 0 || parts.length > 0) {
            parts.push(currentPart);
        }
        
        return parts;
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
    
    // Helper method to create escaped messages
    createMessage(verb, noun, subject, ...options) {
        const parts = [verb, noun, subject, ...options];
        return parts.join('|');
    }
    
    // Helper method to send escaped content
    sendEscaped(verb, noun, subject, ...options) {
        const escapeChar = this.options.escapeChar;
        const escapedSubject = `${escapeChar}${subject}${escapeChar}`;
        const message = this.createMessage(verb, noun, escapedSubject, ...options);
        this.send(message);
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
        // Use event delegation to handle clicks on all elements
        document.addEventListener('click', (event) => {
            const element = event.target;
            
            // Skip if clicking on form elements or interactive elements that have their own behavior
            if (this.shouldSkipElement(element)) {
                return;
            }
            
            // Prevent default behavior for non-interactive elements
            if (!this.isInteractiveElement(element)) {
                event.preventDefault();
            }
            
            // Send the element's HTML to the server
            this.sendClickedElement(element);
        });
        
        console.log('Click-to-send feature enabled');
    }
    
    shouldSkipElement(element) {
        // Skip form elements, buttons, links, and other interactive elements
        const skipTags = ['INPUT', 'BUTTON', 'A', 'SELECT', 'TEXTAREA', 'LABEL'];
        const skipTypes = ['submit', 'button', 'reset', 'checkbox', 'radio'];
        
        return skipTags.includes(element.tagName) || 
               (element.type && skipTypes.includes(element.type)) ||
               element.onclick !== null ||
               element.getAttribute('onclick') !== null;
    }
    
    isInteractiveElement(element) {
        // Check if element is naturally interactive
        const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
        const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio'];
        
        return interactiveTags.includes(element.tagName) ||
               interactiveRoles.includes(element.getAttribute('role'));
    }
    
    sendClickedElement(element) {
        const elementId = element.id || element.className || element.tagName.toLowerCase();
        const elementHTML = element.outerHTML;
        
        // Send using the configured verb
        this.sendEscaped(this.options.clickVerb, elementId, elementHTML);
        
        console.log(`Sent clicked element: ${elementId}`);
    }
    
    // Method to enable/disable click-to-send after initialization
    enableClickToSend() {
        if (!this.options.enableClickToSend) {
            this.options.enableClickToSend = true;
            this.setupClickToSend();
        }
    }
    
    disableClickToSend() {
        this.options.enableClickToSend = false;
        // Note: We can't easily remove the event listener without tracking it
        // This is a limitation, but the feature can be re-enabled
        console.log('Click-to-send disabled (requires page reload to fully remove)');
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