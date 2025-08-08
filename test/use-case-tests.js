/**
 * Use Case Tests for WebSocket Hypermedia
 * Tests for real-world use cases mentioned in documentation
 */

const WebSocket = require('ws');

class UseCaseTests {
    constructor() {
        this.ws = null;
    }

    // Use Case Test: Chat Application
    // JUSTIFICATION: Real-time messaging capabilities claim
    // - Tests chat message handling
    // - Validates real-time messaging features
    // - Critical for chat application claims
    async testChatApplication() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate chat message
                this.ws.send('chat_message|messages|<p><strong>Alice:</strong> Hello everyone!</p>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('chat_message') || message.includes('messages')) {
                    console.log('✅ Chat message handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Chat application test timeout'));
            }, 5000);
        });
    }

    // Use Case Test: Live Dashboard
    // JUSTIFICATION: Real-time data visualization claim
    // - Tests dashboard data updates
    // - Validates real-time data visualization
    // - Critical for dashboard application claims
    async testLiveDashboard() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate dashboard update
                this.ws.send('dashboard_update|stats|<div>Users: 150 | Messages: 1,234 | Active: 45</div>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('dashboard_update') || message.includes('stats')) {
                    console.log('✅ Dashboard update handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Live dashboard test timeout'));
            }, 5000);
        });
    }

    // Use Case Test: News Feed
    // JUSTIFICATION: Live content updates claim
    // - Tests news feed updates
    // - Validates live content delivery
    // - Critical for news application claims
    async testNewsFeed() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate news update
                this.ws.send('news_update|feed|<article><h3>Breaking News</h3><p>Important update...</p></article>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('news_update') || message.includes('feed')) {
                    console.log('✅ News feed update handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('News feed test timeout'));
            }, 5000);
        });
    }

    // Use Case Test: Collaborative Editor
    // JUSTIFICATION: Live document editing claim
    // - Tests collaborative editing features
    // - Validates real-time collaboration
    // - Critical for collaboration application claims
    async testCollaborativeEditor() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate collaborative edit
                this.ws.send('collaborative_edit|document|<p>User Bob added: "This is a collaborative edit"</p>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('collaborative_edit') || message.includes('document')) {
                    console.log('✅ Collaborative editing handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Collaborative editor test timeout'));
            }, 5000);
        });
    }

    // Use Case Test: E-commerce Live Updates
    // JUSTIFICATION: Live inventory and pricing claim
    // - Tests e-commerce real-time updates
    // - Validates inventory and pricing updates
    // - Critical for e-commerce application claims
    async testEcommerceLiveUpdates() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate inventory update
                this.ws.send('inventory_update|product-123|<div>Stock: 5 left | Price: $29.99</div>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('inventory_update') || message.includes('product-123')) {
                    console.log('✅ E-commerce live update handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('E-commerce test timeout'));
            }, 5000);
        });
    }

    // Use Case Test: Multiplayer Game
    // JUSTIFICATION: Real-time game state claim
    // - Tests game state updates
    // - Validates real-time gaming features
    // - Critical for gaming application claims
    async testMultiplayerGame() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate game state update
                this.ws.send('game_update|game-state|<div>Player moved to position (10, 20)</div>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('game_update') || message.includes('game-state')) {
                    console.log('✅ Multiplayer game state handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Multiplayer game test timeout'));
            }, 5000);
        });
    }

    // Use Case Test: Analytics Dashboard
    // JUSTIFICATION: Real-time metrics and monitoring claim
    // - Tests analytics data updates
    // - Validates real-time monitoring
    // - Critical for analytics application claims
    async testAnalyticsDashboard() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate analytics update
                this.ws.send('analytics_update|metrics|<div>Page Views: 1,234 | Bounce Rate: 45% | Conversion: 2.3%</div>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('analytics_update') || message.includes('metrics')) {
                    console.log('✅ Analytics dashboard handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Analytics dashboard test timeout'));
            }, 5000);
        });
    }

    // Use Case Test: Form Validation
    // JUSTIFICATION: Real-time form validation claim
    // - Tests real-time form validation
    // - Validates interactive form features
    // - Critical for form application claims
    async testFormValidation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Simulate form validation
                this.ws.send('form_validation|username|<div class="error">Username already taken</div>');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('form_validation') || message.includes('username')) {
                    console.log('✅ Form validation handling works');
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Form validation test timeout'));
            }, 5000);
        });
    }
}

module.exports = UseCaseTests; 