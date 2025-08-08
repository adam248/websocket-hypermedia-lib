# ⚡ WebSocket Hypermedia Library

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Size](https://img.shields.io/badge/size-17KB%20source%20%7C%207.4KB%20minified%20%7C%202.7KB%20gzipped-lightgrey.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Tests](https://img.shields.io/badge/tests-204%2F204%20passing-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Performance](https://img.shields.io/badge/performance-50K%20msg%2Fs-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Version](https://img.shields.io/badge/version-v1.1.0-blue.svg)](https://github.com/adam248/websocket-hypermedia-lib/releases/tag/v1.1.0)
[![Stars](https://img.shields.io/github/stars/adam248/websocket-hypermedia-lib?style=social)](https://github.com/adam248/websocket-hypermedia-lib)
[![Forks](https://img.shields.io/github/forks/adam248/websocket-hypermedia-lib?style=social)](https://github.com/adam248/websocket-hypermedia-lib)
[![Issues](https://img.shields.io/github/issues/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/pulls)
[![Contributors](https://img.shields.io/github/contributors/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/commits)
[![Top Language](https://img.shields.io/github/languages/top/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib)
[![Security](https://img.shields.io/badge/security-audited-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib/tree/main/security)

**🚀 The fastest, smallest, and most powerful real-time hypermedia library for WebSockets!**

Transform your static HTML into dynamic, interactive experiences with just **one line of JavaScript**. No frameworks, no dependencies, no bloat - just pure, lightning-fast real-time updates with enterprise-grade security and powerful animation capabilities.

**✨ Production Ready v1.1.0** - Tested, optimized, and battle-hardened with comprehensive security features and animation system!

**Note:** This library requires JavaScript to function. The "progressive enhancement" approach means you can build traditional HTML forms first, then enhance them with real-time capabilities.

## 🚀 Quick Start - One Line to Real-Time!

```html
<script src="src/websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
```

**That's it!** Your page is now ready for real-time updates from the server. The library auto-initializes and creates a global `window.wsHypermedia` instance.

**🎯 Server sends:** `update|content|<p>Hello World!</p>`  
**⚡ Page updates:** Instantly, no JavaScript needed!

## 🆕 **New in v1.1.0 - Major Feature Expansion!**

### 🎬 **Animation System**
- **CSS Animations**: `animate|element|fadeIn|1s|ease|0|1|normal|forwards`
- **CSS Transitions**: `transition|element|all|0.3s|ease`
- **Custom Keyframes**: `keyframe|element|customAnimation|{"0%": {"opacity": "0"}}|2s`
- **Animation Control**: `pauseAnimation|element`, `resumeAnimation|element`, `removeAnimation|element`
- **Animation State**: `getAnimationState|element` - Query animation properties

### 🛡️ **Enterprise Security Features**
- **JSON Validation**: Prototype pollution protection and size limits
- **Message Size Limits**: Configurable message size and parts limits
- **Security Logging**: Optional security event logging with configurable levels
- **Input Sanitization**: Extensible input sanitization hooks framework
- **Protocol Versioning**: Optional protocol version validation for future compatibility

### 🔧 **Advanced Protocol Features**
- **HTMX-inspired Actions**: `swap`, `before`, `after` for flexible DOM manipulation
- **Custom Verb Support**: Extensible protocol with custom message handlers
- **Complex Options**: Support for multiple options in protocol messages
- **Batch Operations**: Efficient handling of multiple operations

### ✨ **Enhanced DOM Manipulation**
- **CSS Classes**: `addClass|button|active`, `removeClass|sidebar|collapsed`, `toggleClass|theme|dark`
- **HTML Attributes**: `setAttr|button|disabled|true`, `removeAttr|input|readonly`
- **Inline Styles**: `setStyle|element|background-color|red`, `removeStyle|element|width`
- **Event Delegation**: `trigger|button|click`, `trigger|form|submit`

### 📝 **Form Enhancement**
- **Input Values**: `setValue|input|Hello World`
- **Checkboxes/Radio**: `setChecked|checkbox|true`
- **Select Options**: `setSelected|select|option2`, `setSelected|multi-select|option1|option3`

## ✨ Why WebSocket Hypermedia?

### 🚀 **Performance That Blows Minds**
- **⚡ Lightning Fast**: 50,000+ messages per second
- **📦 Ultra Tiny**: 17KB source, 7.4KB minified, 2.7KB gzipped (84% compression!)
- **🎯 Zero Bloat**: No dependencies, no frameworks, no overhead
- **⚡ Low Latency**: <1ms average latency
- **💾 Memory Efficient**: ~1KB memory per message

### 🔒 **Enterprise-Grade Security**
- **🛡️ JSON Validation**: Prototype pollution protection and size limits
- **📏 Message Limits**: Configurable message size and parts limits
- **🔐 Safe DOM**: Element ID validation and secure operations
- **📝 Security Logging**: Optional security event monitoring
- **✅ Battle-Tested**: 204/204 tests passing (100%)

### 🎯 **Developer Experience**
- **⚡ One-Line Setup**: Auto-initialization with data-url
- **🔄 Smart Reconnection**: Exponential backoff strategy
- **🔧 Extensible**: Custom message handlers and protocol verbs
- **📖 Complete Docs**: Tutorials, API reference, security guides
- **🎨 Animation Ready**: Built-in CSS animation and transition support

### 🌟 **Real-World Ready**
- **💬 Chat Apps**: Real-time messaging with animations
- **📊 Live Dashboards**: Real-time data visualization with smooth transitions
- **🎮 Multiplayer Games**: Real-time game state with animated feedback
- **📝 Collaborative Editing**: Live document editing with visual cues
- **🛒 E-commerce**: Live inventory and pricing with dynamic updates
- **🎨 Dynamic UI**: CSS animations, transitions, and interactive elements
- **📝 Form Enhancement**: Real-time validation and auto-fill
- **🔧 DOM Manipulation**: Attributes, styles, classes, and events

## 📁 Project Structure

```
websocket-hypermedia-lib/
├── 📁 src/                          # Source code
│   └── websocket-hypermedia.js      # Main library file
├── 📁 dist/                         # Built/compiled files
├── 📁 docs/                         # User documentation
├── 📁 examples/                     # Code examples
├── 📁 test/                         # Test suite
├── 📁 changelog/                    # Version history
├── 📁 security/                     # Security documentation
└── 📁 scripts/                      # Build scripts
```

## 📖 Documentation

📚 **[Complete Documentation](docs/README.md)** - Everything you need to know
📖 **[API Reference](docs/API.md)** - Complete API documentation
🔒 **[Security Guide](security/SECURITY-RESPONSIBILITIES.md)** - Security best practices
⚡ **[Quick Reference](security/SECURITY-QUICK-REFERENCE.md)** - Security quick start

The documentation includes:
- **Tutorials**: Step-by-step guides to get started
- **Guides**: Advanced patterns and problem-solving
- **Reference**: Complete API documentation
- **Security**: Comprehensive security guides and responsibilities
- **Concepts**: Deep dive into WebSocket Hypermedia philosophy

**Important Development Note**: The main library file (`websocket-hypermedia.js`) contains NO COMMENTS to keep it as small as possible. All documentation and comments belong in the reference files. The main file has a single immutable comment at the top stating this policy.

## 🎯 Examples - See the Magic!

### ⚡ **One-Line Real-Time Chat**
```html
<div id="messages"></div>
<script src="src/websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
```
**Server sends:** `append|messages|<p><strong>Alice:</strong> Hello world!</p>`  
**Result:** Message appears instantly! ✨

### 🎬 **Animated Notifications**
```html
<div id="notifications"></div>
<script src="src/websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
```
**Server sends:** `append|notifications|<div class="alert">New message!</div>`  
**Server sends:** `animate|notifications|fadeIn|0.5s|ease`  
**Result:** Notification appears with smooth fade-in animation! 🎨

### 🎨 **Interactive Examples**
Check out the comprehensive examples in the `examples/` directory:

- **`animation-demo.html`** - CSS animations and transitions
- **`attribute-demo.html`** - HTML attribute manipulation  
- **`css-class-demo.html`** - CSS class management
- **`event-demo.html`** - Event delegation and triggering
- **`form-demo.html`** - Form enhancement and validation
- **`style-demo.html`** - Inline style manipulation

**Run examples:** `cd test && npm start` then open any example file in your browser!

### 🔧 **Custom Chat with Auto-Scroll**
```javascript
window.wsHypermedia.addMessageHandler('chat_messages', (element, html, elementId) => {
    element.insertAdjacentHTML('beforeend', html);
    element.scrollTop = element.scrollHeight; // Auto-scroll to bottom
});
```

### 🎮 **Interactive Dashboard with Animations**
```html
<button data-action="refresh">🔄 Refresh</button>
<button data-action="get_time">⏰ Get Time</button>
<div id="status">Ready...</div>

<script>
document.body.addEventListener('click', (e) => {
    if (e.target.dataset.action && window.wsHypermedia.readyState === WebSocket.OPEN) {
        window.wsHypermedia.send(e.target.dataset.action);
    }
});
</script>
```
**Server sends:** `update|status|Processing...`  
**Server sends:** `addClass|status|loading`  
**Server sends:** `animate|status|pulse|1s|ease|0|infinite`  
**Result:** Interactive dashboard with loading animations! 🎨

### 📊 **Live Data Updates with Transitions**
```html
<div id="stock-price">Loading...</div>
<div id="user-count">0 users online</div>
```
**Server sends:** `transition|stock-price|color|0.3s|ease`  
**Server sends:** `update|stock-price|<span class="price">$150.25</span>`  
**Result:** Price updates with smooth color transitions! 📈

## 🛠️ Installation - Choose Your Adventure!

### ⚡ **CDN (Recommended)**
```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/gh/adam248/websocket-hypermedia-lib@main/src/websocket-hypermedia.js"></script>

<!-- Production-ready v1.1.0 -->
<script src="https://cdn.jsdelivr.net/gh/adam248/websocket-hypermedia-lib@v1.1.0/src/websocket-hypermedia.js"></script>

<!-- Ultra-compressed v1.1.0 (2.7KB gzipped!) -->
<script src="https://cdn.jsdelivr.net/gh/adam248/websocket-hypermedia-lib@v1.1.0/dist/websocket-hypermedia.min.js"></script>
```

### 📦 **Direct Download**
```bash
# Source file (17KB)
curl -O https://raw.githubusercontent.com/adam248/websocket-hypermedia-lib/v1.1.0/src/websocket-hypermedia.js

# Minified version (7.4KB)
curl -O https://raw.githubusercontent.com/adam248/websocket-hypermedia-lib/v1.1.0/dist/websocket-hypermedia.min.js

# Gzipped version (2.7KB)
curl -O https://raw.githubusercontent.com/adam248/websocket-hypermedia-lib/v1.1.0/dist/websocket-hypermedia.min.js.gz
```

### 🎯 **NPM (Coming Soon)**
```bash
npm install websocket-hypermedia
```

## 🔧 Configuration

### Manual Initialization (Advanced)

For more control, you can manually initialize the library:

```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    // Connection settings
    autoReconnect: true,           // Enable auto-reconnection
    reconnectDelay: 1000,          // Base delay for reconnection
    maxReconnectAttempts: 5,       // Maximum reconnection attempts
    
    // Security settings (optional)
    maxJsonSize: 1024 * 1024,      // 1MB JSON size limit
    enableJsonValidation: true,    // Enable JSON validation
    maxMessageSize: 1024 * 1024,   // 1MB message size limit
    maxParts: 100,                 // Maximum message parts
    enableSecurityLogging: true,   // Enable security logging
    securityLogLevel: 'warn',      // Security log level
    
    // Protocol settings
    protocolVersion: '1.1',        // Protocol version
    requireVersion: false,         // Require version matching
    
    // Event handlers
    onConnect: () => console.log('Connected!'),
    onDisconnect: () => console.log('Disconnected!'),
    onError: (error) => console.error('Error:', error),
    onMessage: (data) => console.log('Message:', data)
});
```

## 📡 Protocol

The library uses a simple action-based protocol following the `verb|noun|subject` pattern:

```
action|elementId|html[|extraParams...]
```

Options are transparently passed through to handlers in both directions.

### Design Principles

- **Server-Driven**: Server controls what gets updated and when
- **Progressive Enhancement**: Can be built on traditional HTML foundations, enhanced with real-time features
- **Declarative**: HTML describes the desired state
- **Extensible**: New actions can be added server-side without client changes
- **Simple**: Easy to understand and implement
- **Secure**: Built-in security features with defense-in-depth approach

### Standard Actions
- `update` - Replace element content
- `append` - Add to end of element
- `prepend` - Add to beginning of element
- `replace` - Replace entire element
- `remove` - Remove element
- `swap` - Replace entire element (HTMX-inspired)
- `before` - Insert before element (HTMX-inspired)
- `after` - Insert after element (HTMX-inspired)

### Animation Actions
- `animate` - CSS animations with configurable parameters
- `transition` - CSS transitions with customizable properties
- `keyframe` - Custom keyframe animations with JSON configuration
- `pauseAnimation` - Pause running animations
- `resumeAnimation` - Resume paused animations
- `removeAnimation` - Remove animations
- `getAnimationState` - Query animation state and properties

### DOM Manipulation Actions
- `addClass` - Add CSS class to element
- `removeClass` - Remove CSS class from element
- `toggleClass` - Toggle CSS class on element
- `setAttr` - Set HTML attribute
- `removeAttr` - Remove HTML attribute
- `setStyle` - Set inline CSS style
- `removeStyle` - Remove inline CSS style
- `trigger` - Trigger DOM event

### Form Actions
- `setValue` - Set input value
- `setChecked` - Set checkbox/radio checked state
- `setSelected` - Set select option(s)

### Examples
```
update|content|<p>New content</p>
append|messages|<li>New message</li>
prepend|notifications|<div>Alert!</div>
replace|form|<form>New form</form>
remove|old_element|
swap|form|<form>New form</form>
before|content|<div>Warning</div>
after|content|<div>Footer</div>
animate|element|fadeIn|1s|ease|0|1|normal|forwards
transition|element|all|0.3s|ease
keyframe|element|customAnimation|{"0%": {"opacity": "0"}}|2s
addClass|button|active
setAttr|button|disabled|true
setStyle|element|background-color|red
trigger|button|click
setValue|input|Hello World
update|breaking-news|<p>Breaking news!</p>|priority-high|code-black
```

### Escape Character Support

When content contains pipe characters (`|`), use the tilde (`~`) escape character:

```javascript
// Content with pipes
ws.send('update|content|~<p>Hello World | & Good Morning New York!</p>~');

// Or use the helper method
ws.sendEscaped('update', 'content', '<p>Hello World | & Good Morning New York!</p>');

// Custom escape character
const ws = new WebSocketHypermedia("ws://localhost:8765", { escapeChar: '^' });
ws.send('update|content|^<p>Hello World | & Good Morning New York!</p>^');
```

## 🌟 Real-World Use Cases - See It in Action!

### 💬 **Chat Applications**
- **Slack-style messaging** with real-time updates and animations
- **Live typing indicators** and message delivery with smooth transitions
- **Auto-scrolling chat windows** with custom handlers and visual feedback

### 📊 **Live Dashboards**
- **Stock tickers** with real-time price updates and color transitions
- **System monitoring** with live metrics and animated alerts
- **User activity feeds** with instant notifications and smooth animations

### 🎮 **Multiplayer Games**
- **Real-time game state** synchronization with animated feedback
- **Live player actions** and updates with visual cues
- **Dynamic UI updates** without page refreshes and smooth transitions

### 📝 **Collaborative Editors**
- **Live document editing** with real-time sync and visual indicators
- **Cursor position sharing** between users with animated cursors
- **Instant content updates** across all clients with smooth transitions

### 🛒 **E-commerce**
- **Live inventory updates** as items sell with animated counters
- **Real-time pricing** and availability with price change animations
- **Live order tracking** and status updates with progress indicators

### 📈 **Analytics & Monitoring**
- **Real-time metrics** and performance data with animated charts
- **Live user activity** and engagement with dynamic visualizations
- **Instant alert systems** and notifications with attention-grabbing animations

## 🔒 Security Features

### **Enterprise-Grade Security**
- **JSON Validation**: Prototype pollution protection and configurable size limits
- **Message Size Limits**: Configurable message size and parts count limits
- **Security Logging**: Optional security event logging with configurable levels
- **Input Sanitization**: Extensible input sanitization hooks framework
- **Protocol Versioning**: Optional protocol version validation for future compatibility

### **Security Configuration**
```javascript
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    // Enable security features for production
    enableJsonValidation: true,    // Prototype pollution protection
    maxJsonSize: 1024 * 1024,      // 1MB JSON limit
    maxMessageSize: 1024 * 1024,   // 1MB message limit
    maxParts: 100,                 // Maximum message parts
    enableSecurityLogging: true,   // Security event logging
    securityLogLevel: 'warn',      // Log level: 'warn' or 'error'
    protocolVersion: '1.1',        // Protocol version
    requireVersion: false          // Version enforcement
});
```

### **Security Documentation**
- **[Security Responsibilities](security/SECURITY-RESPONSIBILITIES.md)** - Complete security guide
- **[Security Quick Reference](security/SECURITY-QUICK-REFERENCE.md)** - Quick security setup
- **[Security Audit Report](security/SECURITY-AUDIT-2025-01-08.md)** - Detailed security audit
- **[Security Implementation](security/SECURITY-IMPLEMENTATION-SUMMARY.md)** - Security implementation details

## 🤝 Contributing - Join the Revolution!

We welcome contributions! This library prioritizes **leanness, size, speed, and simplicity** above everything else.

### 🎯 **Our Philosophy**
- **Size Limit**: This library can **never exceed 20KB uncompressed / 14KB gzipped** - this is a hard line in the sand
- **Performance First**: Every feature must maintain our 50K+ messages/second performance
- **Zero Bloat**: No dependencies, no frameworks, no unnecessary complexity
- **Security Focus**: All contributions must pass our security audit

### 🚀 **Contribution Guidelines**

- **🐛 Bug Fixes**: All bug reports and fixes are welcome and will be considered
- **✨ New Features**: Must pass a very high bar to be added. We prioritize core functionality over feature bloat
- **🔧 Extensions**: If you need to extend this library, please create code in a separate repository
- **📖 Documentation**: Improvements to docs, examples, and tutorials are always welcome

### How to Contribute

1. **Report Bugs**: Create an issue with clear reproduction steps
2. **Suggest Features**: Open a discussion to gauge community interest
3. **Submit Fixes**: Fork the repo, make minimal changes, and submit a pull request
4. **Create Extensions**: Build separate libraries that work with this core library

### Development Setup

#### Using Nix (Recommended)
```bash
git clone https://github.com/adam248/websocket-hypermedia-lib.git
cd websocket-hypermedia-lib
nix-shell
# Now you have all build tools available
npm install
npm run build
npm run test:local
```

#### Without Nix
```bash
git clone https://github.com/adam248/websocket-hypermedia-lib.git
cd websocket-hypermedia-lib
npm install
# Run tests to verify everything works
./test.sh
```

### Running Tests

#### Quick Test (Recommended)
```bash
# From project root
./test.sh

# Or from test directory
cd test
npm test
```

This runs comprehensive automated tests (**204 test cases**) covering core functionality, edge cases, security features, performance benchmarks, animation system, and the primary data-url auto-initialization feature with clear results.

#### Manual Testing (Optional)
```bash
cd test
npm start
# Then open test-client.html in your browser for interactive testing
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inspired by** the simplicity of hypermedia-driven applications
- **Built on** the power of WebSocket technology  
- **Thanks to** the open source community for inspiration and feedback
- **Special thanks** to all contributors who helped make v1.1.0 production-ready with security and animation features!

## 📞 Support

- **📧 Email**: 85082674+adam248@users.noreply.github.com
- **🐛 Issues**: [GitHub Issues](https://github.com/adam248/websocket-hypermedia-lib/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/adam248/websocket-hypermedia-lib/discussions)
- **📖 Documentation**: [Complete Docs](docs/README.md)
- **🔒 Security**: [Security Documentation](security/SECURITY-RESPONSIBILITIES.md)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=adam248/websocket-hypermedia-lib&type=Date)](https://star-history.com/#adam248/websocket-hypermedia-lib&Date)

---

## 🎉 **Ready to Build Something Amazing?**

**WebSocket Hypermedia v1.1.0** is production-ready and waiting to power your next real-time application!

- **⚡ Lightning fast** - 50K+ messages/second
- **📦 Ultra tiny** - 7.4KB minified, 2.7KB gzipped
- **🔒 Enterprise secure** - Battle-tested with comprehensive security features
- **🎨 Animation ready** - Built-in CSS animation and transition support
- **🎯 Developer friendly** - One-line setup, comprehensive docs

**Start building real-time applications today!** 🚀

---

**Made with ❤️ by the WebSocket Hypermedia Community**

[![GitHub](https://img.shields.io/badge/github-follow-black.svg?logo=github)](https://github.com/adam248)
 