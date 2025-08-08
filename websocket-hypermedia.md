# WebSocket Hypermedia Library

A minimal, powerful library for building real-time hypermedia applications using WebSockets. Transform your static HTML into dynamic, interactive experiences with just a few lines of JavaScript.

**Size**: ~7.3KB uncompressed, ~2.2KB gzipped  
**Protocol**: Simple action-based messaging  
**Browser Support**: All modern browsers with WebSocket support

## Quick Start

```html
<script src="websocket-hypermedia.js"></script>
<script>
const ws = new WebSocketHypermedia("ws://localhost:8765");
</script>
```

### Auto-Initialization

You can also auto-initialize the library by adding a `data-url` attribute to the script tag:

```html
<script src="websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
```

This creates a global `window.wsHypermedia` instance automatically.

---

# 📚 Tutorials

## Tutorial 1: Your First WebSocket Hypermedia App

### Step 1: Basic Setup

Create a simple HTML page with a content area:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First WebSocket App</title>
</head>
<body>
    <h1>Real-time Updates</h1>
    <div id="content">
        <p>Waiting for updates...</p>
    </div>
    
    <script src="websocket-hypermedia.js"></script>
    <script>
        const ws = new WebSocketHypermedia("ws://localhost:8765");
    </script>
</body>
</html>
```

### Step 2: Server-Side Updates

Your server can now send updates like this:

```python
# Python example
websocket.send("update|content|<p>Hello from server!</p>")
```

The content div will automatically update with the new HTML.

### Step 3: Add Interactivity

Add buttons that send actions to the server:

```html
<button data-action="refresh">Refresh</button>
<button data-action="get_time">Get Time</button>

<script>
const ws = new WebSocketHypermedia("ws://localhost:8765");

// Handle button clicks
document.body.addEventListener('click', (e) => {
    if (e.target.dataset.action && ws.readyState === WebSocket.OPEN) {
        ws.send(e.target.dataset.action);
    }
});
</script>
```

## Tutorial 2: Building a Live Chat System

### Step 1: Chat Interface

```html
<div id="chat_container">
    <div id="messages">
        <p class="system">Welcome to the chat!</p>
    </div>
    <input type="text" id="message_input" placeholder="Type your message...">
    <button data-action="send_message">Send</button>
</div>
```

### Step 2: Custom Message Handler

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765");

// Custom handler for chat messages
ws.addMessageHandler('chat_messages', (element, html, elementId) => {
    element.insertAdjacentHTML('beforeend', html);
    element.scrollTop = element.scrollHeight; // Auto-scroll
});

// Handle sending messages
document.body.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'send_message') {
        const input = document.getElementById('message_input');
        const message = input.value.trim();
        if (message) {
            ws.send(`send_message:${message}`);
            input.value = '';
        }
    }
});
```

### Step 3: Server-Side Chat Logic

```python
# When a user sends a message
def handle_message(websocket, message):
    if message.startswith('send_message:'):
        user_message = message.split(':', 1)[1]
        # Broadcast to all connected clients
        broadcast(f"append|messages|<p><strong>User:</strong> {user_message}</p>")
```

## Tutorial 3: Real-time Data Dashboard

### Step 1: Dashboard Layout

```html
<div id="dashboard">
    <div id="stats">
        <h2>Live Statistics</h2>
        <div id="user_count">Users: 0</div>
        <div id="message_count">Messages: 0</div>
    </div>
    <div id="activity_feed">
        <h2>Recent Activity</h2>
        <ul id="activities"></ul>
    </div>
</div>
```

### Step 2: Multiple Update Types

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765");

// Handle different types of updates
ws.addMessageHandler('user_count', (element, html, elementId) => {
    element.innerHTML = html;
    // Add animation
    element.style.animation = 'pulse 0.5s';
    setTimeout(() => element.style.animation = '', 500);
});

