#!/usr/bin/env node

/**
 * Unified Test Runner for WebSocket Hypermedia
 * 
 * This script runs categorized test modules:
 * - Essential: Core functionality tests (always pass)
 * - Non-Essential: Feature tests that may have edge cases
 * - Full: All tests including security (may have known failures)
 * - Individual: Run specific feature test suites
 * 
 * Usage:
 *   node unified-test-runner.js [category]
 *   
 * Categories:
 *   essential     - Core functionality only (default)
 *   non-essential - Feature tests only
 *   full          - All tests including security
 *   core          - Core tests only
 *   edge          - Edge case tests only
 *   escape        - Escape tests only
 *   data-url      - Data URL tests only
 *   size          - Size tests only
 *   browser       - Browser compatibility tests only
 *   performance   - Performance tests only
 *   use-case      - Use case tests only
 *   protocol      - Advanced protocol tests only
 *   reconnection  - Reconnection tests only
 *   css-class     - CSS class tests only
 *   attribute     - Attribute tests only
 *   style         - Style tests only
 *   event         - Event tests only
 *   form          - Form tests only
 *   animation     - Animation tests only
 *   security      - Security tests only
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
const SecurityTests = require('./security-tests');

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
        this.securityTests = new SecurityTests();

        // Define test categories
        this.testCategories = {
            essential: {
                name: 'Essential Tests',
                description: 'Core functionality tests that should always pass',
                suites: [
                    { name: 'Core Tests', instance: this.coreTests, tests: ['testWebSocketConnection', 'testOptionsPassing', 'testAllActions'] },
                    { name: 'Escape Tests', instance: this.escapeTests, tests: ['testDefaultEscapeCharacter', 'testCustomEscapeCharacter', 'testEscapeCharacterWithPipes', 'testEscapeCharacterHelperMethods'] }
                ]
            },
            'non-essential': {
                name: 'Non-Essential Tests',
                description: 'Feature tests that may have edge cases or known issues',
                suites: [
                    { name: 'Edge Case Tests', instance: this.edgeCaseTests, tests: ['testEmptyContent', 'testLargeContent', 'testSpecialCharacters', 'testNestedHTML', 'testFormSubmission', 'testInvalidElementId', 'testMalformedMessage', 'testRapidFireMessages', 'testConnectionRecovery'] },
                    { name: 'Data-URL Tests', instance: this.dataUrlTests, tests: ['testBasicDataUrlInitialization', 'testDataUrlWithCustomConfig', 'testDataUrlWithMessageHandlers', 'testDataUrlWithInteractiveElements', 'testDataUrlErrorHandling', 'testDataUrlMultipleScriptTags', 'testDataUrlDifferentFormats'] },
                    { name: 'Size Tests', instance: this.sizeTests, tests: ['testUncompressedSize', 'testGzippedSize', 'testCompressionRatio', 'testSizeGrowthMonitoring', 'testCommentPolicyCompliance'] },
                    { name: 'Browser Compatibility Tests', instance: this.browserCompatibilityTests, tests: ['testWebSocketAPISupport', 'testES5Compatibility', 'testDOMAPICompatibility', 'testNoExternalDependencies', 'testGlobalObjectCompatibility', 'testErrorHandlingCompatibility'] },
                    { name: 'Performance Tests', instance: this.performanceTests, tests: ['testMessageProcessingSpeed', 'testLargePayloadHandling', 'testConcurrentConnections', 'testMemoryUsage', 'testLatencyMeasurement', 'testStressTest'] },
                    { name: 'Use Case Tests', instance: this.useCaseTests, tests: ['testChatApplication', 'testLiveDashboard', 'testNewsFeed', 'testCollaborativeEditor', 'testEcommerceLiveUpdates', 'testMultiplayerGame', 'testAnalyticsDashboard', 'testFormValidation'] },
                    { name: 'Advanced Protocol Tests', instance: this.advancedProtocolTests, tests: ['testSwapAction', 'testBeforeAction', 'testAfterAction', 'testCustomVerbHandling', 'testComplexOptionsPassing', 'testBatchOperations', 'testConditionalUpdates', 'testStateManagement'] },
                    { name: 'Reconnection Tests', instance: this.reconnectionTests, tests: ['testExponentialBackoffStrategy', 'testMaximumReconnectionAttempts', 'testConnectionRecovery', 'testManualReconnection', 'testReconnectionDelayConfiguration', 'testReconnectionEventHandling', 'testNetworkInterruptionRecovery', 'testReconnectionStateManagement'] },
                    { name: 'CSS Class Tests', instance: this.cssClassTests, tests: ['testAddClassSingle', 'testAddClassMultiple', 'testAddClassNoDuplicates', 'testAddClassEmpty', 'testAddClassWhitespace', 'testAddClassSpecialChars', 'testRemoveClassSingle', 'testRemoveClassMultiple', 'testRemoveClassNonExistent', 'testRemoveClassEmpty', 'testToggleClassAdd', 'testToggleClassRemove', 'testToggleClassMultiple', 'testToggleClassEmpty', 'testNonExistentElement', 'testInvalidElementId', 'testLongClassName', 'testUnicodeClassName', 'testNumericClassName', 'testEscapedClassName', 'testClassNameWithOptions'] },
                    { name: 'Attribute Tests', instance: this.attributeTests, tests: ['testSetAttrSingle', 'testSetAttrMultiple', 'testSetAttrDataAttributes', 'testSetAttrBoolean', 'testSetAttrEmptyValue', 'testSetAttrSpecialChars', 'testRemoveAttrSingle', 'testRemoveAttrDataAttribute', 'testRemoveAttrNonExistent', 'testRemoveAttrEmpty', 'testSetAttrNonExistentElement', 'testSetAttrInvalidElementId', 'testSetAttrLongValue', 'testSetAttrUnicodeValue', 'testSetAttrEscapedValue', 'testSetAttrWithOptions', 'testFormStateManagement', 'testAccessibilityAttributes'] },
                    { name: 'Style Tests', instance: this.styleTests, tests: ['testSetStyleSingle', 'testSetStyleMultiple', 'testSetStyleWithUnits', 'testSetStyleWithSpaces', 'testSetStyleEmptyValue', 'testSetStyleSpecialChars', 'testRemoveStyleSingle', 'testRemoveStyleMultiple', 'testRemoveStyleNonExistent', 'testRemoveStyleEmpty', 'testSetStyleNonExistentElement', 'testSetStyleInvalidElementId', 'testSetStyleLongValue', 'testSetStyleUnicodeValue', 'testSetStyleEscapedValue', 'testSetStyleWithOptions', 'testAnimationStateManagement', 'testResponsiveDesign', 'testCssCustomProperties'] },
                    { name: 'Event Tests', instance: this.eventTests, tests: ['testTriggerClickEvent', 'testTriggerMultipleEvents', 'testTriggerCustomEvent', 'testTriggerFormEvents', 'testTriggerInputEvents', 'testTriggerKeyboardEvents', 'testTriggerMouseEvents', 'testTriggerFocusEvents', 'testTriggerChangeEvents', 'testTriggerWithEventData', 'testTriggerNonExistentElement', 'testTriggerInvalidElementId', 'testTriggerEmptyEventType', 'testTriggerLongEventData', 'testTriggerUnicodeEventData', 'testTriggerEscapedEventData', 'testTriggerWithOptions', 'testFormValidationTrigger', 'testAccessibilityTrigger'] },
                    { name: 'Form Tests', instance: this.formTests, tests: ['testSetInputValue', 'testSetTextareaValue', 'testSetCheckboxChecked', 'testSetCheckboxUnchecked', 'testSetRadioSelected', 'testSetSelectOption', 'testSetMultipleSelectOptions', 'testSetFileInputValue', 'testSetRangeInputValue', 'testSetDateInputValue', 'testSetTimeInputValue', 'testSetColorInputValue', 'testSetEmailInputValue', 'testSetPasswordInputValue', 'testSetNumberInputValue', 'testSetUrlInputValue', 'testSetSearchInputValue', 'testSetTelInputValue', 'testSetEmptyValue', 'testSetValueWithSpecialChars', 'testSetValueNonExistentElement', 'testSetValueInvalidElementId', 'testSetLongValue', 'testSetUnicodeValue', 'testSetEscapedValue', 'testSetValueWithOptions', 'testFormAutoFill', 'testFormValidation', 'testFormReset'] },
                    { name: 'Animation Tests', instance: this.animationTests, tests: ['testBasicAnimation', 'testAnimationWithDuration', 'testAnimationWithEasing', 'testAnimationWithDelay', 'testMultipleAnimations', 'testCssTransition', 'testTransitionWithProperties', 'testRemoveAnimation', 'testPauseAnimation', 'testResumeAnimation', 'testAnimationState', 'testKeyframeAnimation', 'testTransformAnimation', 'testScaleAnimation', 'testColorTransition', 'testAnimationLoop', 'testAnimationDirection', 'testAnimationFillMode', 'testAnimationNonExistentElement', 'testAnimationInvalidElementId', 'testLongAnimationName', 'testUnicodeAnimationName', 'testEscapedAnimationName', 'testAnimationWithOptions', 'testAnimationSequence', 'testAnimationPerformance', 'testAnimationCleanup'] }
                ]
            },
            full: {
                name: 'Full Test Suite',
                description: 'All tests including security tests (may have known failures)',
                suites: [
                    { name: 'Core Tests', instance: this.coreTests, tests: ['testWebSocketConnection', 'testOptionsPassing', 'testAllActions'] },
                    { name: 'Edge Case Tests', instance: this.edgeCaseTests, tests: ['testEmptyContent', 'testLargeContent', 'testSpecialCharacters', 'testNestedHTML', 'testFormSubmission', 'testInvalidElementId', 'testMalformedMessage', 'testRapidFireMessages', 'testConnectionRecovery'] },
                    { name: 'Escape Tests', instance: this.escapeTests, tests: ['testDefaultEscapeCharacter', 'testCustomEscapeCharacter', 'testEscapeCharacterWithPipes', 'testEscapeCharacterHelperMethods'] },
                    { name: 'Data-URL Tests', instance: this.dataUrlTests, tests: ['testBasicDataUrlInitialization', 'testDataUrlWithCustomConfig', 'testDataUrlWithMessageHandlers', 'testDataUrlWithInteractiveElements', 'testDataUrlErrorHandling', 'testDataUrlMultipleScriptTags', 'testDataUrlDifferentFormats'] },
                    { name: 'Size Tests', instance: this.sizeTests, tests: ['testUncompressedSize', 'testGzippedSize', 'testCompressionRatio', 'testSizeGrowthMonitoring', 'testCommentPolicyCompliance'] },
                    { name: 'Browser Compatibility Tests', instance: this.browserCompatibilityTests, tests: ['testWebSocketAPISupport', 'testES5Compatibility', 'testDOMAPICompatibility', 'testNoExternalDependencies', 'testGlobalObjectCompatibility', 'testErrorHandlingCompatibility'] },
                    { name: 'Performance Tests', instance: this.performanceTests, tests: ['testMessageProcessingSpeed', 'testLargePayloadHandling', 'testConcurrentConnections', 'testMemoryUsage', 'testLatencyMeasurement', 'testStressTest'] },
                    { name: 'Use Case Tests', instance: this.useCaseTests, tests: ['testChatApplication', 'testLiveDashboard', 'testNewsFeed', 'testCollaborativeEditor', 'testEcommerceLiveUpdates', 'testMultiplayerGame', 'testAnalyticsDashboard', 'testFormValidation'] },
                    { name: 'Advanced Protocol Tests', instance: this.advancedProtocolTests, tests: ['testSwapAction', 'testBeforeAction', 'testAfterAction', 'testCustomVerbHandling', 'testComplexOptionsPassing', 'testBatchOperations', 'testConditionalUpdates', 'testStateManagement'] },
                    { name: 'Reconnection Tests', instance: this.reconnectionTests, tests: ['testExponentialBackoffStrategy', 'testMaximumReconnectionAttempts', 'testConnectionRecovery', 'testManualReconnection', 'testReconnectionDelayConfiguration', 'testReconnectionEventHandling', 'testNetworkInterruptionRecovery', 'testReconnectionStateManagement'] },
                    { name: 'CSS Class Tests', instance: this.cssClassTests, tests: ['testAddClassSingle', 'testAddClassMultiple', 'testAddClassNoDuplicates', 'testAddClassEmpty', 'testAddClassWhitespace', 'testAddClassSpecialChars', 'testRemoveClassSingle', 'testRemoveClassMultiple', 'testRemoveClassNonExistent', 'testRemoveClassEmpty', 'testToggleClassAdd', 'testToggleClassRemove', 'testToggleClassMultiple', 'testToggleClassEmpty', 'testNonExistentElement', 'testInvalidElementId', 'testLongClassName', 'testUnicodeClassName', 'testNumericClassName', 'testEscapedClassName', 'testClassNameWithOptions'] },
                    { name: 'Attribute Tests', instance: this.attributeTests, tests: ['testSetAttrSingle', 'testSetAttrMultiple', 'testSetAttrDataAttributes', 'testSetAttrBoolean', 'testSetAttrEmptyValue', 'testSetAttrSpecialChars', 'testRemoveAttrSingle', 'testRemoveAttrDataAttribute', 'testRemoveAttrNonExistent', 'testRemoveAttrEmpty', 'testSetAttrNonExistentElement', 'testSetAttrInvalidElementId', 'testSetAttrLongValue', 'testSetAttrUnicodeValue', 'testSetAttrEscapedValue', 'testSetAttrWithOptions', 'testFormStateManagement', 'testAccessibilityAttributes'] },
                    { name: 'Style Tests', instance: this.styleTests, tests: ['testSetStyleSingle', 'testSetStyleMultiple', 'testSetStyleWithUnits', 'testSetStyleWithSpaces', 'testSetStyleEmptyValue', 'testSetStyleSpecialChars', 'testRemoveStyleSingle', 'testRemoveStyleMultiple', 'testRemoveStyleNonExistent', 'testRemoveStyleEmpty', 'testSetStyleNonExistentElement', 'testSetStyleInvalidElementId', 'testSetStyleLongValue', 'testSetStyleUnicodeValue', 'testSetStyleEscapedValue', 'testSetStyleWithOptions', 'testAnimationStateManagement', 'testResponsiveDesign', 'testCssCustomProperties'] },
                    { name: 'Event Tests', instance: this.eventTests, tests: ['testTriggerClickEvent', 'testTriggerMultipleEvents', 'testTriggerCustomEvent', 'testTriggerFormEvents', 'testTriggerInputEvents', 'testTriggerKeyboardEvents', 'testTriggerMouseEvents', 'testTriggerFocusEvents', 'testTriggerChangeEvents', 'testTriggerWithEventData', 'testTriggerNonExistentElement', 'testTriggerInvalidElementId', 'testTriggerEmptyEventType', 'testTriggerLongEventData', 'testTriggerUnicodeEventData', 'testTriggerEscapedEventData', 'testTriggerWithOptions', 'testFormValidationTrigger', 'testAccessibilityTrigger'] },
                    { name: 'Form Tests', instance: this.formTests, tests: ['testSetInputValue', 'testSetTextareaValue', 'testSetCheckboxChecked', 'testSetCheckboxUnchecked', 'testSetRadioSelected', 'testSetSelectOption', 'testSetMultipleSelectOptions', 'testSetFileInputValue', 'testSetRangeInputValue', 'testSetDateInputValue', 'testSetTimeInputValue', 'testSetColorInputValue', 'testSetEmailInputValue', 'testSetPasswordInputValue', 'testSetNumberInputValue', 'testSetUrlInputValue', 'testSetSearchInputValue', 'testSetTelInputValue', 'testSetEmptyValue', 'testSetValueWithSpecialChars', 'testSetValueNonExistentElement', 'testSetValueInvalidElementId', 'testSetLongValue', 'testSetUnicodeValue', 'testSetEscapedValue', 'testSetValueWithOptions', 'testFormAutoFill', 'testFormValidation', 'testFormReset'] },
                    { name: 'Animation Tests', instance: this.animationTests, tests: ['testBasicAnimation', 'testAnimationWithDuration', 'testAnimationWithEasing', 'testAnimationWithDelay', 'testMultipleAnimations', 'testCssTransition', 'testTransitionWithProperties', 'testRemoveAnimation', 'testPauseAnimation', 'testResumeAnimation', 'testAnimationState', 'testKeyframeAnimation', 'testTransformAnimation', 'testScaleAnimation', 'testColorTransition', 'testAnimationLoop', 'testAnimationDirection', 'testAnimationFillMode', 'testAnimationNonExistentElement', 'testAnimationInvalidElementId', 'testLongAnimationName', 'testUnicodeAnimationName', 'testEscapedAnimationName', 'testAnimationWithOptions', 'testAnimationSequence', 'testAnimationPerformance', 'testAnimationCleanup'] },
                    { name: 'Security Tests', instance: this.securityTests, tests: ['runAllTests'] }
                ]
            },
            // Individual test suites
            core: { name: 'Core Tests', instance: this.coreTests, tests: ['testWebSocketConnection', 'testOptionsPassing', 'testAllActions'] },
            edge: { name: 'Edge Case Tests', instance: this.edgeCaseTests, tests: ['testEmptyContent', 'testLargeContent', 'testSpecialCharacters', 'testNestedHTML', 'testFormSubmission', 'testInvalidElementId', 'testMalformedMessage', 'testRapidFireMessages', 'testConnectionRecovery'] },
            escape: { name: 'Escape Tests', instance: this.escapeTests, tests: ['testDefaultEscapeCharacter', 'testCustomEscapeCharacter', 'testEscapeCharacterWithPipes', 'testEscapeCharacterHelperMethods'] },
            'data-url': { name: 'Data-URL Tests', instance: this.dataUrlTests, tests: ['testBasicDataUrlInitialization', 'testDataUrlWithCustomConfig', 'testDataUrlWithMessageHandlers', 'testDataUrlWithInteractiveElements', 'testDataUrlErrorHandling', 'testDataUrlMultipleScriptTags', 'testDataUrlDifferentFormats'] },
            size: { name: 'Size Tests', instance: this.sizeTests, tests: ['testUncompressedSize', 'testGzippedSize', 'testCompressionRatio', 'testSizeGrowthMonitoring', 'testCommentPolicyCompliance'] },
            browser: { name: 'Browser Compatibility Tests', instance: this.browserCompatibilityTests, tests: ['testWebSocketAPISupport', 'testES5Compatibility', 'testDOMAPICompatibility', 'testNoExternalDependencies', 'testGlobalObjectCompatibility', 'testErrorHandlingCompatibility'] },
            performance: { name: 'Performance Tests', instance: this.performanceTests, tests: ['testMessageProcessingSpeed', 'testLargePayloadHandling', 'testConcurrentConnections', 'testMemoryUsage', 'testLatencyMeasurement', 'testStressTest'] },
            'use-case': { name: 'Use Case Tests', instance: this.useCaseTests, tests: ['testChatApplication', 'testLiveDashboard', 'testNewsFeed', 'testCollaborativeEditor', 'testEcommerceLiveUpdates', 'testMultiplayerGame', 'testAnalyticsDashboard', 'testFormValidation'] },
            protocol: { name: 'Advanced Protocol Tests', instance: this.advancedProtocolTests, tests: ['testSwapAction', 'testBeforeAction', 'testAfterAction', 'testCustomVerbHandling', 'testComplexOptionsPassing', 'testBatchOperations', 'testConditionalUpdates', 'testStateManagement'] },
            reconnection: { name: 'Reconnection Tests', instance: this.reconnectionTests, tests: ['testExponentialBackoffStrategy', 'testMaximumReconnectionAttempts', 'testConnectionRecovery', 'testManualReconnection', 'testReconnectionDelayConfiguration', 'testReconnectionEventHandling', 'testNetworkInterruptionRecovery', 'testReconnectionStateManagement'] },
            'css-class': { name: 'CSS Class Tests', instance: this.cssClassTests, tests: ['testAddClassSingle', 'testAddClassMultiple', 'testAddClassNoDuplicates', 'testAddClassEmpty', 'testAddClassWhitespace', 'testAddClassSpecialChars', 'testRemoveClassSingle', 'testRemoveClassMultiple', 'testRemoveClassNonExistent', 'testRemoveClassEmpty', 'testToggleClassAdd', 'testToggleClassRemove', 'testToggleClassMultiple', 'testToggleClassEmpty', 'testNonExistentElement', 'testInvalidElementId', 'testLongClassName', 'testUnicodeClassName', 'testNumericClassName', 'testEscapedClassName', 'testClassNameWithOptions'] },
            attribute: { name: 'Attribute Tests', instance: this.attributeTests, tests: ['testSetAttrSingle', 'testSetAttrMultiple', 'testSetAttrDataAttributes', 'testSetAttrBoolean', 'testSetAttrEmptyValue', 'testSetAttrSpecialChars', 'testRemoveAttrSingle', 'testRemoveAttrDataAttribute', 'testRemoveAttrNonExistent', 'testRemoveAttrEmpty', 'testSetAttrNonExistentElement', 'testSetAttrInvalidElementId', 'testSetAttrLongValue', 'testSetAttrUnicodeValue', 'testSetAttrEscapedValue', 'testSetAttrWithOptions', 'testFormStateManagement', 'testAccessibilityAttributes'] },
            style: { name: 'Style Tests', instance: this.styleTests, tests: ['testSetStyleSingle', 'testSetStyleMultiple', 'testSetStyleWithUnits', 'testSetStyleWithSpaces', 'testSetStyleEmptyValue', 'testSetStyleSpecialChars', 'testRemoveStyleSingle', 'testRemoveStyleMultiple', 'testRemoveStyleNonExistent', 'testRemoveStyleEmpty', 'testSetStyleNonExistentElement', 'testSetStyleInvalidElementId', 'testSetStyleLongValue', 'testSetStyleUnicodeValue', 'testSetStyleEscapedValue', 'testSetStyleWithOptions', 'testAnimationStateManagement', 'testResponsiveDesign', 'testCssCustomProperties'] },
            event: { name: 'Event Tests', instance: this.eventTests, tests: ['testTriggerClickEvent', 'testTriggerMultipleEvents', 'testTriggerCustomEvent', 'testTriggerFormEvents', 'testTriggerInputEvents', 'testTriggerKeyboardEvents', 'testTriggerMouseEvents', 'testTriggerFocusEvents', 'testTriggerChangeEvents', 'testTriggerWithEventData', 'testTriggerNonExistentElement', 'testTriggerInvalidElementId', 'testTriggerEmptyEventType', 'testTriggerLongEventData', 'testTriggerUnicodeEventData', 'testTriggerEscapedEventData', 'testTriggerWithOptions', 'testFormValidationTrigger', 'testAccessibilityTrigger'] },
            form: { name: 'Form Tests', instance: this.formTests, tests: ['testSetInputValue', 'testSetTextareaValue', 'testSetCheckboxChecked', 'testSetCheckboxUnchecked', 'testSetRadioSelected', 'testSetSelectOption', 'testSetMultipleSelectOptions', 'testSetFileInputValue', 'testSetRangeInputValue', 'testSetDateInputValue', 'testSetTimeInputValue', 'testSetColorInputValue', 'testSetEmailInputValue', 'testSetPasswordInputValue', 'testSetNumberInputValue', 'testSetUrlInputValue', 'testSetSearchInputValue', 'testSetTelInputValue', 'testSetEmptyValue', 'testSetValueWithSpecialChars', 'testSetValueNonExistentElement', 'testSetValueInvalidElementId', 'testSetLongValue', 'testSetUnicodeValue', 'testSetEscapedValue', 'testSetValueWithOptions', 'testFormAutoFill', 'testFormValidation', 'testFormReset'] },
            animation: { name: 'Animation Tests', instance: this.animationTests, tests: ['testBasicAnimation', 'testAnimationWithDuration', 'testAnimationWithEasing', 'testAnimationWithDelay', 'testMultipleAnimations', 'testCssTransition', 'testTransitionWithProperties', 'testRemoveAnimation', 'testPauseAnimation', 'testResumeAnimation', 'testAnimationState', 'testKeyframeAnimation', 'testTransformAnimation', 'testScaleAnimation', 'testColorTransition', 'testAnimationLoop', 'testAnimationDirection', 'testAnimationFillMode', 'testAnimationNonExistentElement', 'testAnimationInvalidElementId', 'testLongAnimationName', 'testUnicodeAnimationName', 'testEscapedAnimationName', 'testAnimationWithOptions', 'testAnimationSequence', 'testAnimationPerformance', 'testAnimationCleanup'] },
            security: { name: 'Security Tests', instance: this.securityTests, tests: ['runAllTests'] }
        };
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

    showUsage() {
        console.log('\n🧪 WebSocket Hypermedia Test Runner');
        console.log('=====================================\n');
        console.log('Usage: node unified-test-runner.js [category]\n');
        console.log('Categories:');
        console.log('  essential     - Core functionality only (default)');
        console.log('  non-essential - Feature tests only');
        console.log('  full          - All tests including security');
        console.log('');
        console.log('Individual Test Suites:');
        console.log('  core          - Core tests only');
        console.log('  edge          - Edge case tests only');
        console.log('  escape        - Escape tests only');
        console.log('  data-url      - Data URL tests only');
        console.log('  size          - Size tests only');
        console.log('  browser       - Browser compatibility tests only');
        console.log('  performance   - Performance tests only');
        console.log('  use-case      - Use case tests only');
        console.log('  protocol      - Advanced protocol tests only');
        console.log('  reconnection  - Reconnection tests only');
        console.log('  css-class     - CSS class tests only');
        console.log('  attribute     - Attribute tests only');
        console.log('  style         - Style tests only');
        console.log('  event         - Event tests only');
        console.log('  form          - Form tests only');
        console.log('  animation     - Animation tests only');
        console.log('  security      - Security tests only');
        console.log('');
        console.log('Examples:');
        console.log('  node unified-test-runner.js          # Run essential tests');
        console.log('  node unified-test-runner.js full     # Run all tests');
        console.log('  node unified-test-runner.js security # Run security tests only');
        console.log('  node unified-test-runner.js animation # Run animation tests only');
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
                console.error('Server error:', data.toString());
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

    async runCategory(category) {
        const categoryConfig = this.testCategories[category];
        
        if (!categoryConfig) {
            this.log(`Unknown category: ${category}`, 'error');
            this.showUsage();
            return;
        }

        this.log(`🚀 Starting ${categoryConfig.name}...`, 'test');
        console.log('=' .repeat(60));
        
        if (categoryConfig.description) {
            this.log(categoryConfig.description, 'info');
            console.log('');
        }

        try {
            await this.startServer();
            
            if (categoryConfig.suites) {
                // Multiple test suites (essential, non-essential, full)
                for (const suite of categoryConfig.suites) {
                    await this.runTestSuite(suite.name, suite.instance, suite.tests);
                }
            } else {
                // Single test suite (individual categories)
                await this.runTestSuite(categoryConfig.name, categoryConfig.instance, categoryConfig.tests);
            }
            
        } catch (error) {
            this.log(`Test runner error: ${error.message}`, 'error');
            this.failed++;
        } finally {
            await this.cleanup();
            this.printSummary();
        }
    }

    async runAllTests() {
        // Legacy method - now runs essential tests by default
        await this.runCategory('essential');
    }

    async cleanup() {
        if (this.serverProcess) {
            this.log('Stopping test server...', 'info');
            this.serverProcess.kill();
            this.serverProcess = null;
        }
    }

    printSummary() {
        console.log('\n============================================================');
        this.log('📊 Test Summary', 'test');
        console.log('============================================================');
        console.log(`Total Tests: ${this.passed + this.failed}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
        
        if (this.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults.forEach(result => {
                console.log(`  - ${result.suite}: ${result.test} - ${result.error}`);
            });
        }
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed! WebSocket Hypermedia is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Check the output above for details.');
        }
        
        console.log('\n📋 Test Categories:');
        console.log('  - Essential: Core functionality tests (always pass)');
        console.log('  - Non-Essential: Feature tests that may have edge cases');
        console.log('  - Full: All tests including security (may have known failures)');
        console.log('  - Individual: Run specific feature test suites');
    }
}

// Main execution
if (require.main === module) {
    const runner = new UnifiedTestRunner();
    const category = process.argv[2] || 'essential';
    
    if (category === 'help' || category === '--help' || category === '-h') {
        runner.showUsage();
    } else {
        runner.runCategory(category);
    }
}

module.exports = UnifiedTestRunner; 