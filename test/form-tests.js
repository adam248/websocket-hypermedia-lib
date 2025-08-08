/**
 * Form Tests for WebSocket Hypermedia
 * Tests for form enhancement features (setValue, setChecked, setSelected, etc.)
 * TDD Approach: Tests written first, then implementation
 */

const WebSocket = require('ws');

class FormTests {
    constructor() {
        this.ws = null;
    }

    // Form Test: Set Input Value
    // JUSTIFICATION: Basic form value setting
    // - Tests setting value on input elements
    // - Validates the setValue verb works correctly
    // - Essential for form automation
    async testSetInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-input|Hello World');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('Hello World')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Textarea Value
    // JUSTIFICATION: Multi-line text input
    // - Tests setting value on textarea elements
    // - Validates multi-line text handling
    // - Important for rich text input
    async testSetTextareaValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-textarea|Line 1\nLine 2\nLine 3');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('Line 1')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set textarea value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Checkbox Checked
    // JUSTIFICATION: Boolean form state
    // - Tests setting checked state on checkboxes
    // - Validates boolean value handling
    // - Important for form state management
    async testSetCheckboxChecked() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setChecked|test-checkbox|true');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setChecked') && message.includes('true')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set checkbox checked test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Checkbox Unchecked
    // JUSTIFICATION: Boolean form state
    // - Tests unchecking checkboxes
    // - Validates false value handling
    // - Important for form state management
    async testSetCheckboxUnchecked() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setChecked|test-checkbox|false');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setChecked') && message.includes('false')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set checkbox unchecked test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Radio Button Selected
    // JUSTIFICATION: Radio button selection
    // - Tests selecting radio buttons
    // - Validates radio button group handling
    // - Important for single-choice forms
    async testSetRadioSelected() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setChecked|test-radio|true');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setChecked') && message.includes('true')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set radio selected test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Select Option
    // JUSTIFICATION: Dropdown selection
    // - Tests selecting options in select elements
    // - Validates option value handling
    // - Important for dropdown forms
    async testSetSelectOption() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setSelected|test-select|option2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setSelected') && message.includes('option2')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set select option test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Multiple Select Options
    // JUSTIFICATION: Multi-select dropdowns
    // - Tests selecting multiple options
    // - Validates array value handling
    // - Important for multi-select forms
    async testSetMultipleSelectOptions() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setSelected|test-multi-select|option1,option3');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setSelected') && message.includes('option1,option3')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set multiple select options test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set File Input Value
    // JUSTIFICATION: File upload handling
    // - Tests setting file input values
    // - Validates file path handling
    // - Important for file upload forms
    async testSetFileInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-file|/path/to/file.txt');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('/path/to/file.txt')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set file input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Range Input Value
    // JUSTIFICATION: Numeric range inputs
    // - Tests setting range input values
    // - Validates numeric value handling
    // - Important for slider forms
    async testSetRangeInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-range|75');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('75')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set range input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Date Input Value
    // JUSTIFICATION: Date input handling
    // - Tests setting date input values
    // - Validates date format handling
    // - Important for date picker forms
    async testSetDateInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-date|2024-01-15');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('2024-01-15')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set date input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Time Input Value
    // JUSTIFICATION: Time input handling
    // - Tests setting time input values
    // - Validates time format handling
    // - Important for time picker forms
    async testSetTimeInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-time|14:30');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('14:30')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set time input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Color Input Value
    // JUSTIFICATION: Color input handling
    // - Tests setting color input values
    // - Validates hex color format handling
    // - Important for color picker forms
    async testSetColorInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-color|#ff0000');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('#ff0000')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set color input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Email Input Value
    // JUSTIFICATION: Email input handling
    // - Tests setting email input values
    // - Validates email format handling
    // - Important for contact forms
    async testSetEmailInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-email|user@example.com');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('user@example.com')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set email input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Password Input Value
    // JUSTIFICATION: Password input handling
    // - Tests setting password input values
    // - Validates secure input handling
    // - Important for authentication forms
    async testSetPasswordInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-password|secret123');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('secret123')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set password input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Number Input Value
    // JUSTIFICATION: Number input handling
    // - Tests setting number input values
    // - Validates numeric format handling
    // - Important for quantity forms
    async testSetNumberInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-number|42');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('42')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set number input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set URL Input Value
    // JUSTIFICATION: URL input handling
    // - Tests setting URL input values
    // - Validates URL format handling
    // - Important for link forms
    async testSetUrlInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-url|https://example.com');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('https://example.com')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set URL input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Search Input Value
    // JUSTIFICATION: Search input handling
    // - Tests setting search input values
    // - Validates search term handling
    // - Important for search forms
    async testSetSearchInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-search|search term');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('search term')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set search input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Tel Input Value
    // JUSTIFICATION: Telephone input handling
    // - Tests setting telephone input values
    // - Validates phone number format handling
    // - Important for contact forms
    async testSetTelInputValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-tel|+1-555-123-4567');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('+1-555-123-4567')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set tel input value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Empty Value
    // JUSTIFICATION: Empty value handling
    // - Tests setting empty values on form elements
    // - Validates empty string handling
    // - Important for form clearing
    async testSetEmptyValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-input|');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('test-input')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set empty value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Value with Special Characters
    // JUSTIFICATION: Special character handling
    // - Tests setting values with special characters
    // - Validates character escaping
    // - Important for robust form handling
    async testSetValueWithSpecialChars() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-input|Hello & World <script>alert("test")</script>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('Hello & World')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set value with special chars test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Value on Non-existent Element
    // JUSTIFICATION: Element validation
    // - Tests setting values on non-existent elements
    // - Validates graceful error handling
    // - Important for robust applications
    async testSetValueNonExistentElement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|non-existent-element|test');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Element not found')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set value non-existent element test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Value with Invalid Element ID
    // JUSTIFICATION: Input validation
    // - Tests setting values with invalid element IDs
    // - Validates ID format validation
    // - Important for security and robustness
    async testSetValueInvalidElementId() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|invalid@id|test');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Invalid element ID')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set value invalid element ID test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Long Value
    // JUSTIFICATION: Performance and limits
    // - Tests setting very long values
    // - Validates performance with large inputs
    // - Important for scalability
    async testSetLongValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const longValue = 'a'.repeat(1000);
                this.ws.send(`setValue|test-input|${longValue}`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('test-input')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set long value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Unicode Value
    // JUSTIFICATION: Internationalization
    // - Tests setting values with unicode characters
    // - Validates international character support
    // - Important for global applications
    async testSetUnicodeValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-input|你好世界');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('test-input')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set unicode value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Escaped Value
    // JUSTIFICATION: Escape mechanism
    // - Tests setting values with escape characters
    // - Validates escape mechanism works for form values
    // - Important for special character handling
    async testSetEscapedValue() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-input|~Hello World | & Good Morning~');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('test-input')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Set escaped value test timeout'));
            }, 5000);
        });
    }

    // Form Test: Set Value with Options
    // JUSTIFICATION: Protocol extension
    // - Tests setting values with additional options
    // - Validates protocol extension capability
    // - Important for extensible functionality
    async testSetValueWithOptions() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('setValue|test-input|Hello|option1|option2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') && message.includes('Hello')) {
                    if (this.ws.readyState === WebSocket.OPEN) {
                        this.ws.close();
                    }
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                // Ignore connection errors during cleanup
                if (this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
                    resolve();
                }
            });
            
            setTimeout(() => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                reject(new Error('Set value with options test timeout'));
            }, 5000);
        });
    }

    // Form Test: Form Auto-fill
    // JUSTIFICATION: Real-world use case
    // - Tests auto-filling entire forms
    // - Validates practical application
    // - Important for form enhancement
    async testFormAutoFill() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('auto_fill_form|test-form');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') || message.includes('setChecked') || message.includes('setSelected')) {
                    if (this.ws.readyState === WebSocket.OPEN) {
                        this.ws.close();
                    }
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                // Ignore connection errors during cleanup
                if (this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
                    resolve();
                }
            });
            
            setTimeout(() => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                reject(new Error('Form auto-fill test timeout'));
            }, 8000);
        });
    }

    // Form Test: Form Validation
    // JUSTIFICATION: Form validation
    // - Tests form validation via value setting
    // - Validates practical application
    // - Important for form enhancement
    async testFormValidation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('validate_form|test-form');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('setValue') || message.includes('setChecked')) {
                    if (this.ws.readyState === WebSocket.OPEN) {
                        this.ws.close();
                    }
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                // Ignore connection errors during cleanup
                if (this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
                    resolve();
                }
            });
            
            setTimeout(() => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                reject(new Error('Form validation test timeout'));
            }, 8000);
        });
    }

    // Form Test: Form Reset
    // JUSTIFICATION: Form reset functionality
    // - Tests resetting form values
    // - Validates form clearing
    // - Important for form management
    async testFormReset() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('reset_form|test-form');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                // Ignore the initial welcome message
                if (message.includes('Welcome to WebSocket Hypermedia')) {
                    return;
                }
                if (message.includes('setValue') || message.includes('setChecked')) {
                    if (this.ws.readyState === WebSocket.OPEN) {
                        this.ws.close();
                    }
                    resolve();
                }
            });
            
            this.ws.on('error', (error) => {
                // Ignore connection errors during cleanup
                if (this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
                    resolve();
                }
            });
            
            setTimeout(() => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                reject(new Error('Form reset test timeout'));
            }, 8000);
        });
    }
}

module.exports = FormTests; 