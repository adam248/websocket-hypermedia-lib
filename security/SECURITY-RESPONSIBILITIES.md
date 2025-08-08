# 🛡️ WebSocket Hypermedia - Security Responsibilities

## 📋 **Overview**

This document clearly defines security responsibilities between **server-side** and **client-side** components when using the WebSocket Hypermedia library. It's based on comprehensive security audits and follows the library's transparent protocol philosophy.

**Last Updated**: 2025-08-08  
**Library Version**: v1.1.1  
**Audit Basis**: Comprehensive security audit (204/204 tests passing)

---

## 🎯 **Security Philosophy**

The WebSocket Hypermedia library follows a **transparent protocol** approach where:

- **Server Responsibility**: Content validation, sanitization, and business logic security
- **Client Responsibility**: Protocol handling and safe DOM manipulation
- **Library Responsibility**: Secure protocol implementation and defense-in-depth measures

**Core Principle**: The library is a transparent protocol handler. Security vulnerabilities in content should be prevented at the source (server), not patched in the client.

---

## 🏗️ **Architecture & Security Boundaries**

```
┌─────────────────┐    WebSocket Messages    ┌─────────────────┐
│                 │ ────────────────────────► │                 │
│   SERVER        │                          │   CLIENT        │
│                 │ ◄──────────────────────── │                 │
└─────────────────┘                          └─────────────────┘
       │                                              │
       │                                              │
       ▼                                              ▼
┌─────────────────┐                          ┌─────────────────┐
│ Security Zone   │                          │ Security Zone   │
│                 │                          │                 │
│ • Content       │                          │ • Protocol      │
│   Validation    │                          │   Validation    │
│ • HTML          │                          │ • Message       │
│   Sanitization  │                          │   Parsing       │
│ • Business      │                          │ • DOM           │
│   Logic         │                          │   Operations    │
│ • Rate Limiting │                          │ • Element       │
│ • Authentication│                          │   Targeting     │
└─────────────────┘                          └─────────────────┘
```

---

## 🔒 **SERVER-SIDE SECURITY RESPONSIBILITIES**

### **1. Content Security (CRITICAL)**

#### **1.1 HTML Sanitization**
**Responsibility**: ✅ **SERVER ONLY**

**Why**: The library uses `innerHTML`, `outerHTML`, and `insertAdjacentHTML` without sanitization. This is by design to maintain transparency.

**Server Implementation**:
```javascript
// REQUIRED: Server-side HTML sanitization
const DOMPurify = require('dompurify');

function sanitizeHTML(html) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'div', 'span', 'strong', 'em', 'ul', 'li', 'a'],
        ALLOWED_ATTR: ['class', 'id', 'href'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onload', 'onerror', 'javascript:']
    });
}

// ALWAYS sanitize before sending
websocket.send(`update|content|${sanitizeHTML(userContent)}`);
```

**Risk if not implemented**: HIGH - XSS attacks, script injection, data theft

#### **1.2 JSON Data Validation**
**Responsibility**: ✅ **SERVER ONLY**

**Why**: The library parses JSON for event data and animation keyframes. Malicious JSON can cause prototype pollution.

**Server Implementation**:
```javascript
// REQUIRED: Validate JSON data before sending
function validateAndSanitizeJSON(data) {
    // Check for prototype pollution attempts
    const jsonString = JSON.stringify(data);
    if (jsonString.includes('"__proto__"') || jsonString.includes('"constructor"')) {
        throw new Error('Invalid JSON: prototype pollution attempt');
    }
    
    // Validate size limits
    if (jsonString.length > 1024 * 1024) { // 1MB limit
        throw new Error('JSON data too large');
    }
    
    return data;
}

// ALWAYS validate JSON before sending
const eventData = validateAndSanitizeJSON({ type: 'user-action', data: userInput });
websocket.send(`trigger|button|click|${JSON.stringify(eventData)}`);
```

**Risk if not implemented**: MEDIUM - Prototype pollution, memory exhaustion, DoS

#### **1.3 Message Size Limits**
**Responsibility**: ✅ **SERVER ONLY**

**Why**: The library processes messages without size limits. Large messages can cause DoS.

**Server Implementation**:
```javascript
// REQUIRED: Enforce message size limits
const MAX_MESSAGE_SIZE = 1024 * 1024; // 1MB
const MAX_PARTS = 100;

function validateMessageSize(message) {
    if (message.length > MAX_MESSAGE_SIZE) {
        throw new Error('Message too large');
    }
    
    const parts = message.split('|');
    if (parts.length > MAX_PARTS) {
        throw new Error('Too many message parts');
    }
    
    return true;
}

// ALWAYS validate before sending
validateMessageSize(message);
websocket.send(message);
```

**Risk if not implemented**: LOW-MEDIUM - DoS through large messages

