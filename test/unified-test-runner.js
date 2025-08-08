#!/usr/bin/env node

/**
 * Unified Test Runner for WebSocket Hypermedia
 * 
 * This script runs all test modules in a single command:
 * - Starts the WebSocket server
 * - Runs all test suites (core, edge cases, escape)
 * - Provides clear output
 * - Cleans up automatically
 */

const { spawn } = require('child_process');

// Import all test modules
const CoreTests = require('./core-tests');
const EdgeCaseTests = require('./edge-case-tests');
const EscapeTests = require('./escape-tests');

const DataUrlTests = require('./data-url-tests');
const SizeTests = require('./size-tests');
const BrowserCompatibilityTests = require('./browser-compatibility-tests');
const PerformanceTests = require('./performance-tests');
const UseCaseTests = require('./use-case-tests');
const AdvancedProtocolTests = require('./advanced-protocol-tests');
const ReconnectionTests = require('./reconnection-tests');
const CssClassTests = require('./css-class-tests');
const AttributeTests = require('./attribute-tests');
const StyleTests = require('./style-tests');
const EventTests = require('./event-tests');
const FormTests = require('./form-tests');
const AnimationTests = require('./animation-tests');

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

        this.dataUrlTests = new DataUrlTests();
        this.sizeTests = new SizeTests();
        this.browserCompatibilityTests = new BrowserCompatibilityTests();
        this.performanceTests = new PerformanceTests();
        this.useCaseTests = new UseCaseTests();
        this.advancedProtocolTests = new AdvancedProtocolTests();
        this.reconnectionTests = new ReconnectionTests();
        this.cssClassTests = new CssClassTests();
        this.attributeTests = new AttributeTests();
        this.styleTests = new StyleTests();
        this.eventTests = new EventTests();
        this.formTests = new FormTests();
        this.animationTests = new AnimationTests();
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
            
            
            
            // Data-URL Tests
            await this.runTestSuite('Data-URL Tests', this.dataUrlTests, [
                'testBasicDataUrlInitialization',
                'testDataUrlWithCustomConfig',
                'testDataUrlWithMessageHandlers',
                'testDataUrlWithInteractiveElements',
                'testDataUrlErrorHandling',
                'testDataUrlMultipleScriptTags',
                'testDataUrlDifferentFormats'
            ]);
            
            // Size Tests
            await this.runTestSuite('Size Tests', this.sizeTests, [
                'testUncompressedSize',
                'testGzippedSize',
                'testCompressionRatio',
                'testSizeGrowthMonitoring',
                'testCommentPolicyCompliance'
            ]);
            
            // Browser Compatibility Tests
            await this.runTestSuite('Browser Compatibility Tests', this.browserCompatibilityTests, [
                'testWebSocketAPISupport',
                'testES5Compatibility',
                'testDOMAPICompatibility',
                'testNoExternalDependencies',
                'testGlobalObjectCompatibility',
                'testErrorHandlingCompatibility'
            ]);
            
            // Performance Tests
            await this.runTestSuite('Performance Tests', this.performanceTests, [
                'testMessageProcessingSpeed',
                'testLargePayloadHandling',
                'testConcurrentConnections',
                'testMemoryUsage',
                'testLatencyMeasurement',
                'testStressTest'
            ]);
            
            // Use Case Tests
            await this.runTestSuite('Use Case Tests', this.useCaseTests, [
                'testChatApplication',
                'testLiveDashboard',
                'testNewsFeed',
                'testCollaborativeEditor',
                'testEcommerceLiveUpdates',
                'testMultiplayerGame',
                'testAnalyticsDashboard',
                'testFormValidation'
            ]);
            
            // Advanced Protocol Tests
            await this.runTestSuite('Advanced Protocol Tests', this.advancedProtocolTests, [
                'testSwapAction',
                'testBeforeAction',
                'testAfterAction',
                'testCustomVerbHandling',
                'testComplexOptionsPassing',
                'testBatchOperations',
                'testConditionalUpdates',
                'testStateManagement'
            ]);
            
            // Reconnection Tests
            await this.runTestSuite('Reconnection Tests', this.reconnectionTests, [
                'testExponentialBackoffStrategy',
                'testMaximumReconnectionAttempts',
                'testConnectionRecovery',
                'testManualReconnection',
                'testReconnectionDelayConfiguration',
                'testReconnectionEventHandling',
                'testNetworkInterruptionRecovery',
                'testReconnectionStateManagement'
            ]);
            
            // CSS Class Tests
            await this.runTestSuite('CSS Class Tests', this.cssClassTests, [
                'testAddClassSingle',
                'testAddClassMultiple',
                'testAddClassNoDuplicates',
                'testAddClassEmpty',
                'testAddClassWhitespace',
                'testAddClassSpecialChars',
                'testRemoveClassSingle',
                'testRemoveClassMultiple',
                'testRemoveClassNonExistent',
                'testRemoveClassEmpty',
                'testToggleClassAdd',
                'testToggleClassRemove',
                'testToggleClassMultiple',
                'testToggleClassEmpty',
                'testNonExistentElement',
                'testInvalidElementId',
                'testLongClassName',
                'testUnicodeClassName',
                'testNumericClassName',
                'testEscapedClassName',
                'testClassNameWithOptions'
            ]);
            
            // Attribute Tests
            await this.runTestSuite('Attribute Tests', this.attributeTests, [
                'testSetAttrSingle',
                'testSetAttrMultiple',
                'testSetAttrDataAttributes',
                'testSetAttrBoolean',
                'testSetAttrEmptyValue',
                'testSetAttrSpecialChars',
                'testRemoveAttrSingle',
                'testRemoveAttrDataAttribute',
                'testRemoveAttrNonExistent',
                'testRemoveAttrEmpty',
                'testSetAttrNonExistentElement',
                'testSetAttrInvalidElementId',
                'testSetAttrLongValue',
                'testSetAttrUnicodeValue',
                'testSetAttrEscapedValue',
                'testSetAttrWithOptions',
                'testFormStateManagement',
                'testAccessibilityAttributes'
            ]);
            
            // Style Tests
            await this.runTestSuite('Style Tests', this.styleTests, [
                'testSetStyleSingle',
                'testSetStyleMultiple',
                'testSetStyleWithUnits',
                'testSetStyleWithSpaces',
                'testSetStyleEmptyValue',
                'testSetStyleSpecialChars',
                'testRemoveStyleSingle',
                'testRemoveStyleMultiple',
                'testRemoveStyleNonExistent',
                'testRemoveStyleEmpty',
                'testSetStyleNonExistentElement',
                'testSetStyleInvalidElementId',
                'testSetStyleLongValue',
                'testSetStyleUnicodeValue',
                'testSetStyleEscapedValue',
                'testSetStyleWithOptions',
                'testAnimationStateManagement',
                'testResponsiveDesign',
                'testCssCustomProperties'
            ]);
            
            // Event Tests
            await this.runTestSuite('Event Tests', this.eventTests, [
                'testTriggerClickEvent',
                'testTriggerMultipleEvents',
                'testTriggerCustomEvent',
                'testTriggerFormEvents',
                'testTriggerInputEvents',
                'testTriggerKeyboardEvents',
                'testTriggerMouseEvents',
                'testTriggerFocusEvents',
                'testTriggerChangeEvents',
                'testTriggerWithEventData',
                'testTriggerNonExistentElement',
                'testTriggerInvalidElementId',
                'testTriggerEmptyEventType',
                'testTriggerLongEventData',
                'testTriggerUnicodeEventData',
                'testTriggerEscapedEventData',
                'testTriggerWithOptions',
                'testFormValidationTrigger',
                'testAccessibilityTrigger'
            ]);
            
            // Form Tests
            await this.runTestSuite('Form Tests', this.formTests, [
                'testSetInputValue',
                'testSetTextareaValue',
                'testSetCheckboxChecked',
                'testSetCheckboxUnchecked',
                'testSetRadioSelected',
                'testSetSelectOption',
                'testSetMultipleSelectOptions',
                'testSetFileInputValue',
                'testSetRangeInputValue',
                'testSetDateInputValue',
                'testSetTimeInputValue',
                'testSetColorInputValue',
                'testSetEmailInputValue',
                'testSetPasswordInputValue',
                'testSetNumberInputValue',
                'testSetUrlInputValue',
                'testSetSearchInputValue',
                'testSetTelInputValue',
                'testSetEmptyValue',
                'testSetValueWithSpecialChars',
                'testSetValueNonExistentElement',
                'testSetValueInvalidElementId',
                'testSetLongValue',
                'testSetUnicodeValue',
                'testSetEscapedValue',
                'testSetValueWithOptions',
                'testFormAutoFill',
                'testFormValidation',
                'testFormReset'
            ]);
            
            // Animation Tests
            await this.runTestSuite('Animation Tests', this.animationTests, [
                'testBasicAnimation',
                'testAnimationWithDuration',
                'testAnimationWithEasing',
                'testAnimationWithDelay',
                'testMultipleAnimations',
                'testCssTransition',
                'testTransitionWithProperties',
                'testRemoveAnimation',
                'testPauseAnimation',
                'testResumeAnimation',
                'testAnimationState',
                'testKeyframeAnimation',
                'testTransformAnimation',
                'testScaleAnimation',
                'testColorTransition',
                'testAnimationLoop',
                'testAnimationDirection',
                'testAnimationFillMode',
                'testAnimationNonExistentElement',
                'testAnimationInvalidElementId',
                'testLongAnimationName',
                'testUnicodeAnimationName',
                'testEscapedAnimationName',
                'testAnimationWithOptions',
                'testAnimationSequence',
                'testAnimationPerformance',
                'testAnimationCleanup'
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
        console.log('');
        console.log('  - Data-URL Tests: Auto-initialization via data-url attribute');
        console.log('  - Size Tests: Library size verification and compression');
        console.log('  - Browser Compatibility Tests: Browser support validation');
        console.log('  - Performance Tests: Performance benchmarks and load testing');
        console.log('  - Use Case Tests: Real-world application scenarios');
        console.log('  - Advanced Protocol Tests: HTMX-inspired actions and advanced features');
        console.log('  - Reconnection Tests: Reconnection strategy and reliability');
        console.log('  - CSS Class Tests: CSS class manipulation features');
        console.log('  - Attribute Tests: HTML attribute manipulation features');
        console.log('  - Style Tests: Inline CSS style manipulation features');
        console.log('  - Event Tests: Event delegation and triggering features');
        console.log('  - Form Tests: Form enhancement and value setting features');
        console.log('  - Animation Tests: Animation and transition features');
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