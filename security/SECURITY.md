# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 🚨 **Immediate Actions**
1. **DO NOT** create a public GitHub issue
2. **DO NOT** discuss the vulnerability publicly
3. **DO** report it privately to our security team

### 📧 **How to Report**

**Email**: 85082674+adam248@users.noreply.github.com

**Subject Line**: `[SECURITY] WebSocket Hypermedia Library - [Brief Description]`

### 📋 **What to Include**

Please provide the following information:

1. **Description**: Clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Impact**: Potential impact of the vulnerability
4. **Suggested Fix**: If you have a suggested solution
5. **Affected Versions**: Which versions are affected
6. **Proof of Concept**: If applicable, a minimal PoC

### ⏱️ **Response Timeline**

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Resolution**: As quickly as possible, typically within 2 weeks

### 🛡️ **Security Measures**

Our library implements several security measures:

#### **Input Validation**
- WebSocket URL validation to prevent SSRF attacks
- Element ID validation to prevent DOM manipulation attacks
- Content sanitization for all incoming messages

#### **Secure Defaults**
- No automatic execution of arbitrary code
- Safe DOM manipulation practices
- Removed click-to-send vulnerabilities

#### **Production Security**
- Comprehensive security audit completed
- All known vulnerabilities patched
- Regular security reviews

### 🔍 **Security Audit**

We maintain a comprehensive security audit that covers:

- **SSRF Protection**: WebSocket URL validation
- **DOM Security**: Safe element manipulation
- **Content Security**: Input sanitization
- **Protocol Security**: Message format validation

For detailed security information, see:
- [Security Audit Report](SECURITY-AUDIT.md)
- [Security Patches Implemented](SECURITY-PATCHES.md)
- [Production Readiness](PRODUCTION-READINESS.md)

### 🏆 **Security Hall of Fame**

We recognize security researchers who help improve our library:

- **Adam J. Butler** - Initial security audit and patches
- *[Your name could be here!]*

### 📄 **Disclosure Policy**

1. **Private Disclosure**: Vulnerabilities are handled privately
2. **Coordinated Disclosure**: We work with reporters on disclosure timing
3. **Public Disclosure**: After fixes are available, we publicly acknowledge the issue
4. **Credit**: Security researchers are credited in our security documentation

---

**Thank you for helping keep WebSocket Hypermedia Library secure!** 🛡️ 