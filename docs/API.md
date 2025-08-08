# WebSocket Hypermedia (WSHM) Reference Documentation

> **IMPORTANT**: This file is for explaining the code in `websocket-hypermedia.js` ONLY. 
> Test documentation belongs in `test/README.md`. 
> This reference file should contain API documentation, usage examples, and code explanations only.

## Overview

WebSocket Hypermedia Core Library - A minimal library for WebSocket-based hypermedia applications.

**Size**: ~13.5KB uncompressed, ~3.1KB gzipped

## ⚠️ **Security Notice**

This library is a **transparent protocol handler** that uses `innerHTML`, `outerHTML`, and `insertAdjacentHTML` without sanitization by design. 

**Server-side security is MANDATORY**:
- ✅ HTML sanitization (DOMPurify recommended)
- ✅ JSON validation (prototype pollution protection)
- ✅ Message size limits
- ✅ Authentication & authorization
- ✅ Content Security Policy headers

**Client-side security is already implemented**:
- ✅ WebSocket URL validation
- ✅ Element ID validation
- ✅ Basic error handling

See `security/SECURITY-RESPONSIBILITIES.md` for complete security guidance.

## Protocol

**Format**: `verb|noun|subject[|options...]`

### Escape Mechanism

Use configurable escape character (default: `~`) to escape content containing pipe characters.

### Examples

- `update|content|<p>New content</p>`
- `append|news_list|<li>New item</li>`
- `prepend|messages|<div>New message</div>`
- `replace|form|<form>...</form>`
- `remove|old_element|`
- `update|breaking-news|<p>Breaking news!</p>|priority-high|code-black`
- `update|content|~<p>Hello World | & Good Morning New York!</p>~`
- `append|log|~<span>Error: File not found | Path: /usr/local/bin</span>~`
- `element_clicked|content|~<p>Hello world</p>~` (from click-to-send feature)
- `addClass|button|active|highlight` (add multiple classes)
- `removeClass|button|inactive` (remove single class)
- `toggleClass|sidebar|collapsed` (toggle class state)
- `setAttr|button|disabled|true` (set boolean attribute)
- `setAttr|input|placeholder|Enter text...` (set text attribute)
- `setAttr|form|data-valid|true` (set data attribute)
- `removeAttr|button|disabled` (remove attribute)
- `setStyle|element|background-color|red` (set CSS property)
- `setStyle|element|width|100%` (set CSS property with units)
- `setStyle|element|font-family|Arial, sans-serif` (set CSS property with spaces)
- `removeStyle|element|background-color` (remove CSS property)
- `trigger|button|click` (trigger click event)
- `trigger|input|focus` (trigger focus event)
- `trigger|form|submit` (trigger form submission)
- `trigger|element|custom-event|{"data": "value"}` (trigger custom event with data)
- `setValue|input|Hello World` (set input value)
- `setValue|textarea|Multi-line text` (set textarea value)
- `setChecked|checkbox|true` (check checkbox)
- `setChecked|radio|true` (select radio button)
- `setSelected|select|option2` (select single option)
- `setSelected|multi-select|option1,option3` (select multiple options)
- `animate|element|fadeIn|1s|ease|0s|1|normal|none` (trigger animation with full parameters)
- `animate|element|slideIn|2.5s|ease-in-out` (trigger animation with duration and easing)
- `transition|element|all|0.3s|ease` (set CSS transition)
- `transition|element|opacity,transform|0.5s|ease-in` (set specific property transitions)
- `removeAnimation|element` (remove running animation)
- `pauseAnimation|element` (pause animation)
- `resumeAnimation|element` (resume animation)
- `getAnimationState|element` (get animation state)
- `keyframe|element|customAnimation|{"0%": {"opacity": "0"}, "100%": {"opacity": "1"}}|2s` (custom keyframes)

## Usage

### Basic Usage

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765");
```

### With Options

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    autoReconnect: true,
    reconnectDelay: 1000,
    maxReconnectAttempts: 5,
    escapeChar: '~', // Custom escape character (default: ~)
    enableClickToSend: true, // Enable click-to-send feature
    clickVerb: 'element_clicked', // Custom verb for clicked elements
    enableLogging: false, // Disable console logging in production
    onConnect: () => console.log('Connected!'),
    onDisconnect: () => console.log('Disconnected!'),
    onError: (error) => console.error('Error:', error),
    onMessage: (data) => console.log('Message:', data)
});
```

### Send Actions

```javascript
ws.send('ping');
ws.send('get_time');
```

### Send Content with Pipes Using Helper Method

```javascript
ws.sendEscaped('update', 'content', '<p>Hello World | & Good Morning New York!</p>');
```

### Or Manually Escape Content

```javascript
ws.send('update|content|~<p>Hello World | & Good Morning New York!</p>~');
```

### Add Custom Message Handlers

```javascript
ws.addMessageHandler('custom_verb', (element, subject, noun, options) => {
    // Custom handling logic
});
```

### Enable/Disable Click-to-Send After Initialization

```javascript
ws.enableClickToSend();
ws.disableClickToSend();
```

## API Reference

### Constructor

