/**
 * WebSocket Hypermedia Core Library
 * A minimal library for WebSocket-based hypermedia applications
 * 
 * Protocol: action|elementId|html
 * Examples:
 * - update|content|<p>New content</p>
 * - append|news_list|<li>New item</li>
 * - prepend|messages|<div>New message</div>
 * - replace|form|<form>...</form>
 * - remove|old_element|
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
 * ws.addMessageHandler('custom_action', (element, html, elementId) => {
 *     // Custom handling logic
 * });
 * ```
 * 
 * Size: ~6.2KB uncompressed, ~1.7KB gzipped
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
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            if (this.options.onConnect) {
                this.options.onConnect();
            }
        };
        
        this.ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            this.isConnecting = false;
            if (this.options.onDisconnect) {
                this.options.onDisconnect(event);
            }
            
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
            let parts = data.split("|");
            
            // Protocol: action|elementId|html (3 parts)
            if (parts.length >= 3) {
                let action = parts[0];
                let elementId = parts[1];
                let html = parts[2];
                
                this.processAction(action, elementId, html);
            } else {
                console.warn('Invalid message format. Expected: action|elementId|html, got:', data);
            }
            
            // Call custom message handler if provided
            if (this.options.onMessage) {
                this.options.onMessage(data);
            }
            
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
    
    processAction(action, elementId, html) {
        const element = document.getElementById(elementId);
        
        if (!element) {
            console.warn('Element not found:', elementId);
            return;
        }
        
        // Check for custom handler first
        const customHandler = this.messageHandlers.get(action);
        if (customHandler) {
            customHandler(element, html, elementId);
            return;
        }
        
        // Default action handlers
        switch (action) {
            case "update":
                element.innerHTML = html;
                break;
            case "append":
                element.insertAdjacentHTML('beforeend', html);
                break;
            case "prepend":
                element.insertAdjacentHTML('afterbegin', html);
                break;
            case "replace":
                element.outerHTML = html;
                break;
            case "remove":
                element.remove();
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }
    
    send(action) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
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
        if (this.options.onError) {
            this.options.onError(error);
        }
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
    
    connect() {
        // Public method to manually connect
        this._connect();
    }
    
    get readyState() {
        return this.ws ? this.ws.readyState : WebSocket.CLOSED;
    }
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    // Create a global instance if URL is provided via data attribute
    document.addEventListener('DOMContentLoaded', () => {
        const script = document.currentScript || document.querySelector('script[src*="websocket-hypermedia.js"]');
        if (script && script.dataset.url) {
            window.wsHypermedia = new WebSocketHypermedia(script.dataset.url);
        }
    });
} 