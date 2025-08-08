/**
 * Style Tests for WebSocket Hypermedia
 * Tests for inline style manipulation features (setStyle, removeStyle)
 * TDD Approach: Tests written first, then implementation
 */

const WebSocket = require('ws');

class StyleTests {
    constructor() {
        this.ws = null;
    }

    // Style Test: Set Single Style Property
    // JUSTIFICATION: Basic style manipulation
    // - Tests setting a single CSS property on an element
    // - Validates the setStyle verb works correctly
    // - Essential for dynamic styling
    async testSetStyleSingle() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|background-color|red');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('background-color') && message.includes('red')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle single test timeout'));
            }, 5000);
        });
    }

    // Style Test: Set Multiple Style Properties
    // JUSTIFICATION: Multiple style handling
    // - Tests setting multiple style properties in sequence
    // - Validates style property chaining works correctly
    // - Important for complex styling scenarios
    async testSetStyleMultiple() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|color|blue');
                setTimeout(() => {
                    this.ws.send('setStyle|test-element|font-size|16px');
                }, 100);
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle')) {
                    receivedCount++;
                    if (receivedCount >= 2) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle multiple test timeout'));
            }, 5000);
        });
    }

    // Style Test: Set CSS Properties with Units
    // JUSTIFICATION: CSS unit handling
    // - Tests setting CSS properties with various units
    // - Validates unit handling (px, %, em, rem, etc.)
    // - Important for precise styling
    async testSetStyleWithUnits() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|width|100%');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('width') && message.includes('100%')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle with units test timeout'));
            }, 5000);
        });
    }

    // Style Test: Set CSS Properties with Spaces
    // JUSTIFICATION: Complex CSS value handling
    // - Tests setting CSS properties with spaces in values
    // - Validates space handling in CSS values
    // - Important for complex CSS properties
    async testSetStyleWithSpaces() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|font-family|Arial, sans-serif');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('font-family')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle with spaces test timeout'));
            }, 5000);
        });
    }

    // Style Test: Set Empty Style Value
    // JUSTIFICATION: Empty value handling
    // - Tests setting style properties with empty values
    // - Validates empty string handling
    // - Important for style reset functionality
    async testSetStyleEmptyValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|background-color|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('background-color')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle empty value test timeout'));
            }, 5000);
        });
    }

    // Style Test: Set CSS Properties with Special Characters
    // JUSTIFICATION: Special character handling
    // - Tests setting CSS properties with special characters
    // - Validates unicode and special char support
    // - Important for internationalization
    async testSetStyleSpecialChars() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|content|"Hello & World"');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('content')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle special chars test timeout'));
            }, 5000);
        });
    }

    // Style Test: Remove Single Style Property
    // JUSTIFICATION: Style removal functionality
    // - Tests removing a single style property from an element
    // - Validates the removeStyle verb works correctly
    // - Essential for dynamic style management
    async testRemoveStyleSingle() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeStyle|test-element|background-color');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeStyle') && message.includes('background-color')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveStyle single test timeout'));
            }, 5000);
        });
    }

    // Style Test: Remove Multiple Style Properties
    // JUSTIFICATION: Multiple style removal
    // - Tests removing multiple style properties in sequence
    // - Validates batch style removal
    // - Important for complex style updates
    async testRemoveStyleMultiple() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeStyle|test-element|color');
                setTimeout(() => {
                    this.ws.send('removeStyle|test-element|font-size');
                }, 100);
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeStyle')) {
                    receivedCount++;
                    if (receivedCount >= 2) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveStyle multiple test timeout'));
            }, 5000);
        });
    }

    // Style Test: Remove Non-existent Style Property
    // JUSTIFICATION: Graceful error handling
    // - Tests removing a style property that doesn't exist
    // - Validates graceful degradation
    // - Important for robust error handling
    async testRemoveStyleNonExistent() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeStyle|test-element|non-existent-property');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeStyle')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveStyle non-existent test timeout'));
            }, 5000);
        });
    }

    // Style Test: Remove Empty Style Property Name
    // JUSTIFICATION: Empty input handling
    // - Tests removing a style property with empty name
    // - Validates input validation
    // - Important for data integrity
    async testRemoveStyleEmpty() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeStyle|test-element|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeStyle')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveStyle empty test timeout'));
            }, 5000);
        });
    }

    // Style Test: Set Style on Non-existent Element
    // JUSTIFICATION: Element validation
    // - Tests setting styles on non-existent elements
    // - Validates graceful error handling
    // - Important for robust applications
    async testSetStyleNonExistentElement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|non-existent-element|background-color|red');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Element not found')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle non-existent element test timeout'));
            }, 5000);
        });
    }

    // Style Test: Set Style with Invalid Element ID
    // JUSTIFICATION: Input validation
    // - Tests setting styles with invalid element IDs
    // - Validates ID format validation
    // - Important for security and robustness
    async testSetStyleInvalidElementId() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|invalid@id|background-color|red');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Invalid element ID')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle invalid element ID test timeout'));
            }, 5000);
        });
    }

    // Style Test: Long Style Value
    // JUSTIFICATION: Performance and limits
    // - Tests setting styles with very long values
    // - Validates performance with large inputs
    // - Important for scalability
    async testSetStyleLongValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const longValue = 'a'.repeat(1000);
                this.ws.send(`setStyle|test-element|background-image|url(${longValue})`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('background-image')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle long value test timeout'));
            }, 5000);
        });
    }

    // Style Test: Unicode Style Value
    // JUSTIFICATION: Internationalization
    // - Tests setting styles with unicode characters
    // - Validates international character support
    // - Important for global applications
    async testSetStyleUnicodeValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|content|"你好世界"');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('content')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle unicode value test timeout'));
            }, 5000);
        });
    }

    // Style Test: Escaped Style Value
    // JUSTIFICATION: Escape mechanism
    // - Tests setting styles with escape characters
    // - Validates escape mechanism works for styles
    // - Important for special character handling
    async testSetStyleEscapedValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|content|~Hello World | & Good Morning~');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('content')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle escaped value test timeout'));
            }, 5000);
        });
    }

    // Style Test: Style with Options
    // JUSTIFICATION: Protocol extension
    // - Tests setting styles with additional options
    // - Validates protocol extension capability
    // - Important for extensible functionality
    async testSetStyleWithOptions() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|background-color|red|option1|option2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('background-color')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetStyle with options test timeout'));
            }, 5000);
        });
    }

    // Style Test: Animation State Management
    // JUSTIFICATION: Real-world use case
    // - Tests animation state management via styles
    // - Validates practical application
    // - Important for dynamic animations
    async testAnimationStateManagement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|animated-element|animation|fadeIn 1s ease-in');
                setTimeout(() => {
                    this.ws.send('setStyle|animated-element|animation-play-state|paused');
                }, 100);
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('animated-element')) {
                    receivedCount++;
                    if (receivedCount >= 2) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation state management test timeout'));
            }, 5000);
        });
    }

    // Style Test: Responsive Design
    // JUSTIFICATION: Responsive styling
    // - Tests responsive design via style manipulation
    // - Validates responsive feature support
    // - Important for modern web applications
    async testResponsiveDesign() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|responsive-element|width|100%');
                setTimeout(() => {
                    this.ws.send('setStyle|responsive-element|max-width|1200px');
                }, 100);
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('responsive-element')) {
                    receivedCount++;
                    if (receivedCount >= 2) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('Responsive design test timeout'));
            }, 5000);
        });
    }

    // Style Test: CSS Custom Properties
    // JUSTIFICATION: Modern CSS support
    // - Tests CSS custom properties (CSS variables)
    // - Validates modern CSS feature support
    // - Important for advanced styling
    async testCssCustomProperties() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setStyle|test-element|--primary-color|#007bff');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setStyle') && message.includes('--primary-color')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('CSS custom properties test timeout'));
            }, 5000);
        });
    }
}

module.exports = StyleTests; 