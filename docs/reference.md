# WebSocket Hypermedia Reference

> **Complete API Documentation**

This reference documents every public method, property, and configuration option available in the WebSocket Hypermedia library.

## Table of Contents

- [Constructor](#constructor)
- [Properties](#properties)
- [Methods](#methods)
- [Protocol Reference](#protocol-reference)
- [Configuration Options](#configuration-options)
- [Events](#events)
- [Error Handling](#error-handling)

## Constructor

### `new WebSocketHypermedia(url, options)`

Creates a new WebSocket Hypermedia instance.

**Parameters:**
- `url` (string): WebSocket server URL (e.g., `"ws://localhost:8765"`)
- `options` (object, optional): Configuration options

**Returns:** WebSocketHypermedia instance

**Example:**
```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    autoReconnect: true,
    reconnectDelay: 1000
});
```

## Properties

### `url`
- **Type:** string
- **Description:** The WebSocket server URL
- **Read-only:** Yes

### `options`
- **Type:** object
- **Description:** Current configuration options
- **Read-only:** Yes

### `ws`
- **Type:** WebSocket | null
- **Description:** The underlying WebSocket instance
- **Read-only:** Yes

### `reconnectAttempts`
- **Type:** number
- **Description:** Current number of reconnection attempts
- **Read-only:** Yes

### `isConnecting`
- **Type:** boolean
- **Description:** Whether a connection attempt is in progress
- **Read-only:** Yes

### `readyState`
- **Type:** number
- **Description:** Current WebSocket ready state
- **Values:** 0 (CONNECTING), 1 (OPEN), 2 (CLOSING), 3 (CLOSED)
- **Read-only:** Yes

## Methods

### Connection Management

#### `connect()`
Establishes a WebSocket connection.

**Parameters:** None

**Returns:** void

**Example:**
```javascript
ws.connect();
```

#### `disconnect()`
Closes the WebSocket connection.

**Parameters:** None

**Returns:** void

**Example:**
```javascript
ws.disconnect();
```

### Message Sending

#### `send(action)`
Sends a message to the server.

**Parameters:**
- `action` (string): Action string in format `"verb|noun|subject[|options...]"`

**Returns:** void

**Example:**
```javascript
ws.send("update|content|<p>Hello World</p>");
```

#### `createMessage(verb, noun, subject, ...options)`
Creates a properly formatted message string.

**Parameters:**
- `verb` (string): Action verb
- `noun` (string): Target element ID
- `subject` (string): Content or data
- `...options` (string): Additional options

**Returns:** string

**Example:**
```javascript
const message = ws.createMessage("update", "content", "<p>Hello</p>", "priority-high");
ws.send(message);
```

#### `sendEscaped(verb, noun, subject, ...options)`
Sends a message with automatic escaping of pipe characters.

**Parameters:**
- `verb` (string): Action verb
- `noun` (string): Target element ID
- `subject` (string): Content or data
- `...options` (string): Additional options

**Returns:** void

**Example:**
```javascript
ws.sendEscaped("update", "content", "Hello | World & Good Morning!");
```

### Event Handling

#### `addMessageHandler(action, handler)`
Registers a custom message handler.

**Parameters:**
- `action` (string): Action to handle
- `handler` (function): Handler function

**Returns:** void

**Example:**
```javascript
ws.addMessageHandler("custom_action", (data) => {
    console.log("Custom action received:", data);
});
```

#### `removeMessageHandler(action)`
Removes a custom message handler.

**Parameters:**
- `action` (string): Action to remove handler for

**Returns:** void

**Example:**
```javascript
ws.removeMessageHandler("custom_action");
```

### Error Handling

#### `handleError(error)`
Handles WebSocket errors.

**Parameters:**
- `error` (Error): Error object

**Returns:** void

**Example:**
```javascript
ws.handleError(new Error("Connection failed"));
```

## Protocol Reference

### Message Format

All messages follow the format: `verb|noun|subject[|options...]`

### Built-in Actions

#### Content Manipulation

| Verb | Description | Example |
|------|-------------|---------|
| `update` | Replace element content | `update|content|<p>New content</p>` |
| `append` | Add content to end | `append|list|<li>New item</li>` |
| `prepend` | Add content to beginning | `prepend|list|<li>First item</li>` |
| `replace` | Replace entire element | `replace|form|<form>...</form>` |
| `remove` | Remove element | `remove|old_element|` |
| `swap` | Alias for replace | `swap|content|<div>New</div>` |
| `before` | Insert before element | `before|target|<div>Before</div>` |
| `after` | Insert after element | `after|target|<div>After</div>` |

#### CSS Classes

| Verb | Description | Example |
|------|-------------|---------|
| `addClass` | Add CSS class | `addClass|button|active` |
| `removeClass` | Remove CSS class | `removeClass|button|inactive` |
| `toggleClass` | Toggle CSS class | `toggleClass|sidebar|collapsed` |

#### Attributes

| Verb | Description | Example |
|------|-------------|---------|
| `setAttr` | Set attribute | `setAttr|button|disabled|true` |
| `removeAttr` | Remove attribute | `removeAttr|button|disabled` |

#### Styles

| Verb | Description | Example |
|------|-------------|---------|
| `setStyle` | Set CSS property | `setStyle|element|background-color|red` |
| `removeStyle` | Remove CSS property | `removeStyle|element|background-color` |

#### Events

| Verb | Description | Example |
|------|-------------|---------|
| `trigger` | Trigger DOM event | `trigger|button|click` |

#### Form Controls

| Verb | Description | Example |
|------|-------------|---------|
| `setValue` | Set input value | `setValue|input|Hello World` |
| `setChecked` | Set checkbox/radio | `setChecked|checkbox|true` |
| `setSelected` | Set select options | `setSelected|select|option2` |

#### Animations

| Verb | Description | Example |
|------|-------------|---------|
| `animate` | Trigger animation | `animate|element|fadeIn|1s|ease` |
| `transition` | Set CSS transition | `transition|element|all|0.3s|ease` |
| `removeAnimation` | Remove animation | `removeAnimation|element` |
| `pauseAnimation` | Pause animation | `pauseAnimation|element` |
| `resumeAnimation` | Resume animation | `resumeAnimation|element` |
| `getAnimationState` | Get animation state | `getAnimationState|element` |
| `keyframe` | Custom keyframes | `keyframe|element|custom|{"0%": {"opacity": "0"}}|2s` |

### Escape Mechanism

Use the escape character (default: `~`) to escape content containing pipe characters:

```javascript
// Escape content with pipes
ws.sendEscaped("update", "content", "Hello | World & Good Morning!");

// Results in: update|content|~Hello | World & Good Morning!~
```

## Configuration Options

### Connection Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoReconnect` | boolean | `true` | Automatically reconnect on disconnect |
| `reconnectDelay` | number | `1000` | Delay between reconnection attempts (ms) |
| `maxReconnectAttempts` | number | `5` | Maximum reconnection attempts |

### Protocol Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `escapeChar` | string | `'~'` | Character used for escaping pipe characters |
| `protocolVersion` | string | `'1.1'` | Protocol version |
| `requireVersion` | boolean | `false` | Require specific protocol version |

### Security Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxJsonSize` | number | `1048576` | Maximum JSON size (1MB) |
| `enableJsonValidation` | boolean | `false` | Enable JSON validation |
| `maxMessageSize` | number | `1048576` | Maximum message size (1MB) |
| `maxParts` | number | `100` | Maximum message parts |
| `enableSecurityLogging` | boolean | `false` | Enable security logging |
| `securityLogLevel` | string | `'warn'` | Security log level |

### Feature Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableClickToSend` | boolean | `false` | Enable click-to-send feature |
| `clickVerb` | string | `'element_clicked'` | Verb for clicked elements |
| `enableLogging` | boolean | `true` | Enable console logging |

### Callback Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onConnect` | function | `null` | Called on successful connection |
| `onDisconnect` | function | `null` | Called on disconnect |
| `onError` | function | `null` | Called on error |
| `onMessage` | function | `null` | Called on message received |

## Events

### Connection Events

#### `onConnect()`
Called when WebSocket connection is established.

**Parameters:** None

**Example:**
```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    onConnect: () => {
        console.log("Connected to server");
    }
});
```

#### `onDisconnect()`
Called when WebSocket connection is closed.

**Parameters:** None

**Example:**
```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    onDisconnect: () => {
        console.log("Disconnected from server");
    }
});
```

#### `onError(error)`
Called when a WebSocket error occurs.

**Parameters:**
- `error` (Error): Error object

**Example:**
```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    onError: (error) => {
        console.error("WebSocket error:", error);
    }
});
```

#### `onMessage(message)`
Called when a message is received from the server.

**Parameters:**
- `message` (string): Received message

**Example:**
```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    onMessage: (message) => {
        console.log("Received:", message);
    }
});
```

## Error Handling

### Error Types

#### Connection Errors
- **WebSocket URL Invalid**: Invalid WebSocket URL format
- **Connection Failed**: Unable to establish connection
- **Connection Timeout**: Connection attempt timed out

#### Protocol Errors
- **Invalid Message Format**: Message doesn't follow `verb|noun|subject` format
- **Element Not Found**: Target element ID doesn't exist
- **Invalid Action**: Unknown action verb

#### Security Errors
- **Message Too Large**: Message exceeds size limit
- **Too Many Parts**: Message has too many parts
- **JSON Validation Failed**: Invalid JSON data

### Error Handling Example

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    onError: (error) => {
        console.error("WebSocket error:", error.message);
        
        // Handle specific error types
        if (error.message.includes("Connection failed")) {
            showNotification("Connection failed. Retrying...", "warning");
        } else if (error.message.includes("Element not found")) {
            console.warn("Target element not found:", error.details);
        }
    }
});

// Custom error handling for specific actions
ws.addMessageHandler("error", (data) => {
    const [errorType, message] = data.split("|");
    
    switch (errorType) {
        case "permission":
            showNotification("Access denied", "error");
            break;
        case "rate_limit":
            showNotification("Too many requests", "warning");
            break;
        default:
            showNotification(message, "error");
    }
});
```

## Browser Compatibility

### Supported Browsers
- Chrome 16+
- Firefox 11+
- Safari 7+
- Edge 12+
- Internet Explorer 10+

### WebSocket Support
The library requires native WebSocket support. For older browsers, consider using a WebSocket polyfill.

### Feature Detection

```javascript
if (typeof WebSocket !== 'undefined') {
    const ws = new WebSocketHypermedia("ws://localhost:8765");
} else {
    console.error("WebSocket not supported in this browser");
}
```

## Performance Considerations

### Message Size Limits
- **Default maximum message size**: 1MB
- **Default maximum parts**: 100
- **Recommended message size**: < 10KB for optimal performance

### Connection Limits
- **Default reconnection attempts**: 5
- **Default reconnection delay**: 1 second
- **Maximum reconnection delay**: 30 seconds (exponential backoff)

### Memory Usage
- **Base memory footprint**: ~13.5KB (uncompressed)
- **Gzipped size**: ~3.1KB
- **Runtime memory**: Minimal overhead per connection

## Security Considerations

### Server-Side Requirements
- **HTML Sanitization**: Required for all HTML content
- **JSON Validation**: Required for JSON data
- **Authentication**: Implement proper authentication
- **Rate Limiting**: Implement rate limiting
- **Message Size Limits**: Enforce message size limits

### Client-Side Security
- **URL Validation**: WebSocket URLs are validated
- **Element ID Validation**: Element IDs are validated
- **Error Handling**: Comprehensive error handling
- **Security Logging**: Optional security event logging

---

## Quick Reference

### Common Patterns

```javascript
// Basic usage
const ws = new WebSocketHypermedia("ws://localhost:8765");
ws.send("update|content|<p>Hello World</p>");

// With options
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    autoReconnect: true,
    reconnectDelay: 2000,
    onConnect: () => console.log("Connected!"),
    onError: (error) => console.error("Error:", error)
});

// Custom message handling
ws.addMessageHandler("custom", (data) => {
    console.log("Custom message:", data);
});

// Escaped content
ws.sendEscaped("update", "content", "Hello | World!");
```

### Ready States

```javascript
// Check connection status
if (ws.readyState === 1) {
    console.log("Connected");
} else if (ws.readyState === 0) {
    console.log("Connecting");
} else if (ws.readyState === 2) {
    console.log("Closing");
} else {
    console.log("Closed");
}
```

---

For more information, see:
- **Tutorials**: `tutorials.md` for step-by-step learning
- **Guides**: `guides.md` for implementation patterns
- **Concepts**: `concepts.md` for philosophical background 