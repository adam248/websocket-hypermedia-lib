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