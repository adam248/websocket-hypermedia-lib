# WebSocket Hypermedia Guides

> **Practical Implementation Patterns and Solutions**

This guide covers common implementation scenarios, frequently asked questions, and specific patterns for building real-time applications with the WebSocket Hypermedia library.

## Table of Contents

- [Authentication & Authorization](#authentication--authorization)
- [Error Handling & Reconnection](#error-handling--reconnection)
- [Performance Optimization](#performance-optimization)
- [Security Best Practices](#security-best-practices)
- [State Management](#state-management)
- [Testing Strategies](#testing-strategies)
- [Deployment Considerations](#deployment-considerations)
- [Integration Patterns](#integration-patterns)

## Authentication & Authorization

### How do I add authentication to my WebSocket connection?

**Server-side (Node.js with JWT):**

```javascript
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const wss = new WebSocket.Server({ 
    port: 8765,
    verifyClient: (info) => {
        const token = info.req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return false;
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            info.req.user = decoded;
            return true;
        } catch (error) {
            return false;
        }
    }
});

wss.on('connection', (ws, req) => {
    ws.user = req.user; // User data from JWT
    
    ws.on('message', (message) => {
        // All messages now have access to ws.user
        const msg = message.toString();
        // Process message with user context
    });
});
```

**Client-side:**

```javascript
// Get token from your auth system
const token = localStorage.getItem('authToken');

const ws = new WebSocketHypermedia("ws://localhost:8765", {
    onConnect: () => {
        // Send authentication message
        ws.send("authenticate|user|" + token);
    }
});
```

### How do I implement role-based access control?

```javascript
// Server-side role checking
function checkPermission(user, action, resource) {
    const permissions = {
        'admin': ['read', 'write', 'delete'],
        'moderator': ['read', 'write'],
        'user': ['read']
    };
    
    return permissions[user.role]?.includes(action) || false;
}

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        const [verb, noun, subject, data] = message.toString().split('|');
        
        // Check permissions before processing
        if (!checkPermission(ws.user, verb, noun)) {
            ws.send("error|permission|Access denied");
            return;
        }
        
        // Process authorized action
        processAction(verb, noun, subject, data);
    });
});
```

## Error Handling & Reconnection

### How do I handle connection failures gracefully?

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    autoReconnect: true,
    reconnectDelay: 1000,
    maxReconnectAttempts: 10,
    onConnect: () => {
        console.log('Connected successfully');
        document.getElementById('status').textContent = 'Connected';
        document.getElementById('status').className = 'status connected';
    },
    onDisconnect: () => {
        console.log('Disconnected');
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('status').className = 'status disconnected';
    },
    onError: (error) => {
        console.error('WebSocket error:', error);
        showNotification('Connection error: ' + error.message, 'error');
    }
});

// Custom reconnection logic
ws.addMessageHandler('reconnect', (data) => {
    console.log('Server requested reconnection');
    ws.disconnect();
    setTimeout(() => ws.connect(), 2000);
});
```

### How do I implement exponential backoff for reconnections?

```javascript
class SmartWebSocket extends WebSocketHypermedia {
    constructor(url, options = {}) {
        super(url, options);
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    }
    
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }
        
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.reconnectAttempts++;
        
        console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
        
        setTimeout(() => {
            this.connect();
        }, delay);
    }
    
    onConnect() {
        this.reconnectAttempts = 0; // Reset on successful connection
        super.onConnect();
    }
}
```

## Performance Optimization

### How do I batch multiple updates for better performance?

```javascript
// Client-side batching
class BatchedWebSocket extends WebSocketHypermedia {
    constructor(url, options = {}) {
        super(url, options);
        this.batchSize = options.batchSize || 10;
        this.batchDelay = options.batchDelay || 100;
        this.pendingMessages = [];
        this.batchTimer = null;
    }
    
    sendBatched(verb, noun, subject, ...options) {
        this.pendingMessages.push({ verb, noun, subject, options });
        
        if (this.pendingMessages.length >= this.batchSize) {
            this.flushBatch();
        } else if (!this.batchTimer) {
            this.batchTimer = setTimeout(() => this.flushBatch(), this.batchDelay);
        }
    }
    
    flushBatch() {
        if (this.batchTimer) {
            clearTimeout(this.batchTimer);
            this.batchTimer = null;
        }
        
        if (this.pendingMessages.length === 0) return;
        
        const batch = this.pendingMessages.splice(0);
        const batchMessage = batch.map(msg => 
            `${msg.verb}|${msg.noun}|${msg.subject}|${msg.options.join('|')}`
        ).join('\n');
        
        this.send("batch|updates|" + batchMessage);
    }
}

// Usage
const ws = new BatchedWebSocket("ws://localhost:8765", { batchSize: 5, batchDelay: 50 });

// These will be batched together
for (let i = 0; i < 10; i++) {
    ws.sendBatched("update", `item-${i}`, `Updated item ${i}`);
}
```

### How do I implement message compression?

```javascript
// Server-side compression
const zlib = require('zlib');

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const msg = message.toString();
        
        // Compress large messages
        if (msg.length > 1024) {
            zlib.gzip(msg, (err, compressed) => {
                if (!err) {
                    ws.send("compressed|data|" + compressed.toString('base64'));
                } else {
                    ws.send(msg); // Fallback to uncompressed
                }
            });
        } else {
            ws.send(msg);
        }
    });
});

