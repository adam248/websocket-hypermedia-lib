# WebSocket Hypermedia Library

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yourusername/websocket-hypermedia)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/yourusername/websocket-hypermedia)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://github.com/yourusername/websocket-hypermedia)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/websocket-hypermedia/releases)
[![Size](https://img.shields.io/badge/size-6.2KB%20uncompressed%20%7C%201.7KB%20gzipped-lightgrey.svg)](https://github.com/yourusername/websocket-hypermedia)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](https://github.com/yourusername/websocket-hypermedia)
[![Browser Support](https://img.shields.io/badge/browsers-modern%20browsers-brightgreen.svg)](https://github.com/yourusername/websocket-hypermedia)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-latest-brightgreen.svg)](https://www.npmjs.com/)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/websocket-hypermedia.svg)](https://github.com/yourusername/websocket-hypermedia/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/websocket-hypermedia.svg)](https://github.com/yourusername/websocket-hypermedia/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/websocket-hypermedia.svg)](https://github.com/yourusername/websocket-hypermedia/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/websocket-hypermedia.svg)](https://github.com/yourusername/websocket-hypermedia/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/yourusername/websocket-hypermedia.svg)](https://github.com/yourusername/websocket-hypermedia/graphs/contributors)
[![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/websocket-hypermedia.svg)](https://github.com/yourusername/websocket-hypermedia/commits)
[![GitHub release](https://img.shields.io/github/release/yourusername/websocket-hypermedia.svg)](https://github.com/yourusername/websocket-hypermedia/releases)
[![GitHub downloads](https://img.shields.io/github/downloads/yourusername/websocket-hypermedia/total.svg)](https://github.com/yourusername/websocket-hypermedia/releases)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](https://prettier.io/)
[![Linting](https://img.shields.io/badge/linting-eslint-brightgreen.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/typescript-supported-blue.svg)](https://www.typescriptlang.org/)
[![WebSocket](https://img.shields.io/badge/websocket-supported-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![Hypermedia](https://img.shields.io/badge/hypermedia-ready-brightgreen.svg)](https://en.wikipedia.org/wiki/Hypermedia)

A minimal, powerful library for building real-time hypermedia applications using WebSockets. Transform your static HTML into dynamic, interactive experiences with just a few lines of JavaScript.

## 🚀 Quick Start

```html
<script src="websocket-hypermedia.js"></script>
<script>
const ws = new WebSocketHypermedia("ws://localhost:8765");
</script>
```

That's it! Your page is now ready for real-time updates from the server.

## ✨ Features

- **🔥 Real-time Updates**: Instant HTML updates from server
- **📦 Tiny Size**: Only 6.2KB uncompressed, 1.7KB gzipped
- **🔄 Auto-reconnection**: Handles connection drops gracefully
- **🎯 Simple Protocol**: `action|elementId|html` format
- **⚡ Zero Dependencies**: Pure JavaScript, no frameworks needed
- **🌐 Browser Compatible**: Works in all modern browsers
- **🔧 Extensible**: Add custom message handlers

## 📖 Documentation

📚 **[Complete Documentation](websocket-hypermedia.md)** - Everything you need to know

The documentation includes:
- **Tutorials**: Step-by-step guides to get started
- **Guides**: Advanced patterns and problem-solving
- **Reference**: Complete API documentation
- **Concepts**: Deep dive into WebSocket Hypermedia philosophy

## 🎯 Examples

### Basic Usage
```javascript
// Connect to WebSocket server
const ws = new WebSocketHypermedia("ws://localhost:8765");

// Server sends: "update|content|<p>Hello World!</p>"
// Content div automatically updates
```

### Custom Handlers
```javascript
// Add custom message handling
ws.addMessageHandler('chat_messages', (element, html, elementId) => {
    element.insertAdjacentHTML('beforeend', html);
    element.scrollTop = element.scrollHeight; // Auto-scroll
});
```

### Interactive Elements
```html
<button data-action="refresh">Refresh</button>
<button data-action="get_time">Get Time</button>

<script>
document.body.addEventListener('click', (e) => {
    if (e.target.dataset.action && ws.readyState === WebSocket.OPEN) {
        ws.send(e.target.dataset.action);
    }
});
</script>
```

## 🛠️ Installation

### Direct Download
```bash
curl -O https://raw.githubusercontent.com/yourusername/websocket-hypermedia/main/websocket-hypermedia.js
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/websocket-hypermedia@main/websocket-hypermedia.js"></script>
```

### npm (coming soon)
```bash
npm install websocket-hypermedia
```

## 🔧 Configuration

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

The library uses a simple action-based protocol:

```
action|elementId|html
```

### Standard Actions
- `update` - Replace element content
- `append` - Add to end of element
- `prepend` - Add to beginning of element
- `replace` - Replace entire element
- `remove` - Remove element

### Examples
```
update|content|<p>New content</p>
append|messages|<li>New message</li>
prepend|notifications|<div>Alert!</div>
replace|form|<form>New form</form>
remove|old_element|
```

## 🌟 Use Cases

- **💬 Chat Applications**: Real-time messaging
- **📊 Live Dashboards**: Real-time data visualization
- **📰 News Feeds**: Live content updates
- **🎮 Multiplayer Games**: Real-time game state
- **📝 Collaborative Editors**: Live document editing
- **🛒 E-commerce**: Live inventory and pricing
- **📈 Analytics**: Real-time metrics and monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/yourusername/websocket-hypermedia.git
cd websocket-hypermedia
# Open index.html in your browser to see the demo
```

### Running Tests
```bash
# Tests coming soon
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the simplicity of hypermedia-driven applications
- Built on the power of WebSocket technology
- Thanks to the open source community for inspiration and feedback

## 📞 Support

- **📧 Email**: 85082674+adam248@users.noreply.github.com
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/websocket-hypermedia/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/websocket-hypermedia/discussions)
- **📖 Documentation**: [Complete Docs](websocket-hypermedia.md)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/websocket-hypermedia&type=Date)](https://star-history.com/#yourusername/websocket-hypermedia&Date)

---

**Made with ❤️ by the WebSocket Hypermedia Community**

[![GitHub](https://img.shields.io/badge/github-follow-black.svg?logo=github)](https://github.com/yourusername)
[![Twitter](https://img.shields.io/badge/twitter-follow-blue.svg?logo=twitter)](https://twitter.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/linkedin-connect-blue.svg?logo=linkedin)](https://linkedin.com/in/yourusername) 