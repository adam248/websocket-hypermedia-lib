# 🧪 WebSocket Hypermedia Test Suite

This directory contains comprehensive tests for the WebSocket Hypermedia library, organized into categories for different development needs.

## 🚀 Quick Start

```bash
# Run essential tests only (recommended for contributors)
npm test

# Or explicitly run essential tests
npm run test:essential

# Run all tests including security (may have known failures)
npm run test:full

# Run security tests only
npm run test:security
```

## 📋 Test Categories

### **Essential Tests** (Default)
Core functionality tests that should always pass. Perfect for contributors and CI/CD.

```bash
npm run test:essential
# or simply: npm test
```

**Includes:**
- Core WebSocket functionality
- Basic protocol handling
- Escape character functionality

### **Non-Essential Tests**
Feature tests that may have edge cases or known issues. Good for feature development.

```bash
npm run test:non-essential
```

**Includes:**
- Edge case handling
- Data-URL initialization
- Size verification
- Browser compatibility
- Performance benchmarks
- Use case scenarios
- Advanced protocol features
- Reconnection strategies
- CSS class manipulation
- Attribute manipulation
- Style manipulation
- Event handling
- Form enhancement
- Animation system

### **Full Test Suite**
All tests including security tests. May have known failures for security vulnerabilities.

```bash
npm run test:full
```

**Includes:**
- All essential tests
- All non-essential tests
- Security vulnerability tests

### **Individual Test Suites**
Run specific feature test suites for focused development.

```bash
# Core functionality
npm run test:core

# Animation system
npm run test:animation

# Form enhancement
npm run test:form

# Event handling
npm run test:event

# Style manipulation
npm run test:style

# Attribute manipulation
npm run test:attribute

# CSS class manipulation
npm run test:css-class

# Security tests
npm run test:security
```

## 🎯 When to Use Each Category

### **For Contributors**
- **Essential tests**: Always run these first
- **Individual suites**: When working on specific features
- **Non-essential tests**: Before submitting PRs

### **For Security Researchers**
- **Security tests**: Focus on security vulnerabilities
- **Full test suite**: Complete security assessment

### **For CI/CD**
- **Essential tests**: Fast feedback on core functionality
- **Non-essential tests**: Comprehensive feature validation

### **For Development**
- **Individual suites**: Focused testing during feature development
- **Essential tests**: Quick validation of changes

## 🔧 Command Line Usage

You can also run tests directly with the unified test runner:

```bash
# Show help
node unified-test-runner.js help

# Run specific categories
node unified-test-runner.js essential
node unified-test-runner.js non-essential
node unified-test-runner.js full
node unified-test-runner.js security

# Run individual test suites
node unified-test-runner.js animation
node unified-test-runner.js form
node unified-test-runner.js event
node unified-test-runner.js style
node unified-test-runner.js attribute
node unified-test-runner.js css-class
node unified-test-runner.js core
node unified-test-runner.js edge
node unified-test-runner.js escape
node unified-test-runner.js data-url
node unified-test-runner.js size
node unified-test-runner.js browser
node unified-test-runner.js performance
node unified-test-runner.js use-case
node unified-test-runner.js protocol
node unified-test-runner.js reconnection
```

## 📊 Test Results

Each test run provides:
- **Total Tests**: Number of tests executed
- **Passed**: Number of successful tests
- **Failed**: Number of failed tests
- **Success Rate**: Percentage of tests that passed
- **Detailed Output**: Specific test results and error messages

## 🚨 Security Tests

Security tests are designed to identify potential vulnerabilities:

- **XSS Vulnerability Exposure**: Tests for unsafe HTML insertion
- **JSON.parse() Without Validation**: Tests for prototype pollution risks
- **Object.assign() Prototype Pollution**: Tests for prototype pollution protection
- **Unlimited Message Size**: Tests for DoS vulnerabilities
- **Element ID Injection**: Tests for DOM injection attacks
- **WebSocket URL Injection**: Tests for SSRF vulnerabilities
- **Event Data Injection**: Tests for event injection attacks
- **Animation Keyframe Injection**: Tests for animation injection
- **Style Property Injection**: Tests for CSS injection
- **Attribute Value Injection**: Tests for attribute injection

**Note**: Security tests may have known failures as they test for vulnerabilities that exist by design (server-side responsibilities) or are being addressed.

## 🏗️ Test Architecture

### **Test Categories**
- **Essential**: Core functionality (always pass)
- **Non-Essential**: Feature tests (may have edge cases)
- **Full**: All tests including security (may have known failures)
- **Individual**: Specific feature test suites

### **Test Types**
- **Unit Tests**: Individual function testing
- **Integration Tests**: WebSocket server interaction
- **Security Tests**: Vulnerability identification
- **Performance Tests**: Speed and memory benchmarks
- **Compatibility Tests**: Browser and environment validation

### **Test Infrastructure**
- **WebSocket Server**: Test server for integration testing
- **Unified Test Runner**: Categorized test execution
- **Legacy Test Runner**: Original test system (still available)

## 🔄 Migration from Legacy Tests

The legacy test system is still available:

```bash
npm run test:legacy
```

This runs the original test suite without categorization.

## 📝 Contributing

When adding new tests:

1. **Categorize appropriately**: Essential, non-essential, or individual
2. **Update test categories**: Add to the appropriate category in `unified-test-runner.js`
3. **Document test purpose**: Add comments explaining what the test validates
4. **Consider security implications**: Add security tests for new features

## 🎉 Success Criteria

- **Essential tests**: Must always pass (100% success rate)
- **Non-essential tests**: Should pass in normal conditions
- **Security tests**: May have known failures (documented vulnerabilities)
- **Individual suites**: Should pass for the specific feature being tested

This categorized approach ensures that contributors can focus on the tests that matter most for their specific development needs while maintaining comprehensive coverage for the entire library. 