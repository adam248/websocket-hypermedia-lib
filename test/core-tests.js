/**
 * Core Tests for WebSocket Hypermedia
 * Fundamental functionality tests that validate basic operations
 */

const WebSocket = require('ws');

class CoreTests {
    constructor() {
        this.ws = null;
    }

    // Core Test: WebSocket Connection
    // JUSTIFICATION: Fundamental test for basic connectivity
    // - Ensures the WebSocket connection can be established
    // - Validates the core communication channel works
    // - Critical for any real-world application
    async testWebSocketConnection() {
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

    // Core Test: Options Passing
    // JUSTIFICATION: Protocol extension capability
    // - Tests the verb|noun|subject|options protocol
    // - Ensures server can handle additional parameters
    // - Critical for extensible hypermedia applications
    async testOptionsPassing() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('special_update|breaking-news|Breaking news content|priority-high|code-black');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Special update with high priority')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Options test timeout'));
            }, 5000);
        });
    }

    // Core Test: All Standard Actions
    // JUSTIFICATION: CRUD operations validation
    // - Tests all basic hypermedia operations
    // - Ensures server responds correctly to standard verbs
    // - Validates the complete action set works
    async testAllActions() {
        const actions = [
            { action: 'ping', expected: 'Pong! Server is alive' },
            { action: 'get_time', expected: 'Current time:' },
            { action: 'add_message', expected: 'New message added!' },
            { action: 'clear_messages', expected: 'Messages cleared' },
            { action: 'remove_status', expected: 'remove' }
        ];

        for (const { action, expected } of actions) {
            await this.testAction(action, expected);
        }
    }

    async testAction(action, expected) {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send(action);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes(expected)) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error(`Action test timeout: ${action}`));
            }, 5000);
        });
    }
}

module.exports = CoreTests; 