ws.addMessageHandler('activities', (element, html, elementId) => {
    element.insertAdjacentHTML('afterbegin', html);
    // Keep only last 10 activities
    const items = element.querySelectorAll('li');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
});
```

---

# 🧭 Guides

## Guide 1: Building a Sliding Window News Feed

### Problem
You want to show the latest news items but limit the visible count to prevent the page from becoming too long.

### Solution
Implement a client-side sliding window that keeps only the most recent items visible.

```javascript
class NewsFeed {
    constructor(maxVisible = 5) {
        this.maxVisible = maxVisible;
        this.allItems = [];
        this.ws = new WebSocketHypermedia("ws://localhost:8765");
        
        this.ws.addMessageHandler('news_list', (element, html, elementId) => {
            this.handleNewsUpdate(element, html);
        });
    }
    
    handleNewsUpdate(element, html) {
        // Extract news ID from HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const newsItem = tempDiv.querySelector('li');
        const newsId = newsItem.getAttribute('data-news-id');
        
        // Store the item
        this.allItems.push({ id: newsId, html });
        
        // Remove placeholder if exists
        const placeholder = element.querySelector('li');
        if (placeholder && placeholder.textContent === 'No news yet...') {
            placeholder.remove();
        }
        
        // Add new item
        element.insertAdjacentHTML('beforeend', html);
        
        // Implement sliding window
        const visibleItems = element.querySelectorAll('li');
        if (visibleItems.length > this.maxVisible) {
            visibleItems[0].remove();
        }
    }
    
    dismissItem(newsId) {
        // Remove from storage
        this.allItems = this.allItems.filter(item => item.id !== newsId);
        
        // Remove from DOM
        const item = document.querySelector(`[data-news-id="${newsId}"]`);
        if (item) item.remove();
        
        // Reveal hidden item if available
        const visibleItems = document.querySelectorAll('#news_list li');
        if (visibleItems.length < this.maxVisible) {
            const visibleIds = Array.from(visibleItems).map(item => 
                item.getAttribute('data-news-id')
            );
            const hiddenItem = this.allItems.find(item => 
                !visibleIds.includes(item.id)
            );
            if (hiddenItem) {
                document.getElementById('news_list')
                    .insertAdjacentHTML('beforeend', hiddenItem.html);
            }
        }
    }
}
```

## Guide 2: Implementing Optimistic UI Updates

### Problem
You want the UI to feel instant while waiting for server confirmation.

### Solution
Update the UI immediately, then sync with server response.

```javascript
class OptimisticUI {
    constructor() {
        this.ws = new WebSocketHypermedia("ws://localhost:8765");
        this.pendingActions = new Map();
    }
    
    addTodo(text) {
        const todoId = 'temp_' + Date.now();
        const todoHtml = `<li data-todo-id="${todoId}">${text} <button data-action="remove_todo" data-todo-id="${todoId}">Remove</button></li>`;
        
        // Optimistic update
        document.getElementById('todo_items').insertAdjacentHTML('beforeend', todoHtml);
        
        // Store pending action
        this.pendingActions.set(todoId, { action: 'add_todo', text });
        
        // Send to server
        this.ws.send(`add_todo:${text}`);
    }
    
    handleServerResponse(action, elementId, html) {
        if (action === 'todo_items') {
            // Server confirmed the update, clear pending actions
            this.pendingActions.clear();
        }
    }
}
```

## Guide 3: Building a Multi-Room Chat System

### Problem
You need to support multiple chat rooms with different users and messages.

### Solution
Use dynamic element IDs and room-specific handlers.

```javascript
class MultiRoomChat {
    constructor() {
        this.ws = new WebSocketHypermedia("ws://localhost:8765");
        this.currentRoom = 'general';
        this.setupRoomHandlers();
    }
    
