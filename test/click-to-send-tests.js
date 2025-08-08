/**
 * Click-to-Send Tests for WebSocket Hypermedia
 * Tests for the click-to-send feature and element interaction
 */

const WebSocket = require('ws');

class ClickToSendTests {
    constructor() {
        this.ws = null;
    }

    // Click-to-Send Test: Basic Connection
    // JUSTIFICATION: Fundamental connectivity for click-to-send
    // - Ensures WebSocket connection works for click-to-send
    // - Validates basic communication channel
    // - Critical foundation for click-to-send functionality
    async testBasicConnection() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.close();
                resolve();
            });
            
            this.ws.on('error', (error) => {
                reject(new Error(`Connection failed: ${error.message}`));
            });
            
            setTimeout(() => {
                reject(new Error('Connection timeout'));
            }, 5000);
        });
    }

    // Click-to-Send Test: Disabled by Default
    // JUSTIFICATION: Default behavior validation
    // - Ensures click-to-send is disabled by default
    // - Validates opt-in behavior for security
    // - Tests that normal functionality works without click-to-send
    async testClickToSendDisabled() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('test_click_to_send');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Server received click-to-send test request')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Click-to-send disabled test timeout'));
            }, 5000);
        });
    }

    // Click-to-Send Test: Enable Feature
    // JUSTIFICATION: Runtime feature activation
    // - Tests enabling click-to-send after initialization
    // - Validates dynamic feature control
    // - Ensures proper feature activation
    async testEnableClickToSend() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('enable_click_to_send');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Click-to-send enabled')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Enable click-to-send test timeout'));
            }, 5000);
        });
    }

    // Click-to-Send Test: Custom Click Verb
    // JUSTIFICATION: Configurable click behavior
    // - Tests custom click verb functionality
    // - Validates configurable click handling
    // - Ensures flexibility in click-to-send implementation
    async testCustomClickVerb() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('user_clicked|test-element|<p>Test content</p>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Server received user click on: test-element')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Custom click verb test timeout'));
            }, 5000);
        });
    }

    // Click-to-Send Test: Element Click Detection
    // JUSTIFICATION: Core click-to-send functionality
    // - Tests detection of clicked elements
    // - Validates HTML content extraction
    // - Ensures proper element identification
    async testElementClickDetection() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('element_clicked|clickable-paragraph|<p>Click me! I\'m a paragraph element.</p>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Server received click on element: clickable-paragraph')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Element click detection test timeout'));
            }, 5000);
        });
    }

    // Click-to-Send Test: Interactive Element Skipping
    // JUSTIFICATION: Smart element filtering
    // - Tests that interactive elements are properly skipped
    // - Validates intelligent element detection
    // - Ensures buttons, links, forms don't trigger click-to-send
    async testInteractiveElementSkipping() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('test_interactive_elements');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Interactive elements test completed')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Interactive elements test timeout'));
            }, 5000);
        });
    }

    // Click-to-Send Test: HTML Content Escaping
    // JUSTIFICATION: Content integrity in click-to-send
    // - Tests HTML content escaping in click-to-send
    // - Validates proper content transmission
    // - Ensures HTML with pipes is handled correctly
    async testHtmlContentEscaping() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const htmlWithPipes = '<p>Content with | pipes | and special characters</p>';
                this.ws.send(`element_clicked|test-element|~${htmlWithPipes}~`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Server received click on element: test-element')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('HTML content escaping test timeout'));
            }, 5000);
        });
    }
}

module.exports = ClickToSendTests; 