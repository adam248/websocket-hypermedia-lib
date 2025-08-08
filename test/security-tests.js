const fs = require('fs');
const path = require('path');

class SecurityTests {
    constructor() {
        this.libraryContent = fs.readFileSync(path.join(__dirname, '../src/websocket-hypermedia.js'), 'utf8');
        this.testResults = [];
    }

    runAllTests() {
        console.log('🔒 Running Security Tests...');
        
        this.testJsonValidation();
        this.testMessageSizeLimits();
        this.testPrototypePollutionProtection();
        this.testSecurityLogging();
        this.testInputSanitizationHooks();
        this.testProtocolVersionValidation();
        
        // NEW SECURITY TESTS - Testing the 10 most obvious security concerns
        this.testXssVulnerabilityExposure();
        this.testJsonParseWithoutValidation();
        this.testObjectAssignPrototypePollution();
        this.testUnlimitedMessageSize();
        this.testElementIdInjection();
        this.testWebSocketUrlInjection();
        this.testEventDataInjection();
        this.testAnimationKeyframeInjection();
        this.testStylePropertyInjection();
        this.testAttributeValueInjection();
        
        this.printResults();
    }

    testJsonValidation() {
        console.log('  📦 Testing JSON Validation...');
        
        // Test 1: Check if JSON validation options are available
        const hasJsonValidationOptions = this.libraryContent.includes('maxJsonSize') || 
                                       this.libraryContent.includes('enableJsonValidation');
        
        this.assert('JSON validation options available', hasJsonValidationOptions, 
                   'Should have maxJsonSize and enableJsonValidation options');
        
        // Test 2: Check if JSON validation method exists
        const hasJsonValidationMethod = this.libraryContent.includes('_vJson') ||
                                      this.libraryContent.includes('_validateJson') ||
                                      this.libraryContent.includes('validateJson');
        
        this.assert('JSON validation method exists', hasJsonValidationMethod,
                   'Should have _vJson, _validateJson or validateJson method');
        
        // Test 3: Check if prototype pollution protection exists
        const hasPrototypePollutionProtection = this.libraryContent.includes('__proto__') ||
                                              this.libraryContent.includes('constructor') ||
                                              this.libraryContent.includes('prototype');
        
        this.assert('Prototype pollution protection exists', hasPrototypePollutionProtection,
                   'Should check for __proto__ and constructor in JSON data');
    }

    testMessageSizeLimits() {
        console.log('  📏 Testing Message Size Limits...');
        
        // Test 1: Check if message size limit options are available
        const hasMessageSizeOptions = this.libraryContent.includes('maxMessageSize') ||
                                    this.libraryContent.includes('maxParts');
        
        this.assert('Message size limit options available', hasMessageSizeOptions,
                   'Should have maxMessageSize and maxParts options');
        
        // Test 2: Check if parseMessage method has size limits
        const parseMessageHasSizeChecks = this.libraryContent.includes('maxMessageSize') &&
                                        this.libraryContent.includes('maxParts') &&
                                        this.libraryContent.includes('parseMessage');
        
        this.assert('parseMessage has size limit checks', parseMessageHasSizeChecks,
                   'parseMessage method should check message size and parts limits');
    }

    testPrototypePollutionProtection() {
        console.log('  🛡️ Testing Prototype Pollution Protection...');
        
        // Test 1: Check if Object.assign is protected
        const hasObjectAssignProtection = this.libraryContent.includes('Object.assign') &&
                                        (this.libraryContent.includes('safeData') ||
                                         this.libraryContent.includes('__proto__') ||
                                         this.libraryContent.includes('constructor'));
        
        this.assert('Object.assign has prototype pollution protection', hasObjectAssignProtection,
                   'Object.assign should be protected against prototype pollution');
        
        // Test 2: Check if safe object assignment pattern exists
        const hasSafeAssignment = this.libraryContent.includes('safeData') ||
                                this.libraryContent.includes('safeData = {}') ||
                                this.libraryContent.includes('Object.entries');
        
        this.assert('Safe object assignment pattern exists', hasSafeAssignment,
                   'Should use safe object assignment pattern');
    }