    setupRoomHandlers() {
        // Dynamic handler for room messages
        this.ws.addMessageHandler('room_messages', (element, html, elementId) => {
            const roomId = elementId.split('_')[1]; // room_messages_general
            if (roomId === this.currentRoom) {
                element.insertAdjacentHTML('beforeend', html);
                element.scrollTop = element.scrollHeight;
            }
        });
        
        // Dynamic handler for room user lists
        this.ws.addMessageHandler('room_users', (element, html, elementId) => {
            const roomId = elementId.split('_')[1];
            if (roomId === this.currentRoom) {
                element.innerHTML = html;
            }
        });
    }
    
    joinRoom(roomId) {
        this.currentRoom = roomId;
        this.ws.send(`join_room:${roomId}`);
        
        // Update UI to show current room
        document.querySelectorAll('.room-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-room="${roomId}"]`).classList.add('active');
    }
    
    sendMessage(message) {
        this.ws.send(`send_message:${this.currentRoom}|${message}`);
    }
}
```

## Guide 4: Implementing Real-time Form Validation

### Problem
You want to validate form fields in real-time as users type.

### Solution
Use debounced input events and server-side validation.

```javascript
class RealTimeValidation {
    constructor() {
        this.ws = new WebSocketHypermedia("ws://localhost:8765");
        this.debounceTimers = new Map();
        this.setupValidationHandlers();
    }
    
    setupValidationHandlers() {
        this.ws.addMessageHandler('validation_result', (element, html, elementId) => {
            const fieldId = elementId.split('_')[1]; // validation_result_username
            const field = document.getElementById(fieldId);
            const feedback = document.getElementById(`${fieldId}_feedback`);
            
            if (feedback) {
                feedback.innerHTML = html;
                field.classList.toggle('valid', html.includes('valid'));
                field.classList.toggle('invalid', html.includes('invalid'));
            }
        });
    }
    