### **2. Business Logic Security**

#### **2.1 Authentication & Authorization**
**Responsibility**: ✅ **SERVER ONLY**

**Implementation**:
```javascript
// REQUIRED: Authenticate WebSocket connections
wss.on('connection', (ws, req) => {
    // Validate authentication token
    const token = req.headers['authorization'];
    if (!validateToken(token)) {
        ws.close(1008, 'Unauthorized');
        return;
    }
    
    // Store user context
    ws.userId = getUserIdFromToken(token);
    ws.permissions = getUserPermissions(token);
});

// REQUIRED: Authorize actions
function authorizeAction(ws, verb, noun, subject) {
    // Check if user can perform this action
    if (!canUserPerformAction(ws.userId, verb, noun)) {
        throw new Error('Unauthorized action');
    }
    
    // Check if user can modify this element
    if (!canUserModifyElement(ws.userId, noun)) {
        throw new Error('Unauthorized element access');
    }
}
```

#### **2.2 Rate Limiting**
**Responsibility**: ✅ **SERVER ONLY**

**Implementation**:
```javascript
// REQUIRED: Rate limiting
const rateLimit = require('express-rate-limit');

const wsRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP'
});

// Apply to WebSocket connections
wss.on('connection', (ws, req) => {
    if (!rateLimit.check(req)) {
        ws.close(1008, 'Rate limit exceeded');
        return;
    }
});
```

#### **2.3 Input Validation**
**Responsibility**: ✅ **SERVER ONLY**

**Implementation**:
```javascript
// REQUIRED: Validate all inputs
function validateInput(verb, noun, subject, options) {
    // Validate verb
    const allowedVerbs = ['update', 'append', 'prepend', 'replace', 'remove', 'addClass', 'removeClass'];
    if (!allowedVerbs.includes(verb)) {
        throw new Error('Invalid verb');
    }
    
    // Validate element ID
    if (!/^[a-zA-Z0-9_-]+$/.test(noun)) {
        throw new Error('Invalid element ID');
    }
    
    // Validate subject based on verb
    if (verb === 'addClass' && !/^[a-zA-Z0-9_-]+$/.test(subject)) {
        throw new Error('Invalid class name');
    }
    
    return true;
}
```

### **3. Infrastructure Security**

#### **3.1 WebSocket URL Security**
**Responsibility**: ✅ **SERVER ONLY**

**Implementation**:
```javascript
// REQUIRED: Secure WebSocket server configuration
const wss = new WebSocket.Server({
    server: httpsServer, // Use HTTPS
    path: '/ws', // Specific path
    verifyClient: (info) => {
        // Validate origin
        const origin = info.origin || info.req.headers.origin;
        return allowedOrigins.includes(origin);
    }
});
```

#### **3.2 Content Security Policy**
**Responsibility**: ✅ **SERVER ONLY**

**Implementation**:
```http
# REQUIRED: CSP headers
Content-Security-Policy: 
    default-src 'self'; 
    script-src 'self' 'unsafe-inline'; 
    style-src 'self' 'unsafe-inline'; 
    object-src 'none'; 
    base-uri 'self';
```

---

## 🖥️ **CLIENT-SIDE SECURITY RESPONSIBILITIES**

### **1. Protocol Security**

#### **1.1 WebSocket URL Validation**
**Responsibility**: ✅ **CLIENT LIBRARY** (Implemented)

**Implementation**: Already implemented in the library
```javascript
_validateWebSocketUrl(url) {
    try {
        const urlObj = new URL(url);
        if (!['ws:', 'wss:'].includes(urlObj.protocol)) {
            throw new Error('Invalid WebSocket protocol');
        }
        return true;
    } catch (error) {
        throw new Error('Invalid WebSocket URL');
    }
}
```

#### **1.2 Element ID Validation**
**Responsibility**: ✅ **CLIENT LIBRARY** (Implemented)

**Implementation**: Already implemented in the library
```javascript
_validateElementId(id) {
    if (typeof id !== 'string' || id.length === 0 || id.length > 100) {
        return false;
    }
    return /^[a-zA-Z0-9_-]+$/.test(id);
}
```

#### **1.3 Message Parsing Security**
**Responsibility**: ✅ **CLIENT LIBRARY** (Needs Improvement)

**Current Status**: Basic parsing implemented, needs enhancement
**Planned Improvements**:
- Message size limits
- Parts count limits
- JSON validation for event data

### **2. DOM Security**

#### **2.1 Safe DOM Operations**
**Responsibility**: ✅ **CLIENT LIBRARY** (Implemented)

**Implementation**: The library uses safe DOM methods and validates element IDs before operations.

#### **2.2 Error Handling**
**Responsibility**: ✅ **CLIENT LIBRARY** (Needs Improvement)

