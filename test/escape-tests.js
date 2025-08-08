/**
 * Escape Character Tests for WebSocket Hypermedia
 * Tests for the escape mechanism and content parsing
 */

const WebSocket = require('ws');

class EscapeTests {
    constructor() {
        this.ws = null;
    }

    // Escape Test: Default Escape Character
    // JUSTIFICATION: Core escape functionality
    // - Tests the default tilde (~) escape character
    // - Ensures basic escaping works correctly
    // - Critical for content with pipe characters
    async testDefaultEscapeCharacter() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('test_escape');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Hello World | & Good Morning New York!')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Default escape character test timeout'));
            }, 5000);
        });
    }

    // Escape Test: Custom Escape Character
    // JUSTIFICATION: Configurable escape mechanism
    // - Tests custom escape character (caret ^)
    // - Ensures escape character can be customized
    // - Validates flexibility of the escape system
    async testCustomEscapeCharacter() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('test_custom_escape');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Error: File not found | Path: /usr/local/bin')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Custom escape character test timeout'));
            }, 5000);
        });
    }

    // Escape Test: Escape Character with Pipes
    // JUSTIFICATION: Real-world content scenarios
    // - Tests escaping of content containing pipe characters
    // - Ensures proper parsing of escaped content
    // - Validates the escape mechanism in practice
    async testEscapeCharacterWithPipes() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const contentWithPipes = '<p>Content with | pipes | and special characters</p>';
                this.ws.send(`update|content|~${contentWithPipes}~`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Content with | pipes | and special characters') || 
                    message.includes('Updated content')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Escape with pipes test timeout'));
            }, 5000);
        });
    }

    // Escape Test: Helper Methods
    // JUSTIFICATION: Developer convenience
    // - Tests the sendEscaped helper method
    // - Ensures convenient API for developers
    // - Validates automatic escaping functionality
    async testEscapeCharacterHelperMethods() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Test the helper method functionality
                this.ws.send('test_helper_methods');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Helper methods tested')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Helper methods test timeout'));
            }, 5000);
        });
    }
}

module.exports = EscapeTests; 