// Client-side decompression
ws.addMessageHandler('compressed', (data) => {
    // Decompress and process
    const decompressed = atob(data); // Base64 decode
    // Process decompressed message
});
```

## Security Best Practices

### How do I sanitize HTML content properly?

```javascript
// Server-side with DOMPurify
const DOMPurify = require('dompurify');

function sanitizeHTML(html, allowedTags = ['p', 'div', 'span', 'strong', 'em']) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: ['class', 'id', 'href'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onload', 'onerror', 'javascript:'],
        KEEP_CONTENT: true
    });
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const [verb, noun, subject, ...options] = message.toString().split('|');
        
        if (verb === 'update' || verb === 'append' || verb === 'prepend') {
            const sanitizedSubject = sanitizeHTML(subject);
            // Process sanitized content
            processAction(verb, noun, sanitizedSubject, options);
        }
    });
});
```

### How do I implement rate limiting?

```javascript
// Server-side rate limiting
const rateLimit = new Map();

function checkRateLimit(userId, limit = 100, windowMs = 60000) {
    const now = Date.now();
    const userLimits = rateLimit.get(userId) || [];
    
    // Remove old entries
    const recentRequests = userLimits.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= limit) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimit.set(userId, recentRequests);
    return true;
}

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        if (!checkRateLimit(ws.user.id)) {
            ws.send("error|rate_limit|Too many requests");
            return;
        }
        
        // Process message
        processMessage(message);
    });
});
```

## State Management

### How do I sync state across multiple clients?

```javascript
// Server-side state management
class ApplicationState {
    constructor() {
        this.state = new Map();
        this.subscribers = new Map();
    }
    
    set(key, value) {
        this.state.set(key, value);
        this.notifySubscribers(key, value);
    }
    
    get(key) {
        return this.state.get(key);
    }
    
    subscribe(key, ws) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(ws);
    }
    
    notifySubscribers(key, value) {
        const subscribers = this.subscribers.get(key);
        if (subscribers) {
            subscribers.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(`update|${key}|${value}`);
                }
            });
        }
    }
}

const appState = new ApplicationState();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const [verb, noun, subject] = message.toString().split('|');
        
        if (verb === 'subscribe') {
            appState.subscribe(noun, ws);
            // Send current state
            const currentValue = appState.get(noun);
            if (currentValue) {
                ws.send(`update|${noun}|${currentValue}`);
            }
        } else if (verb === 'set') {
            appState.set(noun, subject);
        }
    });
});
```

### How do I implement optimistic updates?

```javascript
// Client-side optimistic updates
class OptimisticWebSocket extends WebSocketHypermedia {
    constructor(url, options = {}) {
        super(url, options);
        this.pendingUpdates = new Map();
    }
    
    optimisticUpdate(elementId, newContent) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Store original content
        const originalContent = element.innerHTML;
        
        // Apply optimistic update
        element.innerHTML = newContent;
        
        // Send to server
        this.send(`update|${elementId}|${newContent}`);
        
        // Track for potential rollback
        this.pendingUpdates.set(elementId, originalContent);
    }
    
    handleServerResponse(elementId, serverContent) {
        // Remove from pending updates
        this.pendingUpdates.delete(elementId);
        
        // Update with server content (in case of conflicts)
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = serverContent;
        }
    }
    
    rollback(elementId) {
        const originalContent = this.pendingUpdates.get(elementId);
        if (originalContent) {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = originalContent;
            }
            this.pendingUpdates.delete(elementId);
        }
    }
}
```

## Testing Strategies

### How do I test WebSocket applications?

```javascript
// Test client setup
class TestWebSocketClient {
    constructor(url) {
        this.ws = new WebSocket(url);
        this.messages = [];
        this.connected = false;
        
        this.ws.onopen = () => {
            this.connected = true;
        };
        
        this.ws.onmessage = (event) => {
            this.messages.push(event.data);
        };
    }
    
    send(message) {
        if (this.connected) {
            this.ws.send(message);
        }
    }
    
