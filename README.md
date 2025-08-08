# ⚡ WebSocket Hypermedia Library

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Size](https://img.shields.io/badge/size-7.6KB%20uncompressed%20%7C%201.4KB%20gzipped-lightgrey.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Tests](https://img.shields.io/badge/tests-71%2F71%20passing-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Performance](https://img.shields.io/badge/performance-50K%20msg%2Fs-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib)
[![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)](https://github.com/adam248/websocket-hypermedia-lib/releases/tag/v1.0.0)
[![Stars](https://img.shields.io/github/stars/adam248/websocket-hypermedia-lib?style=social)](https://github.com/adam248/websocket-hypermedia-lib)
[![Forks](https://img.shields.io/github/forks/adam248/websocket-hypermedia-lib?style=social)](https://github.com/adam248/websocket-hypermedia-lib)
[![Issues](https://img.shields.io/github/issues/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/pulls)
[![Contributors](https://img.shields.io/github/contributors/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib/commits)
[![Code Size](https://img.shields.io/github/languages/code-size/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib)
[![Top Language](https://img.shields.io/github/languages/top/adam248/websocket-hypermedia-lib)](https://github.com/adam248/websocket-hypermedia-lib)
[![Security](https://img.shields.io/badge/security-audited-brightgreen.svg)](https://github.com/adam248/websocket-hypermedia-lib/tree/main/security)

**🚀 The fastest, smallest, and most powerful real-time hypermedia library for WebSockets!**

Transform your static HTML into dynamic, interactive experiences with just **one line of JavaScript**. No frameworks, no dependencies, no bloat - just pure, lightning-fast real-time updates.

**✨ Production Ready v1.0.0** - Tested, optimized, and battle-hardened with comprehensive security patches!

**Note:** This library requires JavaScript to function. The "progressive enhancement" approach means you can build traditional HTML forms first, then enhance them with real-time capabilities.

## 🚀 Quick Start - One Line to Real-Time!

```html
<script src="src/websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
```

**That's it!** Your page is now ready for real-time updates from the server. The library auto-initializes and creates a global `window.wsHypermedia` instance.

**🎯 Server sends:** `update|content|<p>Hello World!</p>`  
**⚡ Page updates:** Instantly, no JavaScript needed!

## ✨ Why WebSocket Hypermedia?

### 🚀 **Performance That Blows Minds**
- **⚡ Lightning Fast**: 50,000+ messages per second
- **📦 Ultra Tiny**: 7.6KB source, 1.4KB gzipped (81% compression!)
- **🎯 Zero Bloat**: No dependencies, no frameworks, no overhead

### 🔒 **Production-Ready Security**
- **🛡️ SSRF Protection**: WebSocket URL validation
- **🔐 Safe DOM**: Element ID validation
- **🚫 No Data Leaks**: Removed click-to-send vulnerabilities
- **✅ Battle-Tested**: 71/71 tests passing (100%)

### 🎯 **Developer Experience**
- **⚡ One-Line Setup**: Auto-initialization with data-url
- **🔄 Smart Reconnection**: Exponential backoff strategy
- **🔧 Extensible**: Custom message handlers
- **📖 Complete Docs**: Tutorials, API reference, security guides

### 🌟 **Real-World Ready**
- **💬 Chat Apps**: Real-time messaging
- **📊 Live Dashboards**: Real-time data visualization  
- **🎮 Multiplayer Games**: Real-time game state
- **📝 Collaborative Editing**: Live document editing
- **🛒 E-commerce**: Live inventory and pricing

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

The documentation includes:
- **Tutorials**: Step-by-step guides to get started
- **Guides**: Advanced patterns and problem-solving
- **Reference**: Complete API documentation
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

### 🔧 **Custom Chat with Auto-Scroll**
```javascript
window.wsHypermedia.addMessageHandler('chat_messages', (element, html, elementId) => {
    element.insertAdjacentHTML('beforeend', html);
    element.scrollTop = element.scrollHeight; // Auto-scroll to bottom
});
```

### 🎮 **Interactive Dashboard**
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

### 📊 **Live Data Updates**
```html
<div id="stock-price">Loading...</div>
<div id="user-count">0 users online</div>
```
**Server sends:** `update|stock-price|<span class="price">$150.25</span>`  
**Result:** Price updates in real-time! 📈

## 🛠️ Installation - Choose Your Adventure!

### ⚡ **CDN (Recommended)**
```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/gh/adam248/websocket-hypermedia-lib@main/src/websocket-hypermedia.js"></script>

<!-- Production-ready v1.0.0 -->
<script src="https://cdn.jsdelivr.net/gh/adam248/websocket-hypermedia-lib@v1.0.0/src/websocket-hypermedia.js"></script>

<!-- Ultra-compressed v1.0.0 (1.4KB gzipped!) -->
<script src="https://cdn.jsdelivr.net/gh/adam248/websocket-hypermedia-lib@v1.0.0/dist/websocket-hypermedia.min.js"></script>
```

### 📦 **Direct Download**
```bash
# Source file (7.6KB)
curl -O https://raw.githubusercontent.com/adam248/websocket-hypermedia-lib/v1.0.0/src/websocket-hypermedia.js

# Minified version (3.7KB)
curl -O https://raw.githubusercontent.com/adam248/websocket-hypermedia-lib/v1.0.0/dist/websocket-hypermedia.min.js
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
    autoReconnect: true,           // Enable auto-reconnection
    reconnectDelay: 1000,          // Base delay for reconnection
    maxReconnectAttempts: 5,       // Maximum reconnection attempts
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

### Standard Actions
- `update` - Replace element content
- `append` - Add to end of element
- `prepend` - Add to beginning of element
- `replace` - Replace entire element
- `remove` - Remove element
- `swap` - Replace entire element (HTMX-inspired)
- `before` - Insert before element (HTMX-inspired)
- `after` - Insert after element (HTMX-inspired)

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
- **Slack-style messaging** with real-time updates
- **Live typing indicators** and message delivery
- **Auto-scrolling chat windows** with custom handlers

### 📊 **Live Dashboards**
- **Stock tickers** with real-time price updates
- **System monitoring** with live metrics
- **User activity feeds** with instant notifications

### 🎮 **Multiplayer Games**
- **Real-time game state** synchronization
- **Live player actions** and updates
- **Dynamic UI updates** without page refreshes

### 📝 **Collaborative Editors**
- **Live document editing** with real-time sync
- **Cursor position sharing** between users
- **Instant content updates** across all clients

### 🛒 **E-commerce**
- **Live inventory updates** as items sell
- **Real-time pricing** and availability
- **Live order tracking** and status updates

### 📈 **Analytics & Monitoring**
- **Real-time metrics** and performance data
- **Live user activity** and engagement
- **Instant alert systems** and notifications

## 🤝 Contributing - Join the Revolution!

We welcome contributions! This library prioritizes **leanness, size, speed, and simplicity** above everything else.

### 🎯 **Our Philosophy**
- **Size Limit**: This library can **never exceed 14KB gzipped** - this is a hard line in the sand
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

This runs comprehensive automated tests (**71 test cases**) covering core functionality, edge cases, security patches, performance benchmarks, and the primary data-url auto-initialization feature with clear results.

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
- **Special thanks** to all contributors who helped make v1.0.0 production-ready!

## 📞 Support

- **📧 Email**: 85082674+adam248@users.noreply.github.com
- **🐛 Issues**: [GitHub Issues](https://github.com/adam248/websocket-hypermedia-lib/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/adam248/websocket-hypermedia-lib/discussions)
- **📖 Documentation**: [Complete Docs](docs/websocket-hypermedia.md)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=adam248/websocket-hypermedia-lib&type=Date)](https://star-history.com/#adam248/websocket-hypermedia-lib&Date)



---

## 🎉 **Ready to Build Something Amazing?**

**WebSocket Hypermedia v1.0.0** is production-ready and waiting to power your next real-time application!

- **⚡ Lightning fast** - 50K+ messages/second
- **📦 Ultra tiny** - 1.4KB gzipped
- **🔒 Production secure** - Battle-tested with security patches
- **🎯 Developer friendly** - One-line setup, comprehensive docs

**Start building real-time applications today!** 🚀

---

**Made with ❤️ by the WebSocket Hypermedia Community**

[![GitHub](https://img.shields.io/badge/github-follow-black.svg?logo=github)](https://github.com/adam248)
 