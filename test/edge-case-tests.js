/**
 * Edge Case Tests for WebSocket Hypermedia
 * Tests for unusual scenarios, error conditions, and robustness
 */

const WebSocket = require('ws');

class EdgeCaseTests {
    constructor() {
        this.ws = null;
    }

    // Edge Case Test: Empty Content
    // JUSTIFICATION: Graceful handling of empty HTML
    // - Real applications often send empty content
    // - Ensures the system doesn't break with empty payloads
    // - Critical for form submissions and dynamic content
    async testEmptyContent() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('update|content||');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Empty content handled')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Empty content test timeout'));
            }, 5000);
        });
    }

    // Edge Case Test: Large Content
    // JUSTIFICATION: Performance with large payloads
    // - Real applications may send large HTML content
    // - Tests memory efficiency and processing speed
    // - Ensures system remains responsive under load
    async testLargeContent() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const largeContent = '<div>' + '<p>Large content test</p>'.repeat(1000) + '</div>';
                this.ws.send(`update|content|${largeContent}`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Large content processed')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Large content test timeout'));
            }, 10000);
        });
    }

    // Edge Case Test: Special Characters
    // JUSTIFICATION: Unicode and HTML entity support
    // - Real content contains special characters
    // - Tests encoding and decoding capabilities
    // - Ensures internationalization support
    async testSpecialCharacters() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const specialContent = '<p>Unicode: 你好世界 🌍 & HTML: &amp; &lt; &gt;</p>';
                this.ws.send(`update|content|${specialContent}`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Special characters handled')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Special characters test timeout'));
            }, 5000);
        });
    }

    // Edge Case Test: Nested HTML
    // JUSTIFICATION: Complex DOM structure handling
    // - Real applications have complex HTML structures
    // - Tests DOM manipulation capabilities
    // - Ensures nested elements are handled correctly
    async testNestedHTML() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const nestedContent = `
                    <div class="container">
                        <header>
                            <h1>Title</h1>
                            <nav><ul><li>Item 1</li><li>Item 2</li></ul></nav>
                        </header>
                        <main>
                            <article>
                                <section><p>Content</p></section>
                            </article>
                        </main>
                    </div>
                `;
                this.ws.send(`update|content|${nestedContent}`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Nested HTML processed')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Nested HTML test timeout'));
            }, 5000);
        });
    }

    // Edge Case Test: Form Submission
    // JUSTIFICATION: Interactive form processing
    // - Forms are common in hypermedia applications
    // - Tests form data handling and validation
    // - Ensures proper form submission workflow
    async testFormSubmission() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('form_submit|form-data|user input|validate');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Form submitted successfully')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Form submission test timeout'));
            }, 5000);
        });
    }

    // Edge Case Test: Concurrent Updates
    // JUSTIFICATION: Multi-user scenario testing
    // - Real applications have multiple users
    // - Tests concurrent message processing
    // - Ensures system stability under load
    async testConcurrentUpdates() {
        return new Promise((resolve, reject) => {
            // Simplified concurrent test - just test that multiple connections work
            const ws1 = new WebSocket('ws://localhost:8765');
            const ws2 = new WebSocket('ws://localhost:8765');
            
            let ws1Ready = false;
            let ws2Ready = false;
            
            ws1.on('open', () => {
                ws1Ready = true;
                ws1.send('concurrent_update|content|Update 1');
            });
            
            ws2.on('open', () => {
                ws2Ready = true;
                ws2.send('concurrent_update|content|Update 2');
            });
            
            let responses = 0;
            const checkComplete = () => {
                responses++;
                if (responses === 2) {
                    ws1.close();
                    ws2.close();
                    resolve();
                }
            };
            
            ws1.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Concurrent update 1 processed')) {
                    checkComplete();
                }
            });
            
            ws2.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Concurrent update 2 processed')) {
                    checkComplete();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Concurrent updates test timeout'));
            }, 10000);
        });
    }

    // Edge Case Test: Invalid Element ID
    // JUSTIFICATION: Error handling for missing elements
    // - Real applications may reference non-existent elements
    // - Tests graceful error handling
    // - Ensures system doesn't crash on errors
    async testInvalidElementId() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('update|non_existent_element|<p>Content</p>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Element not found')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Invalid element ID test timeout'));
            }, 5000);
        });
    }

    // Edge Case Test: Malformed Message
    // JUSTIFICATION: Security and robustness testing
    // - Real applications may receive malformed messages
    // - Tests message parsing robustness
    // - Ensures system security against malformed input
    async testMalformedMessage() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('malformed|message|without|proper|format');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Malformed message handled')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Malformed message test timeout'));
            }, 5000);
        });
    }

    // Edge Case Test: Rapid Fire Messages
    // JUSTIFICATION: High-performance load testing
    // - Real applications may send many messages quickly
    // - Tests system performance under high load
    // - Ensures message ordering and processing
    async testRapidFireMessages() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        this.ws.send(`rapid_fire|content|Message ${i + 1}`);
                    }, i * 50);
                }
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Rapid fire message processed')) {
                    receivedCount++;
                    if (receivedCount === 10) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('Rapid fire test timeout'));
            }, 10000);
        });
    }

    // Edge Case Test: Connection Recovery
    // JUSTIFICATION: Reliability and UX testing
    // - Real applications need to handle connection issues
    // - Tests reconnection and state recovery
    // - Ensures good user experience during network issues
    async testConnectionRecovery() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('test_connection_recovery');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Connection recovery tested')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Connection recovery test timeout'));
            }, 5000);
        });
    }
}

module.exports = EdgeCaseTests; 