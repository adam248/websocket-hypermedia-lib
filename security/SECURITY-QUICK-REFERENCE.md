# 🛡️ WebSocket Hypermedia - Security Quick Reference

## 📋 **At a Glance**

**Library Philosophy**: Transparent protocol handler - security vulnerabilities must be prevented at the source (server)

**Security Score**: 7.5/10 (Good with room for improvement)

**Test Status**: 204/204 tests passing (100%)

---

## 🔒 **SERVER RESPONSIBILITIES (MANDATORY)**

### **1. HTML Sanitization**
```javascript
// REQUIRED: Use DOMPurify or similar
const DOMPurify = require('dompurify');
const sanitizedHTML = DOMPurify.sanitize(userContent, {
    ALLOWED_TAGS: ['p', 'div', 'span', 'strong', 'em', 'ul', 'li', 'a'],
    ALLOWED_ATTR: ['class', 'id', 'href'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'javascript:']
});
websocket.send(`update|content|${sanitizedHTML}`);
```

### **2. JSON Validation**
```javascript
// REQUIRED: Prevent prototype pollution
function validateJSON(data) {
    const jsonString = JSON.stringify(data);
    if (jsonString.includes('"__proto__"') || jsonString.includes('"constructor"')) {
        throw new Error('Prototype pollution attempt');
    }
    if (jsonString.length > 1024 * 1024) {
        throw new Error('JSON too large');
    }
    return data;
}
```

### **3. Message Size Limits**
```javascript
// REQUIRED: Prevent DoS
const MAX_MESSAGE_SIZE = 1024 * 1024; // 1MB
const MAX_PARTS = 100;

if (message.length > MAX_MESSAGE_SIZE || message.split('|').length > MAX_PARTS) {
    throw new Error('Message too large or too many parts');
}
```

### **4. Authentication & Authorization**
```javascript
// REQUIRED: Validate connections and actions
wss.on('connection', (ws, req) => {
    if (!validateToken(req.headers.authorization)) {
        ws.close(1008, 'Unauthorized');
        return;
    }
});

function authorizeAction(ws, verb, noun, subject) {
    if (!canUserPerformAction(ws.userId, verb, noun)) {
        throw new Error('Unauthorized');
    }
}
```

### **5. Content Security Policy**
```http
# REQUIRED: CSP headers
Content-Security-Policy: 
    default-src 'self'; 
    script-src 'self' 'unsafe-inline'; 
    style-src 'self' 'unsafe-inline'; 
    object-src 'none';
```

---

## 🖥️ **CLIENT RESPONSIBILITIES (IMPLEMENTED)**

### **Already Implemented**
- ✅ WebSocket URL validation (prevents SSRF)
- ✅ Element ID validation (safe DOM operations)
- ✅ Basic error handling and logging

### **Planned Enhancements**
- 🔄 JSON validation (defense-in-depth)
- 🔄 Message size limits (defense-in-depth)
- 🔄 Security event logging

---

## 🚫 **WHAT THE CLIENT CANNOT DO**

- ❌ **Cannot sanitize HTML** - Would break transparency
- ❌ **Cannot authenticate users** - No server access
- ❌ **Cannot validate business logic** - No context
- ❌ **Cannot rate limit** - No global state

---

## 📊 **Security Matrix**

| Security Concern | Server | Client | Status |
|------------------|--------|--------|---------|
| HTML Sanitization | ✅ REQUIRED | ❌ CANNOT | Server only |
| JSON Validation | ✅ REQUIRED | 🔄 ENHANCEMENT | Server primary |
| Message Size Limits | ✅ REQUIRED | 🔄 ENHANCEMENT | Server primary |
| Authentication | ✅ REQUIRED | ❌ CANNOT | Server only |
| Authorization | ✅ REQUIRED | ❌ CANNOT | Server only |
| Rate Limiting | ✅ REQUIRED | ❌ CANNOT | Server only |
| URL Validation | 🔄 OPTIONAL | ✅ IMPLEMENTED | Client can do |
| Element ID Validation | 🔄 OPTIONAL | ✅ IMPLEMENTED | Client can do |
| CSP Headers | ✅ REQUIRED | ❌ CANNOT | Server only |

**Legend**: ✅ Required/Implemented, 🔄 Enhancement/Optional, ❌ Cannot/Should Not

---

## 🚨 **Production Checklist**

### **Server (MANDATORY)**
- [ ] HTML sanitization (DOMPurify)
- [ ] JSON validation (prototype pollution)
- [ ] Message size limits
- [ ] Authentication & authorization
- [ ] Rate limiting
- [ ] Content Security Policy
- [ ] Input validation
- [ ] Security monitoring

### **Client (VERIFIED)**
- [ ] Use HTTPS/WSS in production
- [ ] WebSocket URL validation (✅ done)
- [ ] Element ID validation (✅ done)
- [ ] Monitor security warnings
- [ ] Keep library updated

---

## 📚 **Resources**

- **Complete Guide**: `security/SECURITY-RESPONSIBILITIES.md`
- **Audit Report**: `security/SECURITY-AUDIT-2025-01-08.md`
- **Summary**: `security/SECURITY-SUMMARY-2025.md`

---

## 🎯 **Key Takeaway**

**The library's transparency is a feature, not a bug.** Use it responsibly by implementing proper server-side security measures. The client library provides defense-in-depth, but the server bears primary security responsibility.

---

*Quick reference based on comprehensive security audit 2025-01-08.* 