    validateField(fieldId, value) {
        // Clear existing timer
        if (this.debounceTimers.has(fieldId)) {
            clearTimeout(this.debounceTimers.get(fieldId));
        }
        
        // Set new timer
        const timer = setTimeout(() => {
            this.ws.send(`validate_field:${fieldId}|${value}`);
            this.debounceTimers.delete(fieldId);
        }, 300);
        
        this.debounceTimers.set(fieldId, timer);
    }
}

// Usage
const validator = new RealTimeValidation();
document.getElementById('username').addEventListener('input', (e) => {
    validator.validateField('username', e.target.value);
});
```

---

# 📖 Reference

## API Reference

### WebSocketHypermedia Class

#### Constructor
```javascript
new WebSocketHypermedia(url, options)
```

**Parameters:**
- `url` (string): WebSocket server URL
- `options` (object): Configuration options

**Options:**
- `autoReconnect` (boolean): Enable automatic reconnection (default: `true`)
- `reconnectDelay` (number): Base delay for reconnection attempts in ms (default: `1000`)
- `maxReconnectAttempts` (number): Maximum reconnection attempts (default: `5`)
- `escapeChar` (string): Character used to escape content with pipes (default: `~`)
- `onConnect` (function): Called when connection is established
- `onDisconnect` (function): Called when connection is lost
- `onError` (function): Called when an error occurs
- `onMessage` (function): Called for every message received

#### Methods

##### `connect()`
Manually connect to the WebSocket server.

##### `disconnect()`
Close the WebSocket connection.

##### `send(action)`
Send an action to the server.

**Parameters:**
- `action` (string): Action to send

**Examples:**
```javascript
ws.send('ping');
ws.send('get_time');
ws.send('send_message:Hello world');
ws.send('add_todo:Buy groceries');
```

##### `addMessageHandler(verb, handler)`
Register a custom handler for specific verbs.

**Parameters:**
- `verb` (string): Verb to handle
- `handler` (function): Handler function with signature `(element, subject, noun, options)`

**Example:**
```javascript
ws.addMessageHandler('custom_verb', (element, subject, noun, options) => {
    // Custom handling logic
    element.innerHTML = subject;
    element.classList.add('updated');
    
    // Handle options
    if (options.includes('priority-high')) {
        element.classList.add('priority-high');
    }
    
    console.log('Options:', options);
});
```

##### `removeMessageHandler(verb)`
Remove a custom message handler.

**Parameters:**
- `verb` (string): Verb to remove handler for

##### `sendEscaped(verb, noun, subject, ...options)`
Send a message with automatically escaped content.

**Parameters:**
- `verb` (string): Action to perform
- `noun` (string): Target element ID
- `subject` (string): Content to send (will be automatically escaped)
- `...options` (string): Additional parameters

**Example:**
```javascript
// Automatically wraps content in escape characters
ws.sendEscaped('update', 'content', '<p>Hello World | & Good Morning New York!</p>');
// Sends: update|content|~<p>Hello World | & Good Morning New York!</p>~
```

##### `createMessage(verb, noun, subject, ...options)`
Create a properly formatted message string.

**Parameters:**
- `verb` (string): Action to perform
- `noun` (string): Target element ID
- `subject` (string): Content to include
- `...options` (string): Additional parameters

**Returns:**
- `string`: Formatted message

**Example:**
```javascript
const message = ws.createMessage('update', 'content', '<p>Hello World</p>', 'priority-high');
// Returns: update|content|<p>Hello World</p>|priority-high
```

#### Properties

##### `readyState`
Get the current WebSocket connection state.

**Values:**
- `WebSocket.CONNECTING` (0): Connection is being established
- `WebSocket.OPEN` (1): Connection is ready to communicate
- `WebSocket.CLOSING` (2): Connection is in the process of closing
- `WebSocket.CLOSED` (3): Connection is closed or couldn't be opened

## Protocol Reference

### Message Format
```
verb|noun|subject[|extraParams...]
```

The WSHM protocol follows a simple `verb|noun|subject` pattern for all messages, with support for additional parameters:

- **verb**: The action to perform (e.g., `update`, `append`, `remove`)
- **noun**: The target element ID (e.g., `content`, `messages`, `notifications`)
- **subject**: The content or data (e.g., HTML content, or empty for remove actions)
- **extraParams**: Optional additional parameters (e.g., `code-black`, `priority-high`, `user-id-123`)

This pattern makes the protocol intuitive and extensible. When extending the protocol, follow this same pattern to maintain consistency. Extra parameters are transparently passed through to both server and client handlers.

### Escape Character Support

When your content contains pipe characters (`|`), you need to escape them to prevent parsing errors. The library supports a configurable escape character (default: `~`) to wrap content containing pipes.

#### Default Escape Character (Tilde)

**Example with pipes in content:**
```javascript
// This would break the protocol:
ws.send('update|content|<p>Hello World | & Good Morning New York!</p>');

// Use tilde to escape content with pipes:
ws.send('update|content|~<p>Hello World | & Good Morning New York!</p>~');
```

#### Custom Escape Character

You can configure a different escape character when creating the WebSocket instance:

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    escapeChar: '^', // Use caret instead of tilde
    // ... other options
});

// Now use caret for escaping:
ws.send('update|content|^<p>Hello World | & Good Morning New York!</p>^');
```

#### Helper Methods

The library provides convenient helper methods for working with escaped content:

```javascript
// Automatically escape content with pipes
ws.sendEscaped('update', 'content', '<p>Hello World | & Good Morning New York!</p>');

// Create properly formatted messages
const message = ws.createMessage('update', 'content', '<p>Hello World | & Good Morning New York!</p>');
ws.send(message);
```

#### Server-Side Escaping

Your server should also use the same escape character when sending content with pipes:

```python
# Python example
content_with_pipes = '<p>Hello World | & Good Morning New York!</p>'
websocket.send(f"update|content|~{content_with_pipes}~")

# Or with custom escape character
websocket.send(f"update|content|^{content_with_pipes}^")
```

#### Why Tilde?

The tilde (`~`) was chosen as the default escape character because:
- **No JavaScript conflicts**: Unlike backticks, it's not used for template literals
- **Rare in HTML/content**: Unlikely to appear in normal content
- **Easy to type**: Accessible on all keyboards
- **Clear visual distinction**: Easy to spot in messages

### Current Implementation
```
action|elementId|html[|extraParams...]
```

**Note**: The current implementation uses `action|elementId|html` but follows the same conceptual pattern as `verb|noun|subject`. Extra parameters are transparently captured and passed to handlers.

### Protocol Design Principles

WSHM follows these core principles inspired by HTMX and hypermedia design:

1. **Server-Driven**: The server controls what gets updated and when. Clients send simple actions, servers respond with HTML updates.

2. **Progressive Enhancement**: Applications work without JavaScript, then enhance with real-time features.

3. **Declarative**: HTML describes the desired state, not imperative JavaScript commands.

4. **Extensible**: New verbs can be added server-side without client changes.

5. **Simple**: The protocol is easy to understand and implement.

### Extending the Protocol

When extending WSHM, follow these guidelines:

- **Server-Side Extensions**: Add new verbs by implementing them on the server. The client library will automatically handle unknown verbs gracefully.

- **Client-Side Extensions**: Only add client-side JavaScript for UI/UX enhancements, not for extending the WSHM protocol itself.

- **Verb Naming**: Use clear, descriptive verbs that follow the `verb|noun|subject` pattern.

- **Backward Compatibility**: New verbs should not break existing functionality.

### Standard Actions

#### `update`
Replace the inner HTML of an element.

**Format:** `update|elementId|html[|extraParams...]`

**Example:**
```
update|content|<p>New content</p>
update|breaking-news|<p>Breaking news!</p>|priority-high|code-black
```

#### `append`
Add HTML to the end of an element.

**Format:** `append|elementId|html[|extraParams...]`

**Example:**
```
append|messages|<p>New message</p>
append|chat|Hello world|user-id-123|timestamp-1234567890
```

#### `prepend`
Add HTML to the beginning of an element.

**Format:** `prepend|elementId|html[|extraParams...]`

**Example:**
```
prepend|notifications|<div class="alert">New notification</div>
prepend|alerts|<div class="urgent">System alert</div>|priority-critical|type-system
```

#### `replace`
Replace the entire element with new HTML.

**Format:** `replace|elementId|html[|extraParams...]`

**Example:**
```
replace|form|<form>New form content</form>
replace|user-profile|<div>Updated profile</div>|user-id-456|version-2
```

#### `remove`
Remove an element from the DOM.

**Format:** `remove|elementId|[|extraParams...]`

**Example:**
```
remove|old_notification|
remove|expired-alert||reason-timeout|cleanup-auto
```

#### `swap` (HTMX-inspired)
Replace the entire element with new HTML (alias for `replace`).

**Format:** `swap|elementId|html`

**Example:**
```
swap|form|<form>New form content</form>
```

#### `before` (HTMX-inspired)
Insert HTML before the target element.

**Format:** `before|elementId|html`

**Example:**
```
before|content|<div class="alert">Warning message</div>
```

#### `after` (HTMX-inspired)
Insert HTML after the target element.

**Format:** `after|elementId|html`

**Example:**
```
after|content|<div class="footer">Additional content</div>
```



## Error Handling

### Connection Errors
```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    onError: (error) => {
        console.error('Connection error:', error);
        // Show user-friendly error message
        document.getElementById('status').textContent = 'Connection failed';
    }
});
```

### Message Processing Errors
```javascript
ws.addMessageHandler('risky_action', (element, html, elementId) => {
    try {
        // Potentially risky operation
        element.innerHTML = html;
    } catch (error) {
        console.error('Error processing message:', error);
        // Fallback behavior
        element.innerHTML = '<p>Error loading content</p>';
    }
});
```

### Reconnection Strategy
The library uses exponential backoff for reconnection attempts:

1. **Attempt 1**: 1 second delay
2. **Attempt 2**: 2 seconds delay
3. **Attempt 3**: 4 seconds delay
4. **Attempt 4**: 8 seconds delay
5. **Attempt 5**: 16 seconds delay

After the maximum attempts, reconnection stops until manually triggered.

## Edge Cases and Limitations

### Current Limitations

1. **Element Targeting**: Only supports `getElementById()` targeting. No support for CSS selectors or complex targeting.

2. **HTML Content Only**: The protocol only handles HTML content. No direct support for JSON data or binary content.

3. **Single Element Updates**: Each message can only target one element. No batch updates or multi-element operations.

4. **No State Management**: The library doesn't maintain application state or handle complex state transitions.

5. **Limited Error Recovery**: No built-in retry mechanisms for failed updates or partial failures.

6. **No Conflict Resolution**: No handling of concurrent updates or edit conflicts.

### Recommended Solutions

#### For Complex Targeting
```javascript
// Server-side: Use data attributes for targeting
ws.send('update|user-123|<div data-user-id="123">...</div>');

// Client-side: Custom handler for complex targeting
ws.addMessageHandler('update_user', (element, html, elementId) => {
    const userId = elementId.split('-')[1];
    const targetElement = document.querySelector(`[data-user-id="${userId}"]`);
    if (targetElement) targetElement.innerHTML = html;
});
```

#### For Batch Updates
```javascript
// Server-side: Send multiple messages
ws.send('update|header|New header');
ws.send('update|content|New content');
ws.send('update|footer|New footer');

// Or use a custom batch handler
ws.addMessageHandler('batch_update', (element, html, elementId) => {
    const updates = JSON.parse(html);
    Object.entries(updates).forEach(([id, content]) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = content;
    });
});
```

#### For State Management
```javascript
// Server-side: Include state in HTML
ws.send('update|form|' + 
    '<form data-state="submitting" data-user-id="123">...</form>');

// Client-side: Extract state from HTML
ws.addMessageHandler('update_form', (element, html, elementId) => {
    element.outerHTML = html;
    const newElement = document.getElementById(elementId);
    const state = newElement.dataset.state;
    if (state === 'submitting') {
        // Handle submitting state
    }
});
```

### Best Practices

1. **Use Semantic HTML**: Structure your HTML to be meaningful and accessible.

2. **Include Metadata**: Use data attributes to include state and context in your HTML.

3. **Graceful Degradation**: Ensure your application works without JavaScript.

4. **Error Boundaries**: Implement proper error handling for missing elements or failed updates.

5. **Performance**: Keep HTML updates small and focused. Avoid sending large HTML fragments.

6. **Server-Side Logic**: Keep business logic on the server. The client should only handle UI updates.

7. **Progressive Enhancement**: Start with static HTML, then add real-time features.

## Server-Side Extensibility

WSHM is designed to be extended primarily on the server side. Here's how to add new functionality:

### Adding New Verbs

```javascript
// Server-side: Add new verbs without client changes
function handleCustomAction(ws, action, elementId, data) {
    switch (action) {
        case 'highlight':
            ws.send(`update|${elementId}|<div class="highlight">${data}</div>`);
            break;
        case 'fade_out':
            ws.send(`update|${elementId}|<div class="fade-out">${data}</div>`);
            break;
        case 'slide_in':
            ws.send(`prepend|${elementId}|<div class="slide-in">${data}</div>`);
            break;
        default:
            // Handle unknown actions gracefully
            console.log('Unknown action:', action);
    }
}
```

### Client-Side Extensions (UI/UX Only)

```javascript
// Only add client-side code for UI/UX enhancements
ws.addMessageHandler('highlight', (element, html, elementId) => {
    element.innerHTML = html;
    element.style.animation = 'highlight 0.5s';
});

ws.addMessageHandler('fade_out', (element, html, elementId) => {
    element.innerHTML = html;
    element.style.transition = 'opacity 0.3s';
    element.style.opacity = '0';
});
```

### Key Principles

- **Server Controls State**: All business logic and state management happens on the server
- **Client Handles UI**: Client-side code only enhances the user experience
- **HTML as API**: Use HTML to communicate state and structure
- **Graceful Degradation**: Unknown actions don't break the system
- **Transparent Options Passing**: Options are passed through without interpretation

## Options Passing

WSHM supports transparent options passing in both directions. Options beyond the required three are captured and passed to handlers without interpretation.

### Examples

```javascript
// Server sends message with options
ws.send('update|breaking-news|<p>Breaking news!</p>|priority-high|code-black|user-id-123');

// Client receives and processes
ws.addMessageHandler('update', (element, subject, noun, options) => {
    element.innerHTML = subject;
    
    // Handle options
    if (options.includes('priority-high')) {
        element.classList.add('priority-high');
    }
    if (options.includes('code-black')) {
        element.classList.add('code-black');
    }
    
    console.log('Options:', options); // ['priority-high', 'code-black', 'user-id-123']
});

// Client sends message with options
ws.send('user-action|profile|update|user-id-456|timestamp-1234567890');

// Server receives and processes
// Server can parse: verb='user-action', noun='profile', subject='update', options=['user-id-456', 'timestamp-1234567890']
```

---

# 🧠 Concepts

## What is WebSocket Hypermedia?

WebSocket Hypermedia is an architectural pattern that combines the real-time capabilities of WebSockets with the simplicity and flexibility of hypermedia. It extends the traditional request-response model of the web to support bidirectional, real-time communication while maintaining the declarative nature of HTML.

### Core Principles

#### 1. **HTML as the Message Format**
Unlike traditional WebSocket applications that send JSON or custom protocols, WebSocket Hypermedia sends HTML fragments. This approach:

- **Leverages existing knowledge**: Developers already know HTML
- **Maintains consistency**: Same markup language for static and dynamic content
- **Enables progressive enhancement**: Works without JavaScript for basic functionality
- **Simplifies debugging**: HTML is human-readable and inspectable

#### 2. **Action-Based Protocol**
The simple `action|elementId|html` protocol provides:

- **Clear intent**: Each message has a specific purpose
- **Targeted updates**: Changes only the necessary parts of the page
- **Predictable behavior**: Standard actions work consistently across applications
- **Extensible design**: Custom actions can be added without breaking existing functionality

#### 3. **Server-Driven Updates**
The server controls what gets updated and when:

- **Centralized logic**: Business rules stay on the server
- **Consistent state**: All clients see the same updates
- **Reduced client complexity**: Less JavaScript needed for state management
- **Better security**: Sensitive operations remain server-side

## Historical Context

### The Evolution of Web Communication

#### 1. **Traditional Web (1990s-2000s)**
- **Request-Response**: Client requests, server responds
- **Page-based**: Full page reloads for updates
- **Stateless**: Each request independent
- **Simple**: Easy to understand and implement

#### 2. **AJAX Revolution (2000s-2010s)**
- **Partial updates**: Update parts of pages without full reload
- **JSON APIs**: Structured data exchange
- **Client-side state**: JavaScript manages application state
- **Complexity increase**: More sophisticated client-side code needed

#### 3. **Real-time Web (2010s-present)**
- **WebSockets**: Bidirectional communication
- **Event-driven**: Push-based updates
- **Complex protocols**: Custom message formats (JSON-RPC, GraphQL subscriptions)
- **State synchronization**: Keeping client and server in sync

#### 4. **WebSocket Hypermedia (Emerging)**
- **Real-time + Simplicity**: WebSocket power with HTML simplicity
- **Progressive enhancement**: Works with or without JavaScript
- **Server-driven**: Server controls the experience
- **Declarative**: HTML describes the desired state

### Why WebSocket Hypermedia?

#### Problems with Traditional Approaches

**JSON APIs + WebSockets:**
```javascript
// Complex client-side state management
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'user_joined') {
        updateUserList(data.users);
        showNotification(data.message);
        updateCounter(data.count);
    }
};
```

**WebSocket Hypermedia:**
```javascript
// Server sends HTML, client just displays it
socket.onmessage = (event) => {
    // action|elementId|html
    // update|user_list|<ul><li>Alice</li><li>Bob</li></ul>
    // append|notifications|<div>Alice joined</div>
    // update|counter|Users: 2
};
```

#### Benefits of the Hypermedia Approach

1. **Reduced Complexity**
   - Less client-side logic
   - No state synchronization issues
   - Simpler debugging

2. **Better Performance**
   - Smaller message sizes (HTML vs JSON + metadata)
   - Fewer client-side computations
   - Direct DOM updates

3. **Improved Maintainability**
   - Server controls the experience
   - Consistent behavior across clients
   - Easier to add new features

4. **Enhanced Accessibility**
   - Works with screen readers
   - Progressive enhancement friendly
   - Semantic HTML preserved

## Design Patterns

### 1. **Server-Sent State Pattern**
The server maintains the authoritative state and sends HTML representations to clients.

```python
# Server maintains state
class ChatRoom:
    def __init__(self):
        self.messages = []
        self.users = []
    
    def add_message(self, message):
        self.messages.append(message)
        # Send HTML to all clients
        html = f"<p><strong>{message.user}:</strong> {message.text}</p>"
        broadcast(f"append|messages|{html}")
```

### 2. **Action-Response Pattern**
Clients send actions, servers respond with HTML updates.

```javascript
// Client sends action
ws.send('add_todo:Buy groceries');

// Server responds with HTML
// append|todo_list|<li>Buy groceries <button data-action="complete_todo" data-todo-id="123">Complete</button></li>
```

### 3. **Progressive Enhancement Pattern**
Applications work without JavaScript, then enhance with real-time features.

```html
<!-- Works without JavaScript -->
<form action="/add-todo" method="POST">
    <input name="todo" placeholder="Add todo...">
    <button type="submit">Add</button>
</form>

<!-- Enhanced with WebSocket Hypermedia -->
<script>
const ws = new WebSocketHypermedia("ws://localhost:8765");
// Same form now works in real-time
</script>
```

### 4. **Sliding Window Pattern**
Keep only recent items visible to prevent performance issues.

```javascript
// Show only last 10 messages
ws.addMessageHandler('messages', (element, html, elementId) => {
    element.insertAdjacentHTML('beforeend', html);
    const items = element.querySelectorAll('li');
    if (items.length > 10) {
        items[0].remove(); // Remove oldest
    }
});
```

## Future Directions

### 1. **Standardization**
As WebSocket Hypermedia gains adoption, we may see:
- Standard action names and formats
- Browser-native support
- Framework integrations

### 2. **Advanced Features**
Potential enhancements:
- **Streaming updates**: Partial HTML updates
- **Conflict resolution**: Handling concurrent edits
- **Offline support**: Queue actions when disconnected
- **Compression**: Efficient HTML transmission

### 3. **Ecosystem Growth**
Emerging tools and libraries:
- **Server frameworks**: Built-in WebSocket Hypermedia support
- **Development tools**: Debugging and monitoring
- **Testing frameworks**: Automated testing of real-time features

## Conclusion

WebSocket Hypermedia represents a return to simplicity in real-time web development. By using HTML as the message format and keeping business logic on the server, it provides a powerful yet approachable way to build interactive web applications.

The pattern is particularly well-suited for:
- **Content-heavy applications**: News sites, blogs, documentation
- **Collaborative tools**: Chat applications, shared editors
- **Dashboards**: Real-time monitoring and analytics
- **E-commerce**: Live inventory, pricing updates

As the web continues to evolve, WebSocket Hypermedia offers a compelling alternative to complex client-side frameworks, emphasizing simplicity, performance, and maintainability.

---

## License

MIT License - feel free to use this library in your projects!

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Examples

Check out the demo application in this repository for complete examples of all the patterns discussed in this documentation. 