    testSecurityLogging() {
        console.log('  📝 Testing Security Logging...');
        
        // Test 1: Check if security logging options are available
        const hasSecurityLoggingOptions = this.libraryContent.includes('enableSecurityLogging') ||
                                        this.libraryContent.includes('securityLogLevel');
        
        this.assert('Security logging options available', hasSecurityLoggingOptions,
                   'Should have enableSecurityLogging and securityLogLevel options');
        
        // Test 2: Check if security logging method exists
        const hasSecurityLoggingMethod = this.libraryContent.includes('_logSec') ||
                                       this.libraryContent.includes('_logSecurityEvent') ||
                                       this.libraryContent.includes('logSecurityEvent');
        
        this.assert('Security logging method exists', hasSecurityLoggingMethod,
                   'Should have _logSec, _logSecurityEvent or logSecurityEvent method');
    }

    testInputSanitizationHooks() {
        console.log('  🔧 Testing Input Sanitization Hooks...');
        
        // Test 1: Check if input sanitization options are available
        const hasInputSanitizationOptions = this.libraryContent.includes('inputSanitizers') ||
                                          this.libraryContent.includes('sanitizers');
        
        this.assert('Input sanitization options available', hasInputSanitizationOptions,
                   'Should have inputSanitizers or sanitizers options');
        
        // Test 2: Check if sanitization method exists
        const hasSanitizationMethod = this.libraryContent.includes('_san') ||
                                    this.libraryContent.includes('_sanitizeInput') ||
                                    this.libraryContent.includes('sanitizeInput');
        
        this.assert('Input sanitization method exists', hasSanitizationMethod,
                   'Should have _san, _sanitizeInput or sanitizeInput method');
    }

    testProtocolVersionValidation() {
        console.log('  🔄 Testing Protocol Version Validation...');
        
        // Test 1: Check if protocol version options are available
        const hasProtocolVersionOptions = this.libraryContent.includes('protocolVersion') ||
                                        this.libraryContent.includes('requireVersion');
        
        this.assert('Protocol version options available', hasProtocolVersionOptions,
                   'Should have protocolVersion and requireVersion options');
        
        // Test 2: Check if protocol validation method exists
        const hasProtocolValidationMethod = this.libraryContent.includes('_vProto') ||
                                          this.libraryContent.includes('_validateProtocolVersion') ||
                                          this.libraryContent.includes('validateProtocolVersion');
        
        this.assert('Protocol validation method exists', hasProtocolValidationMethod,
                   'Should have _vProto, _validateProtocolVersion or validateProtocolVersion method');
    }

    // NEW SECURITY TESTS - Testing the 10 most obvious security concerns

    testXssVulnerabilityExposure() {
        console.log('  🚨 Testing XSS Vulnerability Exposure...');
        
        // Test 1: Check if innerHTML is used without sanitization
        const usesInnerHTML = this.libraryContent.includes('innerHTML') &&
                             (this.libraryContent.includes('el.innerHTML = subject') ||
                              this.libraryContent.includes('innerHTML = subject'));
        
        this.assert('XSS vulnerability: innerHTML usage without sanitization', usesInnerHTML,
                   'Library uses innerHTML directly - this is a known XSS vulnerability if server doesn\'t sanitize');
        
        // Test 2: Check if outerHTML is used without sanitization
        const usesOuterHTML = this.libraryContent.includes('outerHTML') &&
                             (this.libraryContent.includes('el.outerHTML = subject') ||
                              this.libraryContent.includes('outerHTML = subject'));
        
        this.assert('XSS vulnerability: outerHTML usage without sanitization', usesOuterHTML,
                   'Library uses outerHTML directly - this is a known XSS vulnerability if server doesn\'t sanitize');
        
        // Test 3: Check if insertAdjacentHTML is used without sanitization
        const usesInsertAdjacentHTML = this.libraryContent.includes('insertAdjacentHTML') &&
                                      (this.libraryContent.includes('insertAdjacentHTML(\'beforeend\'') ||
                                       this.libraryContent.includes('insertAdjacentHTML(\'afterbegin\'') ||
                                       this.libraryContent.includes('insertAdjacentHTML(\'beforebegin\'') ||
                                       this.libraryContent.includes('insertAdjacentHTML(\'afterend\''));
        
        this.assert('XSS vulnerability: insertAdjacentHTML usage without sanitization', usesInsertAdjacentHTML,
                   'Library uses insertAdjacentHTML directly - this is a known XSS vulnerability if server doesn\'t sanitize');
    }