**Current Status**: Basic error handling implemented
**Planned Improvements**:
- Security event logging
- Graceful degradation for security violations

---

## 🚫 **WHAT THE CLIENT LIBRARY CANNOT DO**

### **1. Content Security**
- ❌ **Cannot sanitize HTML** - Would break transparency
- ❌ **Cannot validate business logic** - No context
- ❌ **Cannot authenticate users** - No server access
- ❌ **Cannot rate limit** - No global state

### **2. Why These Limitations Exist**
- **Transparency**: The library must remain a transparent protocol handler
- **Context**: Client has no knowledge of server-side business rules
- **Performance**: Client-side validation would duplicate server work
- **Security**: Client-side security can be bypassed

---

## 📊 **Security Responsibility Matrix**

| Security Concern | Server | Client Library | Rationale |
|------------------|--------|----------------|-----------|
| HTML Sanitization | ✅ REQUIRED | ❌ CANNOT | Transparency requirement |
| JSON Validation | ✅ REQUIRED | 🔄 ENHANCEMENT | Server primary, client defense |
| Message Size Limits | ✅ REQUIRED | 🔄 ENHANCEMENT | Server primary, client defense |
| Authentication | ✅ REQUIRED | ❌ CANNOT | No server access |
| Authorization | ✅ REQUIRED | ❌ CANNOT | No business context |
| Rate Limiting | ✅ REQUIRED | ❌ CANNOT | No global state |
| URL Validation | 🔄 OPTIONAL | ✅ IMPLEMENTED | Client can validate |
| Element ID Validation | 🔄 OPTIONAL | ✅ IMPLEMENTED | Client can validate |
| CSP Headers | ✅ REQUIRED | ❌ CANNOT | Server infrastructure |
| Input Validation | ✅ REQUIRED | 🔄 ENHANCEMENT | Server primary, client defense |

**Legend**: ✅ Required/Implemented, 🔄 Enhancement/Optional, ❌ Cannot/Should Not

---

## 🎯 **IMPLEMENTATION PRIORITIES**

### **Server-Side (CRITICAL - Must Implement)**
1. **HTML Sanitization** - Use DOMPurify or similar
2. **JSON Validation** - Check for prototype pollution
3. **Message Size Limits** - Prevent DoS attacks
4. **Authentication** - Validate WebSocket connections
5. **Authorization** - Check user permissions
6. **Rate Limiting** - Prevent abuse
7. **CSP Headers** - Restrict script execution

### **Client-Side (ENHANCEMENT - Should Implement)**
1. **Enhanced JSON Validation** - Additional defense
2. **Message Size Limits** - Additional defense
3. **Security Logging** - Better monitoring
4. **Input Sanitization Hooks** - Optional validation

---

## 🚨 **SECURITY CHECKLIST**

### **Server Implementation Checklist**
- [ ] Implement HTML sanitization (DOMPurify recommended)
- [ ] Validate JSON data for prototype pollution
- [ ] Enforce message size limits
- [ ] Implement authentication for WebSocket connections
- [ ] Implement authorization for all actions
- [ ] Configure rate limiting
- [ ] Set up Content Security Policy headers
- [ ] Validate all inputs before processing
- [ ] Monitor for security violations
- [ ] Log security events

### **Client Implementation Checklist**
- [ ] Use HTTPS/WSS in production
- [ ] Validate WebSocket URLs (already implemented)
- [ ] Configure security options when available
- [ ] Monitor for security warnings
- [ ] Test with malicious content
- [ ] Keep library updated

---

## 📚 **RESOURCES**

### **Server-Side Security Libraries**
- **HTML Sanitization**: DOMPurify, sanitize-html
- **Rate Limiting**: express-rate-limit, limiter
- **Authentication**: JWT, session-based auth
- **Input Validation**: Joi, Yup, express-validator

### **Security Headers**
- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME sniffing protection

### **Monitoring & Logging**
- **Security Events**: Log all security violations
- **Performance Monitoring**: Track message sizes and rates
- **Error Tracking**: Monitor for security-related errors

---

## 🎉 **CONCLUSION**

**The WebSocket Hypermedia library is designed as a transparent protocol handler, which means:**

1. **Server bears primary security responsibility** for content and business logic
2. **Client library provides defense-in-depth** for protocol-level security
3. **Both must work together** for comprehensive security

**This design choice enables:**
- ✅ Maximum transparency and flexibility
- ✅ Clear separation of concerns
- ✅ Optimal performance (no duplicate validation)
- ✅ Proper security architecture

**Remember**: The library's transparency is a feature, not a bug. Use it responsibly by implementing proper server-side security measures.

---

*This document should be reviewed and updated with each security audit. Last updated based on comprehensive security audit 2025-01-08.* 