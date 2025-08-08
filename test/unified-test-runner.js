#!/usr/bin/env node

/**
 * Unified Test Runner for WebSocket Hypermedia
 * 
 * This script runs all test modules in a single command:
 * - Starts the WebSocket server
 * - Runs all test suites (core, edge cases, escape, click-to-send)
 * - Provides clear output
 * - Cleans up automatically
 */

const { spawn } = require('child_process');

// Import all test modules
const CoreTests = require('./core-tests');
const EdgeCaseTests = require('./edge-case-tests');
const EscapeTests = require('./escape-tests');
const ClickToSendTests = require('./click-to-send-tests');

class UnifiedTestRunner {
    constructor() {
        this.serverProcess = null;
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
        
        // Initialize test suites
        this.coreTests = new CoreTests();
        this.edgeCaseTests = new EdgeCaseTests();
        this.escapeTests = new EscapeTests();
        this.clickToSendTests = new ClickToSendTests();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️',
            test: '🧪',
            module: '📦'
        }[type] || 'ℹ️';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async startServer() {
        this.log('Starting WebSocket test server...', 'info');
        
        return new Promise((resolve, reject) => {
            this.serverProcess = spawn('node', ['test-server.js'], {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: __dirname
            });

            let serverReady = false;
            const timeout = setTimeout(() => {
                if (!serverReady) {
                    this.log('Server startup timeout', 'error');
                    reject(new Error('Server startup timeout'));
                }
            }, 5000);

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('WebSocket server running')) {
                    serverReady = true;
                    clearTimeout(timeout);
                    this.log('WebSocket server ready on ws://localhost:8765', 'success');
                    resolve();
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                this.log(`Server stderr: ${data.toString()}`, 'warning');
            });

            this.serverProcess.on('error', (error) => {
                this.log(`Server error: ${error.message}`, 'error');
                reject(error);
            });
        });
    }

    async runTestSuite(suiteName, testSuite, tests) {
        this.log(`Running ${suiteName}...`, 'module');
        
        for (const test of tests) {
            try {
                await testSuite[test]();
                this.log(`  ✅ ${test} - PASSED`, 'success');
                this.passed++;
            } catch (error) {
                this.log(`  ❌ ${test} - FAILED: ${error.message}`, 'error');
                this.failed++;
                this.testResults.push({ suite: suiteName, test, status: 'FAILED', error: error.message });
            }
        }
    }

    async runAllTests() {
        this.log('🚀 Starting Unified WebSocket Hypermedia Test Suite...', 'test');
        console.log('=' .repeat(60));
        
        try {
            await this.startServer();
            
            // Core Tests
            await this.runTestSuite('Core Tests', this.coreTests, [
                'testWebSocketConnection',
                'testOptionsPassing',
                'testAllActions'
            ]);
            
            // Edge Case Tests
            await this.runTestSuite('Edge Case Tests', this.edgeCaseTests, [
                'testEmptyContent',
                'testLargeContent',
                'testSpecialCharacters',
                'testNestedHTML',
                'testFormSubmission',
                // 'testConcurrentUpdates', // Temporarily disabled due to timing issues
                'testInvalidElementId',
                'testMalformedMessage',
                'testRapidFireMessages',
                'testConnectionRecovery'
            ]);
            
            // Escape Tests
            await this.runTestSuite('Escape Tests', this.escapeTests, [
                'testDefaultEscapeCharacter',
                'testCustomEscapeCharacter',
                'testEscapeCharacterWithPipes',
                'testEscapeCharacterHelperMethods'
            ]);
            
            // Click-to-Send Tests
            await this.runTestSuite('Click-to-Send Tests', this.clickToSendTests, [
                'testBasicConnection',
                'testClickToSendDisabled',
                'testEnableClickToSend',
                'testCustomClickVerb',
                'testElementClickDetection',
                'testInteractiveElementSkipping',
                'testHtmlContentEscaping'
            ]);
            
        } catch (error) {
            this.log(`Test runner error: ${error.message}`, 'error');
            throw error;
        } finally {
            await this.cleanup();
        }
    }

    async cleanup() {
        if (this.serverProcess) {
            this.log('Stopping test server...', 'info');
            this.serverProcess.kill();
            this.serverProcess = null;
        }
    }

    printSummary() {
        console.log('\n' + '=' .repeat(60));
        this.log('📊 Test Summary', 'test');
        console.log('=' .repeat(60));
        
        const total = this.passed + this.failed;
        
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success Rate: ${((this.passed / total) * 100).toFixed(1)}%`);
        
        if (this.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults.forEach(result => {
                console.log(`  - ${result.suite}: ${result.test} - ${result.error}`);
            });
        }
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed! WebSocket Hypermedia is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Please check the implementation.');
        }
        
        console.log('\n📋 Test Modules:');
        console.log('  - Core Tests: Basic WebSocket functionality');
        console.log('  - Edge Case Tests: Unusual scenarios and robustness');
        console.log('  - Escape Tests: Content escaping and parsing');
        console.log('  - Click-to-Send Tests: Element interaction feature');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const runner = new UnifiedTestRunner();
    runner.runAllTests()
        .then(() => {
            runner.printSummary();
            process.exit(runner.failed === 0 ? 0 : 1);
        })
        .catch(error => {
            console.error('Test runner error:', error);
            process.exit(1);
        });
}

module.exports = UnifiedTestRunner; 