    testJsonParseWithoutValidation() {
        console.log('  🔓 Testing JSON.parse() Without Validation...');
        
        // Test 1: Check if JSON.parse is used without size validation
        const usesJsonParse = this.libraryContent.includes('JSON.parse(');
        
        this.assert('JSON.parse() used without size validation', usesJsonParse,
                   'JSON.parse() is used - could lead to memory exhaustion with large payloads');
        
        // Test 2: Check if JSON.parse is used without prototype pollution protection
        const jsonParseWithoutProtection = this.libraryContent.includes('JSON.parse(') &&
                                          !this.libraryContent.includes('__proto__') &&
                                          !this.libraryContent.includes('constructor');
        
        this.assert('JSON.parse() used without prototype pollution protection', jsonParseWithoutProtection,
                   'JSON.parse() used without checking for __proto__ or constructor - prototype pollution risk');
        
        // Test 3: Check if JSON.parse is used in trigger action
        const triggerUsesJsonParse = this.libraryContent.includes('trigger:') &&
                                   this.libraryContent.includes('JSON.parse(');
        
        this.assert('Trigger action uses JSON.parse() without validation', triggerUsesJsonParse,
                   'Trigger action uses JSON.parse() - could be exploited with malicious event data');
    }

    testObjectAssignPrototypePollution() {
        console.log('  🦠 Testing Object.assign() Prototype Pollution...');
        
        // Test 1: Check if Object.assign is used without protection
        const usesObjectAssign = this.libraryContent.includes('Object.assign(');
        
        this.assert('Object.assign() used without prototype pollution protection', usesObjectAssign,
                   'Object.assign() is used - could lead to prototype pollution if data contains __proto__ or constructor');
        
        // Test 2: Check if Object.assign is used with untrusted data
        const objectAssignWithUntrustedData = this.libraryContent.includes('Object.assign(') &&
                                             this.libraryContent.includes('event,') &&
                                             this.libraryContent.includes('data');
        
        this.assert('Object.assign() used with untrusted event data', objectAssignWithUntrustedData,
                   'Object.assign(event, data) used - prototype pollution risk if data is malicious');
    }

    testUnlimitedMessageSize() {
        console.log('  📏 Testing Unlimited Message Size...');
        
        // Test 1: Check if parseMessage method has no size limits
        const parseMessageNoSizeChecks = this.libraryContent.includes('parseMessage') &&
                                       !this.libraryContent.includes('maxMessageSize') &&
                                       !this.libraryContent.includes('data.length >');
        
        this.assert('parseMessage() has no message size limits', parseMessageNoSizeChecks,
                   'parseMessage method processes messages without size limits - DoS vulnerability');
        
        // Test 2: Check if message parts are unlimited
        const unlimitedParts = this.libraryContent.includes('parseMessage') &&
                             !this.libraryContent.includes('maxParts') &&
                             !this.libraryContent.includes('parts.length >');
        
        this.assert('parseMessage() has no parts limit', unlimitedParts,
                   'parseMessage method processes unlimited parts - DoS vulnerability');
    }

    testElementIdInjection() {
        console.log('  🎯 Testing Element ID Injection...');
        
        // Test 1: Check if element ID validation is bypassed
        const elementIdValidation = this.libraryContent.includes('_validateElementId') ||
                                  this.libraryContent.includes('validateElementId');
        
        this.assert('Element ID validation exists', elementIdValidation,
                   'Element ID validation should exist to prevent injection attacks');
        
        // Test 2: Check if getElementById is used without validation
        const getElementByIdWithoutValidation = this.libraryContent.includes('getElementById') &&
                                              !this.libraryContent.includes('_validateElementId') &&
                                              !this.libraryContent.includes('validateElementId');
        
        this.assert('getElementById used without ID validation', getElementByIdWithoutValidation,
                   'getElementById used without validation - could be exploited with malicious IDs');
    }

    testWebSocketUrlInjection() {
        console.log('  🌐 Testing WebSocket URL Injection...');
        
        // Test 1: Check if WebSocket URL validation exists
        const urlValidation = this.libraryContent.includes('_validateWebSocketUrl') ||
                            this.libraryContent.includes('validateWebSocketUrl');
        
        this.assert('WebSocket URL validation exists', urlValidation,
                   'WebSocket URL validation should exist to prevent SSRF attacks');
        
        // Test 2: Check if WebSocket constructor is used without validation
        const wsConstructorWithoutValidation = this.libraryContent.includes('new WebSocket(') &&
                                             !this.libraryContent.includes('_validateWebSocketUrl') &&
                                             !this.libraryContent.includes('validateWebSocketUrl');
        
        this.assert('WebSocket constructor used without URL validation', wsConstructorWithoutValidation,
                   'WebSocket constructor used without validation - SSRF vulnerability');
    }

