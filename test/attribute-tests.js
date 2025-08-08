/**
 * Attribute Tests for WebSocket Hypermedia
 * Tests for attribute manipulation features (setAttr, removeAttr)
 * TDD Approach: Tests written first, then implementation
 */

const WebSocket = require('ws');

class AttributeTests {
    constructor() {
        this.ws = null;
    }

    // Attribute Test: Set Single Attribute
    // JUSTIFICATION: Basic attribute manipulation
    // - Tests setting a single attribute on an element
    // - Validates the setAttr verb works correctly
    // - Essential for dynamic element properties
    async testSetAttrSingle() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|disabled|true');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('disabled') && message.includes('true')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr single test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Set Multiple Attributes
    // JUSTIFICATION: Batch attribute operations
    // - Tests setting multiple attributes in sequence
    // - Validates attribute chaining works correctly
    // - Important for complex element configuration
    async testSetAttrMultiple() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|data-id|123');
                setTimeout(() => {
                    this.ws.send('setAttr|test-element|data-status|active');
                }, 100);
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr')) {
                    receivedCount++;
                    if (receivedCount >= 2) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr multiple test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Set Data Attributes
    // JUSTIFICATION: Modern data attribute support
    // - Tests setting data-* attributes
    // - Validates custom data attribute handling
    // - Important for JavaScript integration
    async testSetAttrDataAttributes() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|data-user-id|456');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('data-user-id') && message.includes('456')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr data attributes test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Set Boolean Attributes
    // JUSTIFICATION: Boolean attribute handling
    // - Tests setting boolean attributes (checked, disabled, etc.)
    // - Validates boolean attribute behavior
    // - Important for form elements
    async testSetAttrBoolean() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|checked|true');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('checked') && message.includes('true')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr boolean test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Set Empty Value
    // JUSTIFICATION: Empty attribute value handling
    // - Tests setting attributes with empty values
    // - Validates empty string handling
    // - Important for edge case robustness
    async testSetAttrEmptyValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|placeholder|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('placeholder')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr empty value test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Set Special Characters
    // JUSTIFICATION: Special character handling
    // - Tests attributes with special characters
    // - Validates unicode and special char support
    // - Important for internationalization
    async testSetAttrSpecialChars() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|title|Hello & World < > " \'');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('title')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr special chars test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Remove Single Attribute
    // JUSTIFICATION: Attribute removal functionality
    // - Tests removing a single attribute from an element
    // - Validates the removeAttr verb works correctly
    // - Essential for dynamic attribute management
    async testRemoveAttrSingle() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeAttr|test-element|disabled');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeAttr') && message.includes('disabled')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveAttr single test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Remove Data Attribute
    // JUSTIFICATION: Data attribute removal
    // - Tests removing data-* attributes
    // - Validates data attribute removal handling
    // - Important for state cleanup
    async testRemoveAttrDataAttribute() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeAttr|test-element|data-status');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeAttr') && message.includes('data-status')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveAttr data attribute test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Remove Non-existent Attribute
    // JUSTIFICATION: Graceful error handling
    // - Tests removing an attribute that doesn't exist
    // - Validates graceful degradation
    // - Important for robust error handling
    async testRemoveAttrNonExistent() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeAttr|test-element|non-existent-attr');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeAttr')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveAttr non-existent test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Remove Empty Attribute Name
    // JUSTIFICATION: Empty input handling
    // - Tests removing an attribute with empty name
    // - Validates input validation
    // - Important for data integrity
    async testRemoveAttrEmpty() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeAttr|test-element|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeAttr')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveAttr empty test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Set Attribute on Non-existent Element
    // JUSTIFICATION: Element validation
    // - Tests setting attributes on non-existent elements
    // - Validates graceful error handling
    // - Important for robust applications
    async testSetAttrNonExistentElement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|non-existent-element|disabled|true');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Element not found')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr non-existent element test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Set Attribute with Invalid Element ID
    // JUSTIFICATION: Input validation
    // - Tests setting attributes with invalid element IDs
    // - Validates ID format validation
    // - Important for security and robustness
    async testSetAttrInvalidElementId() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|invalid@id|disabled|true');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Invalid element ID')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr invalid element ID test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Long Attribute Value
    // JUSTIFICATION: Performance and limits
    // - Tests setting attributes with very long values
    // - Validates performance with large inputs
    // - Important for scalability
    async testSetAttrLongValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const longValue = 'a'.repeat(1000);
                this.ws.send(`setAttr|test-element|data-long|${longValue}`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('data-long')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr long value test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Unicode Attribute Value
    // JUSTIFICATION: Internationalization
    // - Tests attributes with unicode characters
    // - Validates international character support
    // - Important for global applications
    async testSetAttrUnicodeValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|title|你好世界');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('title')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr unicode value test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Escaped Attribute Value
    // JUSTIFICATION: Escape mechanism
    // - Tests attributes with escape characters
    // - Validates escape mechanism works for attributes
    // - Important for special character handling
    async testSetAttrEscapedValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|title|~Hello World | & Good Morning~');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('title')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr escaped value test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Attribute with Options
    // JUSTIFICATION: Protocol extension
    // - Tests attributes with additional options
    // - Validates protocol extension capability
    // - Important for extensible functionality
    async testSetAttrWithOptions() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|test-element|disabled|true|option1|option2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('disabled')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('SetAttr with options test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Form State Management
    // JUSTIFICATION: Real-world use case
    // - Tests form state management via attributes
    // - Validates practical application
    // - Important for form enhancement
    async testFormStateManagement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|submit-btn|disabled|true');
                setTimeout(() => {
                    this.ws.send('setAttr|submit-btn|data-processing|true');
                }, 100);
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && message.includes('submit-btn')) {
                    receivedCount++;
                    if (receivedCount >= 2) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('Form state management test timeout'));
            }, 5000);
        });
    }

    // Attribute Test: Accessibility Attributes
    // JUSTIFICATION: Accessibility support
    // - Tests ARIA attributes for accessibility
    // - Validates accessibility feature support
    // - Important for inclusive design
    async testAccessibilityAttributes() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setAttr|modal|aria-hidden|false');
                setTimeout(() => {
                    this.ws.send('setAttr|button|aria-expanded|true');
                }, 100);
            });
            
            let receivedCount = 0;
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setAttr') && (message.includes('aria-hidden') || message.includes('aria-expanded'))) {
                    receivedCount++;
                    if (receivedCount >= 2) {
                        this.ws.close();
                        resolve();
                    }
                }
            });
            
            setTimeout(() => {
                reject(new Error('Accessibility attributes test timeout'));
            }, 5000);
        });
    }
}

module.exports = AttributeTests; 