    waitForMessage(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('Timeout waiting for message'));
            }, timeout);
            
            const checkMessages = () => {
                if (this.messages.length > 0) {
                    clearTimeout(timer);
                    resolve(this.messages.shift());
                } else {
                    setTimeout(checkMessages, 10);
                }
            };
            
            checkMessages();
        });
    }
    
    close() {
        this.ws.close();
    }
}

// Test example
async function testChatFunctionality() {
    const client1 = new TestWebSocketClient('ws://localhost:8765');
    const client2 = new TestWebSocketClient('ws://localhost:8765');
    
    // Wait for connections
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Send message from client1
    client1.send('append|messages|<div>Hello World</div>');
    
    // Check if client2 receives it
    const receivedMessage = await client2.waitForMessage();
    console.assert(receivedMessage.includes('Hello World'), 'Message not received');
    
    client1.close();
    client2.close();
}
```

## Deployment Considerations

### How do I deploy with load balancing?

```javascript
// Redis-based session sharing for multiple server instances
const Redis = require('ioredis');
const redis = new Redis();

class SharedWebSocketServer {
    constructor(wss) {
        this.wss = wss;
        this.setupRedis();
    }
    
    setupRedis() {
        // Subscribe to messages from other instances
        redis.subscribe('websocket:broadcast', (err, count) => {
            if (err) console.error('Redis subscription error:', err);
        });
        
        redis.on('message', (channel, message) => {
            if (channel === 'websocket:broadcast') {
                this.broadcastToLocalClients(message);
            }
        });
    }
    
    broadcastToLocalClients(message) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
    
    broadcastToAllInstances(message) {
        redis.publish('websocket:broadcast', message);
    }
}

const wss = new WebSocket.Server({ port: 8765 });
const sharedServer = new SharedWebSocketServer(wss);

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Broadcast to all instances
        sharedServer.broadcastToAllInstances(message.toString());
    });
});
```

### How do I implement health checks?

```javascript
// Health check endpoint
const http = require('http');

const healthServer = http.createServer((req, res) => {
    if (req.url === '/health') {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            connections: wss.clients.size,
            uptime: process.uptime()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(health));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

healthServer.listen(8080);
```

## Integration Patterns

### How do I integrate with React/Vue/Angular?

**React Integration:**

```javascript
// React hook for WebSocket Hypermedia
import { useState, useEffect, useRef } from 'react';

function useWebSocketHypermedia(url, options = {}) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const wsRef = useRef(null);
    
    useEffect(() => {
        wsRef.current = new WebSocketHypermedia(url, {
            ...options,
            onConnect: () => {
                setIsConnected(true);
                options.onConnect?.();
            },
            onDisconnect: () => {
                setIsConnected(false);
                options.onDisconnect?.();
            },
            onMessage: (message) => {
                setLastMessage(message);
                options.onMessage?.(message);
            }
        });
        
        return () => {
            wsRef.current?.disconnect();
        };
    }, [url]);
    
    const send = (verb, noun, subject, ...options) => {
        wsRef.current?.send(verb, noun, subject, ...options);
    };
    
    return { isConnected, lastMessage, send };
}

// Usage in React component
function ChatComponent() {
    const { isConnected, lastMessage, send } = useWebSocketHypermedia('ws://localhost:8765');
    
    const sendMessage = (message) => {
        send('append', 'messages', `<div>${message}</div>`);
    };
    
    return (
        <div>
            <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
            <div id="messages"></div>
            <button onClick={() => sendMessage('Hello!')}>Send</button>
        </div>
    );
}
```

### How do I integrate with existing REST APIs?

```javascript
// Hybrid REST + WebSocket approach
class HybridAPI {
    constructor(restBaseUrl, wsUrl) {
        this.restBaseUrl = restBaseUrl;
        this.ws = new WebSocketHypermedia(wsUrl);
    }
    
    // REST for CRUD operations
    async createUser(userData) {
        const response = await fetch(`${this.restBaseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    }
    
    // WebSocket for real-time updates
    subscribeToUserUpdates(userId) {
        this.ws.send('subscribe', 'user', userId);
    }
    
    // Handle real-time updates
    onUserUpdate(callback) {
        this.ws.addMessageHandler('user_update', callback);
    }
}

// Usage
const api = new HybridAPI('https://api.example.com', 'ws://localhost:8765');

// Create user via REST
const user = await api.createUser({ name: 'John', email: 'john@example.com' });

// Subscribe to real-time updates
api.subscribeToUserUpdates(user.id);
api.onUserUpdate((data) => {
    console.log('User updated:', data);
});
```

---

## Need More Help?

- **Tutorials**: Start with `tutorials.md` for step-by-step learning
- **Reference**: Check `reference.md` for complete API documentation
- **Concepts**: Read `concepts.md` to understand the philosophy
- **Examples**: Explore the `examples/` folder for working code samples

Happy building! 🚀 