```javascript
new WebSocketHypermedia(url, options = {})
```

**Parameters:**
- `url` (string): WebSocket server URL
- `options` (object): Configuration options

**Default Options:**
```javascript
{
    autoReconnect: true,
    reconnectDelay: 1000,
    maxReconnectAttempts: 5,
    escapeChar: '~',
    enableClickToSend: false,
    clickVerb: 'element_clicked',
    onConnect: null,
    onDisconnect: null,
    onError: null,
    onMessage: null
}
```

### Methods

#### Core Methods

- `send(action)` - Send a raw action to the server
- `sendEscaped(verb, noun, subject, ...options)` - Send escaped content
- `createMessage(verb, noun, subject, ...options)` - Create a message string
- `addMessageHandler(action, handler)` - Add custom message handler
- `removeMessageHandler(action)` - Remove custom message handler
- `connect()` - Manually connect to server
- `disconnect()` - Disconnect from server
- `handleError(error)` - Handle errors

#### Click-to-Send Methods

- `setupClickToSend()` - Setup click-to-send functionality
- `enableClickToSend()` - Enable click-to-send after initialization
- `disableClickToSend()` - Disable click-to-send
- `shouldSkipElement(el)` - Check if element should be skipped
- `isInteractiveElement(el)` - Check if element is interactive
- `sendClickedElement(el)` - Send clicked element to server

#### Connection Management

- `_connect()` - Internal connection method
- `setupEventHandlers()` - Setup WebSocket event handlers
- `scheduleReconnect()` - Schedule reconnection with exponential backoff

#### Message Processing

- `handleMessage(data)` - Handle incoming messages (async)
- `parseMessage(data)` - Parse message into parts
- `processAction(verb, noun, subject, options)` - Process action (async)

### Properties

- `url` - WebSocket server URL
- `options` - Configuration options
- `ws` - WebSocket instance
- `reconnectAttempts` - Number of reconnection attempts
- `isConnecting` - Connection state
- `messageHandlers` - Map of custom message handlers
- `esc` - Cached escape character for performance
- `actions` - Cached action functions for performance
- `readyState` - WebSocket ready state

### Built-in Actions

The library provides these built-in actions:

#### Content Manipulation
- `update` - Set element's innerHTML
- `append` - Append content to element
- `prepend` - Prepend content to element
- `replace` - Replace element's outerHTML
- `remove` - Remove element from DOM
- `swap` - Replace element's outerHTML (alias for replace)
- `before` - Insert content before element
- `after` - Insert content after element

#### CSS Class Manipulation
- `addClass` - Add CSS class(es) to element
- `removeClass` - Remove CSS class(es) from element
- `toggleClass` - Toggle CSS class(es) on element

#### Attribute Manipulation
- `setAttr` - Set HTML attribute on element
- `removeAttr` - Remove HTML attribute from element

#### Style Manipulation
- `setStyle` - Set inline CSS style property on element
- `removeStyle` - Remove inline CSS style property from element

#### Event Delegation
- `trigger` - Trigger DOM event on element

#### Form Enhancement
- `setValue` - Set value on form elements (input, textarea, etc.)
- `setChecked` - Set checked state on checkboxes and radio buttons
- `setSelected` - Set selected option(s) on select elements

#### Animation & Transitions
- `animate` - Trigger CSS animations with full control
- `transition` - Set CSS transition properties
- `removeAnimation` - Remove/cancel running animations
- `pauseAnimation` - Pause running animations
- `resumeAnimation` - Resume paused animations
- `getAnimationState` - Get current animation state
- `keyframe` - Create custom keyframe animations

## Performance Optimizations

The library includes several performance optimizations:

1. **Cached frequently used values** - `this.esc` and `this.actions` are cached as instance properties
2. **Pre-computed action functions** - Action definitions are moved to constructor
3. **Optimized string operations** - Uses string concatenation instead of template literals
4. **Async support** - Message handling supports both synchronous and asynchronous custom handlers
5. **Optimized message parsing** - Caches `data.length` and improves loop efficiency

## Error Handling

The library provides comprehensive error handling:

- Connection errors are handled gracefully
- Unknown verbs are logged but don't break the system
- Missing elements are logged with warnings
- WebSocket state validation before sending
- Async error handling for custom handlers

## Browser Compatibility

- Uses standard WebSocket API
- Uses standard DOM APIs
- No external dependencies
- ES6+ features (may require transpilation for older browsers)
- Includes error handling patterns

## Auto-Initialization

The library automatically initializes when loaded with a `data-url` attribute:

```html
<script src="websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
```

This creates a global `window.wsHypermedia` instance.

## Size Constraints

- **Maximum uncompressed size**: 14KB
- **Maximum gzipped size**: 5KB
- **Compression ratio**: 15-50%

## Development Guidelines

### Code Style

- No comments allowed in the main library file (`websocket-hypermedia.js`)
- All documentation belongs in this reference file
- Keep the main file as small as possible
- Use short variable names where appropriate
- Optimize for size and performance

### Testing

The library includes comprehensive tests covering all functionality. See `test/README.md` for detailed test documentation.

## License

See LICENSE file for details. 