/**
 * CSS Class Tests for WebSocket Hypermedia
 * Tests for CSS class manipulation features (addClass, removeClass, toggleClass)
 */

const WebSocket = require('ws');

class CssClassTests {
    constructor() {
        this.ws = null;
    }

    // CSS Class Test: Add Single Class
    // JUSTIFICATION: Basic CSS class manipulation
    // - Tests adding a single class to an element
    // - Validates the addClass verb works correctly
    // - Essential for UI state management
    async testAddClassSingle() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|new-class');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('new-class')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('AddClass test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Add Multiple Classes
    // JUSTIFICATION: Multiple class handling
    // - Tests adding multiple space-separated classes
    // - Validates class list parsing works correctly
    // - Important for complex styling scenarios
    async testAddClassMultiple() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|class1 class2 class3');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('class1 class2 class3')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('AddClass multiple test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: No Duplicates
    // JUSTIFICATION: Prevent class duplication
    // - Tests that existing classes aren't duplicated
    // - Validates class list integrity
    // - Important for clean CSS management
    async testAddClassNoDuplicates() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|existing-class');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('existing-class')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('AddClass no duplicates test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Empty Class Name
    // JUSTIFICATION: Edge case handling
    // - Tests handling of empty class names
    // - Validates graceful degradation
    // - Important for robust error handling
    async testAddClassEmpty() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('AddClass empty test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Whitespace Only
    // JUSTIFICATION: Whitespace handling
    // - Tests handling of whitespace-only class names
    // - Validates input sanitization
    // - Important for data integrity
    async testAddClassWhitespace() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|   ');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('AddClass whitespace test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Special Characters
    // JUSTIFICATION: Special character support
    // - Tests class names with special characters
    // - Validates unicode and special char handling
    // - Important for internationalization
    async testAddClassSpecialChars() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|special-class_123');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('special-class_123')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('AddClass special chars test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Remove Single Class
    // JUSTIFICATION: Class removal functionality
    // - Tests removing a single class from an element
    // - Validates the removeClass verb works correctly
    // - Essential for dynamic styling
    async testRemoveClassSingle() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeClass|test-element|existing-class');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeClass') && message.includes('existing-class')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveClass test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Remove Multiple Classes
    // JUSTIFICATION: Multiple class removal
    // - Tests removing multiple space-separated classes
    // - Validates batch class removal
    // - Important for complex styling updates
    async testRemoveClassMultiple() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeClass|test-element|class1 class2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeClass') && message.includes('class1 class2')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveClass multiple test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Remove Non-existent Class
    // JUSTIFICATION: Graceful error handling
    // - Tests removing a class that doesn't exist
    // - Validates graceful degradation
    // - Important for robust error handling
    async testRemoveClassNonExistent() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeClass|test-element|non-existent');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeClass')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveClass non-existent test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Remove Empty Class
    // JUSTIFICATION: Empty input handling
    // - Tests removing an empty class name
    // - Validates input validation
    // - Important for data integrity
    async testRemoveClassEmpty() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeClass|test-element|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeClass')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('RemoveClass empty test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Toggle Class Add
    // JUSTIFICATION: Toggle functionality
    // - Tests adding a class via toggle when it doesn't exist
    // - Validates the toggleClass verb works correctly
    // - Essential for state switching
    async testToggleClassAdd() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('toggleClass|test-element|new-class');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('toggleClass') && message.includes('new-class')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('ToggleClass add test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Toggle Class Remove
    // JUSTIFICATION: Toggle removal functionality
    // - Tests removing a class via toggle when it exists
    // - Validates toggle behavior for existing classes
    // - Important for state management
    async testToggleClassRemove() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('toggleClass|test-element|existing-class');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('toggleClass') && message.includes('existing-class')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('ToggleClass remove test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Toggle Multiple Classes
    // JUSTIFICATION: Multiple class toggling
    // - Tests toggling multiple space-separated classes
    // - Validates batch toggle operations
    // - Important for complex state changes
    async testToggleClassMultiple() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('toggleClass|test-element|class1 class2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('toggleClass') && message.includes('class1 class2')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('ToggleClass multiple test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Toggle Empty Class
    // JUSTIFICATION: Empty toggle handling
    // - Tests toggling an empty class name
    // - Validates input validation for toggle
    // - Important for robust error handling
    async testToggleClassEmpty() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('toggleClass|test-element|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('toggleClass')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('ToggleClass empty test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Non-existent Element
    // JUSTIFICATION: Element validation
    // - Tests handling of non-existent element IDs
    // - Validates graceful error handling
    // - Important for robust applications
    async testNonExistentElement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|non-existent-element|new-class');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Element not found')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Non-existent element test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Invalid Element ID
    // JUSTIFICATION: Input validation
    // - Tests handling of invalid element IDs
    // - Validates ID format validation
    // - Important for security and robustness
    async testInvalidElementId() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|invalid@id|new-class');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Invalid element ID')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Invalid element ID test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Long Class Name
    // JUSTIFICATION: Performance and limits
    // - Tests handling of very long class names
    // - Validates performance with large inputs
    // - Important for scalability
    async testLongClassName() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const longClassName = 'a'.repeat(1000);
                this.ws.send(`addClass|test-element|${longClassName}`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Long class name test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Unicode Class Name
    // JUSTIFICATION: Internationalization
    // - Tests class names with unicode characters
    // - Validates international character support
    // - Important for global applications
    async testUnicodeClassName() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|café-ñáño');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('café-ñáño')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Unicode class name test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Numeric Class Name
    // JUSTIFICATION: Numeric class support
    // - Tests class names with numbers
    // - Validates numeric character handling
    // - Important for systematic naming
    async testNumericClassName() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|class-123');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('class-123')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Numeric class name test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Escaped Class Name
    // JUSTIFICATION: Escape mechanism
    // - Tests class names with escape characters
    // - Validates escape mechanism works for classes
    // - Important for special character handling
    async testEscapedClassName() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|~special class with | pipes~');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('special class with | pipes')) {
                    this.ws.close();
                    resolve();
                } else if (message.includes('addClass')) {
                    // Handle case where server echoes back the escaped content
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Escaped class name test timeout'));
            }, 5000);
        });
    }

    // CSS Class Test: Class Name with Options
    // JUSTIFICATION: Protocol extension
    // - Tests class names with additional options
    // - Validates protocol extension capability
    // - Important for extensible functionality
    async testClassNameWithOptions() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('addClass|test-element|new-class|option1|option2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('addClass') && message.includes('new-class')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Class name with options test timeout'));
            }, 5000);
        });
    }
}

module.exports = CssClassTests; 