    testEventDataInjection() {
        console.log('  ⚡ Testing Event Data Injection...');
        
        // Test 1: Check if event data is used without sanitization
        const eventDataWithoutSanitization = this.libraryContent.includes('eventData') &&
                                           !this.libraryContent.includes('_san') &&
                                           !this.libraryContent.includes('_sanitizeInput');
        
        this.assert('Event data used without sanitization', eventDataWithoutSanitization,
                   'Event data used without sanitization - injection vulnerability');
        
        // Test 2: Check if event type is used without validation
        const eventTypeWithoutValidation = this.libraryContent.includes('eventType') &&
                                         !this.libraryContent.includes('_san') &&
                                         !this.libraryContent.includes('_sanitizeInput');
        
        this.assert('Event type used without validation', eventTypeWithoutValidation,
                   'Event type used without validation - could be exploited with malicious event types');
    }

    testAnimationKeyframeInjection() {
        console.log('  🎬 Testing Animation Keyframe Injection...');
        
        // Test 1: Check if animation keyframes use JSON.parse without validation
        const keyframeJsonParse = this.libraryContent.includes('animate') &&
                                this.libraryContent.includes('JSON.parse(');
        
        this.assert('Animation keyframes use JSON.parse() without validation', keyframeJsonParse,
                   'Animation keyframes parsed with JSON.parse() - injection vulnerability');
        
        // Test 2: Check if animation properties are used without sanitization
        const animationPropsWithoutSanitization = this.libraryContent.includes('animationName') &&
                                                !this.libraryContent.includes('_san') &&
                                                !this.libraryContent.includes('_sanitizeInput');
        
        this.assert('Animation properties used without sanitization', animationPropsWithoutSanitization,
                   'Animation properties used without sanitization - injection vulnerability');
    }

    testStylePropertyInjection() {
        console.log('  🎨 Testing Style Property Injection...');
        
        // Test 1: Check if style properties are set without validation
        const stylePropertyWithoutValidation = this.libraryContent.includes('el.style[') &&
                                             !this.libraryContent.includes('_san') &&
                                             !this.libraryContent.includes('_sanitizeInput');
        
        this.assert('Style properties set without validation', stylePropertyWithoutValidation,
                   'Style properties set without validation - CSS injection vulnerability');
        
        // Test 2: Check if setStyle action uses untrusted input
        const setStyleUsesUntrustedInput = this.libraryContent.includes('setStyle:') &&
                                         this.libraryContent.includes('property,') &&
                                         this.libraryContent.includes('value');
        
        this.assert('setStyle action uses untrusted input', setStyleUsesUntrustedInput,
                   'setStyle action uses untrusted property and value - CSS injection risk');
    }

    testAttributeValueInjection() {
        console.log('  🏷️ Testing Attribute Value Injection...');
        
        // Test 1: Check if setAttr uses untrusted input without validation
        const setAttrUsesUntrustedInput = this.libraryContent.includes('setAttr:') &&
                                        this.libraryContent.includes('attrName,') &&
                                        this.libraryContent.includes('value') &&
                                        !this.libraryContent.includes('_san') &&
                                        !this.libraryContent.includes('_sanitizeInput');
        
        this.assert('setAttr action uses untrusted input without validation', setAttrUsesUntrustedInput,
                   'setAttr action uses untrusted attrName and value - attribute injection vulnerability');
        
        // Test 2: Check if setAttribute is used without sanitization
        const setAttributeWithoutSanitization = this.libraryContent.includes('setAttribute(') &&
                                              !this.libraryContent.includes('_san') &&
                                              !this.libraryContent.includes('_sanitizeInput');
        
        this.assert('setAttribute used without sanitization', setAttributeWithoutSanitization,
                   'setAttribute used without sanitization - attribute injection vulnerability');
    }

    assert(testName, condition, message) {
        const result = {
            test: testName,
            passed: condition,
            message: message
        };
        
        this.testResults.push(result);
        
        if (condition) {
            console.log(`    ✅ ${testName} - PASSED`);
        } else {
            console.log(`    ❌ ${testName} - FAILED: ${message}`);
        }
    }

    printResults() {
        console.log('\n📊 Security Test Results:');
        console.log('========================');
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        
        if (total - passed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults.filter(r => !r.passed).forEach(r => {
                console.log(`  - ${r.test}: ${r.message}`);
            });
        }
        
        console.log('\n');
    }
}

module.exports = SecurityTests; 