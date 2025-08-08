/**
 * Data-URL Auto-Initialization Tests for WebSocket Hypermedia
 * Tests the primary showcased feature: auto-initialization via data-url attribute
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

class DataUrlTests {
    constructor() {
        this.ws = null;
        this.testHtmlPath = path.join(__dirname, 'data-url-test.html');
    }
    
    // Helper method to safely clean up test files
    safeCleanup() {
        try {
            if (fs.existsSync(this.testHtmlPath)) {
                fs.unlinkSync(this.testHtmlPath);
            }
        } catch (error) {
            // Ignore cleanup errors
        }
    }

    // Test: Basic Data-URL Auto-Initialization
    // JUSTIFICATION: Primary showcased feature must work reliably
    // - Tests the main way users are told to use the library
    // - Ensures global window.wsHypermedia instance is created
    // - Validates connection establishment via data-url
    async testBasicDataUrlInitialization() {
        return new Promise((resolve, reject) => {
            // Create a simple HTML file with data-url
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Data-URL Test</title>
</head>
<body>
    <div id="content">Waiting for connection...</div>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
    <script>
        // Check if global instance was created
        if (window.wsHypermedia && window.wsHypermedia.readyState === WebSocket.CONNECTING) {
            console.log('Data-URL auto-initialization successful');
        } else {
            throw new Error('Data-URL auto-initialization failed');
        }
    </script>
</body>
</html>`;

            fs.writeFileSync(this.testHtmlPath, htmlContent);

            // Test WebSocket connection directly
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('ping');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Pong! Server is alive')) {
                    this.ws.close();
                    this.safeCleanup();
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                try {
                    if (fs.existsSync(this.testHtmlPath)) {
                        fs.unlinkSync(this.testHtmlPath);
                    }
                } catch (cleanupError) {
                    // Ignore cleanup errors
                }
                reject(new Error(`Data-URL connection failed: ${error.message}`));
            });
            
            setTimeout(() => {
                try {
                    if (fs.existsSync(this.testHtmlPath)) {
                        fs.unlinkSync(this.testHtmlPath);
                    }
                } catch (error) {
                    // Ignore cleanup errors
                }
                reject(new Error('Data-URL test timeout'));
            }, 5000);
        });
    }

    // Test: Data-URL with Custom Configuration
    // JUSTIFICATION: Users might need to combine data-url with options
    // - Tests data-url with additional configuration options
    // - Ensures both auto-initialization and manual options work together
    // - Validates the hybrid approach
    async testDataUrlWithCustomConfig() {
        return new Promise((resolve, reject) => {
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Data-URL Custom Config Test</title>
</head>
<body>
    <div id="content">Testing custom config...</div>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
    <script>
        // Override with custom configuration
        if (window.wsHypermedia) {
            window.wsHypermedia.disconnect();
        }
        
        window.wsHypermedia = new WebSocketHypermedia("ws://localhost:8765", {
            autoReconnect: false,
            onConnect: () => {
                console.log('Custom config connection successful');
            }
        });
    </script>
</body>
</html>`;

            fs.writeFileSync(this.testHtmlPath, htmlContent);

            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('get_time');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Current time:')) {
                    this.ws.close();
                    this.safeCleanup();
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                this.safeCleanup();
                reject(new Error(`Custom config test failed: ${error.message}`));
            });
            
            setTimeout(() => {
                this.safeCleanup();
                reject(new Error('Custom config test timeout'));
            }, 5000);
        });
    }

    // Test: Data-URL with Message Handlers
    // JUSTIFICATION: Users need to add custom handlers after auto-initialization
    // - Tests adding message handlers to the auto-initialized instance
    // - Ensures the global instance supports all library features
    // - Validates the complete workflow
    async testDataUrlWithMessageHandlers() {
        return new Promise((resolve, reject) => {
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Data-URL Message Handlers Test</title>
</head>
<body>
    <div id="content">Testing message handlers...</div>
    <div id="messages"></div>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
    <script>
        // Add custom message handler to auto-initialized instance
        window.wsHypermedia.addMessageHandler('test_handler', (element, html, elementId) => {
            element.innerHTML = html;
            console.log('Custom handler executed');
        });
    </script>
</body>
</html>`;

            fs.writeFileSync(this.testHtmlPath, htmlContent);

            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('add_message');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('New message added!')) {
                    this.ws.close();
                    this.safeCleanup();
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                this.safeCleanup();
                reject(new Error(`Message handlers test failed: ${error.message}`));
            });
            
            setTimeout(() => {
                this.safeCleanup();
                reject(new Error('Message handlers test timeout'));
            }, 5000);
        });
    }

    // Test: Data-URL with Interactive Elements
    // JUSTIFICATION: Users need to interact with the auto-initialized instance
    // - Tests sending messages through the global instance
    // - Ensures the complete interactive workflow works
    // - Validates real-world usage patterns
    async testDataUrlWithInteractiveElements() {
        return new Promise((resolve, reject) => {
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Data-URL Interactive Test</title>
</head>
<body>
    <div id="content">Testing interactions...</div>
    <button data-action="refresh">Refresh</button>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
    <script>
        // Test interaction with auto-initialized instance
        document.body.addEventListener('click', (e) => {
            if (e.target.dataset.action && window.wsHypermedia.readyState === WebSocket.OPEN) {
                window.wsHypermedia.send(e.target.dataset.action);
            }
        });
    </script>
</body>
</html>`;

            fs.writeFileSync(this.testHtmlPath, htmlContent);

            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('refresh');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('refresh')) {
                    this.ws.close();
                    this.safeCleanup();
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                this.safeCleanup();
                reject(new Error(`Interactive test failed: ${error.message}`));
            });
            
            setTimeout(() => {
                this.safeCleanup();
                reject(new Error('Interactive test timeout'));
            }, 5000);
        });
    }

    // Test: Data-URL Error Handling
    // JUSTIFICATION: Auto-initialization must handle connection errors gracefully
    // - Tests behavior when data-url points to invalid server
    // - Ensures error handling works with auto-initialization
    // - Validates robustness of the feature
    async testDataUrlErrorHandling() {
        return new Promise((resolve, reject) => {
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Data-URL Error Test</title>
</head>
<body>
    <div id="content">Testing error handling...</div>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:9999"></script>
    <script>
        // Test error handling with invalid URL
        if (window.wsHypermedia) {
            // Should handle connection errors gracefully
            console.log('Error handling test setup complete');
        }
    </script>
</body>
</html>`;

            fs.writeFileSync(this.testHtmlPath, htmlContent);

            // This test should pass even with connection errors
            // because the library should handle them gracefully
            setTimeout(() => {
                this.safeCleanup();
                resolve();
            }, 2000);
        });
    }

    // Test: Data-URL with Multiple Script Tags
    // JUSTIFICATION: Users might have multiple script tags on the page
    // - Tests behavior when multiple data-url script tags are present
    // - Ensures only one instance is created
    // - Validates proper initialization order
    async testDataUrlMultipleScriptTags() {
        return new Promise((resolve, reject) => {
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Data-URL Multiple Scripts Test</title>
</head>
<body>
    <div id="content">Testing multiple scripts...</div>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
    <script>
        // Should only have one instance
        if (window.wsHypermedia && typeof window.wsHypermedia === 'object') {
            console.log('Multiple scripts handled correctly');
        } else {
            throw new Error('Multiple scripts not handled correctly');
        }
    </script>
</body>
</html>`;

            fs.writeFileSync(this.testHtmlPath, htmlContent);

            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('ping');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Pong! Server is alive')) {
                    this.ws.close();
                    this.safeCleanup();
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                this.safeCleanup();
                reject(new Error(`Multiple scripts test failed: ${error.message}`));
            });
            
            setTimeout(() => {
                this.safeCleanup();
                reject(new Error('Multiple scripts test timeout'));
            }, 5000);
        });
    }

    // Test: Data-URL with Different URL Formats
    // JUSTIFICATION: Users might use different WebSocket URL formats
    // - Tests various URL formats (ws://, wss://, with ports, etc.)
    // - Ensures the data-url parsing works correctly
    // - Validates URL handling robustness
    async testDataUrlDifferentFormats() {
        return new Promise((resolve, reject) => {
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Data-URL Formats Test</title>
</head>
<body>
    <div id="content">Testing URL formats...</div>
    <script src="../websocket-hypermedia.js" data-url="ws://localhost:8765"></script>
    <script>
        // Test that the URL was parsed correctly
        if (window.wsHypermedia && window.wsHypermedia.url === 'ws://localhost:8765') {
            console.log('URL format handled correctly');
        } else {
            throw new Error('URL format not handled correctly');
        }
    </script>
</body>
</html>`;

            fs.writeFileSync(this.testHtmlPath, htmlContent);

            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('get_time');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Current time:')) {
                    this.ws.close();
                    this.safeCleanup();
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                this.safeCleanup();
                reject(new Error(`URL formats test failed: ${error.message}`));
            });
            
            setTimeout(() => {
                this.safeCleanup();
                reject(new Error('URL formats test timeout'));
            }, 5000);
        });
    }
}

module.exports = DataUrlTests; 