# WebSocket Hypermedia Tutorials

> **From Zero to Hero: Master Real-Time Hypermedia in 4 Lessons**

Welcome to the WebSocket Hypermedia library tutorials! This series will take you from complete beginner to building sophisticated real-time applications. Each lesson builds on the previous one, so follow them in order.

## Prerequisites

- Basic HTML, CSS, and JavaScript knowledge
- A modern web browser
- A simple web server (we'll show you how to set one up)

## Lesson 1: Hello, Real-Time World! 🌍

**Goal**: Create your first real-time application in under 5 minutes

### Step 1: Set Up Your Environment

Create a new folder and add these files:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>My First Real-Time App</title>
</head>
<body>
    <h1>Real-Time Counter</h1>
    <div id="counter">0</div>
    <button onclick="increment()">Increment</button>
    
    <script src="websocket-hypermedia.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

```javascript
// app.js
const ws = new WebSocketHypermedia("ws://localhost:8765");

function increment() {
    // Send a message to update the counter
    ws.send("update|counter|" + (parseInt(document.getElementById('counter').textContent) + 1));
}
```

### Step 2: Create a Simple Server

```javascript
// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8765 });

wss.on('connection', (ws) => {
    console.log('Client connected!');
    
    ws.on('message', (message) => {
        // Echo the message back to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

console.log('Server running on ws://localhost:8765');
```

### Step 3: Run Your App

1. Install Node.js if you haven't already
2. Run `npm install ws`
3. Start the server: `node server.js`
4. Open `index.html` in your browser
5. Open multiple browser tabs and watch the counter sync!

**🎉 Congratulations!** You've created your first real-time application!

## Lesson 2: Building a Chat Application 💬

**Goal**: Create a multi-user chat room with real-time messaging

### Step 1: Enhanced HTML Structure

```html
<!-- chat.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Real-Time Chat</title>
    <style>
        #messages { height: 300px; overflow-y: scroll; border: 1px solid #ccc; }
        .message { margin: 5px; padding: 10px; background: #f0f0f0; }
        .user-message { background: #e3f2fd; }
    </style>
</head>
<body>
    <h1>Real-Time Chat</h1>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Type your message...">
    <button onclick="sendMessage()">Send</button>
    
    <script src="websocket-hypermedia.js"></script>
    <script src="chat.js"></script>
</body>
</html>
```

### Step 2: Chat Logic

```javascript
// chat.js
const ws = new WebSocketHypermedia("ws://localhost:8765");

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        const timestamp = new Date().toLocaleTimeString();
        const messageHtml = `<div class="message user-message">
            <strong>You (${timestamp}):</strong> ${message}
        </div>`;
        
        // Send to server
        ws.send("append|messages|" + messageHtml);
        input.value = '';
    }
}

// Handle Enter key
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
```

### Step 3: Enhanced Server

```javascript
// chat-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8765 });

wss.on('connection', (ws) => {
    console.log('New user joined chat');
    
    // Send welcome message
    const welcomeMsg = `<div class="message">
        <em>New user joined the chat!</em>
    </div>`;
    ws.send("append|messages|" + welcomeMsg);
    
    ws.on('message', (message) => {
        const msg = message.toString();
        
        // Broadcast to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(msg);
            }
        });
    });
});
```

**🚀 You now have a working chat application!** Open multiple browser windows to test it.

## Lesson 3: Dynamic Forms and Validation 📝

**Goal**: Create interactive forms with real-time validation and updates

### Step 1: Registration Form

```html
<!-- form.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Real-Time Registration</title>
    <style>
        .error { color: red; }
        .success { color: green; }
        .field { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>User Registration</h1>
    <form id="registrationForm">
        <div class="field">
            <label>Username:</label>
            <input type="text" id="username" onblur="validateUsername()">
            <span id="username-status"></span>
        </div>
        
        <div class="field">
            <label>Email:</label>
            <input type="email" id="email" onblur="validateEmail()">
            <span id="email-status"></span>
        </div>
        
        <div class="field">
            <label>Password:</label>
            <input type="password" id="password" onblur="validatePassword()">
            <span id="password-status"></span>
        </div>
        
        <button type="submit">Register</button>
    </form>
    
    <div id="form-status"></div>
    
    <script src="websocket-hypermedia.js"></script>
    <script src="form.js"></script>
</body>
</html>
```

### Step 2: Real-Time Validation

```javascript
// form.js
const ws = new WebSocketHypermedia("ws://localhost:8765");

function validateUsername() {
    const username = document.getElementById('username').value;
    ws.send("trigger|username|blur|" + JSON.stringify({username}));
}

function validateEmail() {
    const email = document.getElementById('email').value;
    ws.send("trigger|email|blur|" + JSON.stringify({email}));
}

function validatePassword() {
    const password = document.getElementById('password').value;
    ws.send("trigger|password|blur|" + JSON.stringify({password}));
}

// Handle form submission
document.getElementById('registrationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    ws.send("trigger|registrationForm|submit|" + JSON.stringify(formData));
});
```

### Step 3: Server-Side Validation

```javascript
// form-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8765 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const msg = message.toString();
        const [verb, element, event, data] = msg.split('|');
        
        if (verb === 'trigger') {
            try {
                const eventData = JSON.parse(data);
                
                switch(element) {
                    case 'username':
                        const usernameValid = eventData.username.length >= 3;
                        const usernameMsg = usernameValid ? 
                            '<span class="success">✓ Username available</span>' :
                            '<span class="error">✗ Username too short</span>';
                        ws.send("update|username-status|" + usernameMsg);
                        break;
                        
                    case 'email':
                        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eventData.email);
                        const emailMsg = emailValid ?
                            '<span class="success">✓ Valid email</span>' :
                            '<span class="error">✗ Invalid email format</span>';
                        ws.send("update|email-status|" + emailMsg);
                        break;
                        
                    case 'password':
                        const passwordValid = eventData.password.length >= 8;
                        const passwordMsg = passwordValid ?
                            '<span class="success">✓ Password strong</span>' :
                            '<span class="error">✗ Password too weak</span>';
                        ws.send("update|password-status|" + passwordMsg);
                        break;
                        
                    case 'registrationForm':
                        const successMsg = '<div class="success">Registration successful!</div>';
                        ws.send("update|form-status|" + successMsg);
                        break;
                }
            } catch (e) {
                console.error('Error processing message:', e);
            }
        }
    });
});
```

**🎯 You've built a real-time form with instant validation!**

## Lesson 4: Advanced Features - Dashboard with Animations 📊

**Goal**: Create a sophisticated dashboard with real-time updates, animations, and advanced features

### Step 1: Dashboard HTML

```html
<!-- dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Real-Time Dashboard</title>
    <style>
        .dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        .metric { font-size: 2em; font-weight: bold; }
        .chart { height: 200px; background: #f5f5f5; }
        .notification { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .notification.info { background: #e3f2fd; }
        .notification.warning { background: #fff3e0; }
        .notification.error { background: #ffebee; }
    </style>
</head>
<body>
    <h1>Real-Time Dashboard</h1>
    
    <div class="dashboard">
        <div class="card">
            <h3>Active Users</h3>
            <div id="active-users" class="metric">0</div>
        </div>
        
        <div class="card">
            <h3>Messages Sent</h3>
            <div id="messages-sent" class="metric">0</div>
        </div>
        
        <div class="card">
            <h3>System Status</h3>
            <div id="system-status">Online</div>
        </div>
        
        <div class="card">
            <h3>Recent Activity</h3>
            <div id="activity-log"></div>
        </div>
    </div>
    
    <div id="notifications"></div>
    
    <script src="websocket-hypermedia.js"></script>
    <script src="dashboard.js"></script>
</body>
</html>
```

### Step 2: Dashboard JavaScript

```javascript
// dashboard.js
const ws = new WebSocketHypermedia("ws://localhost:8765", {
    autoReconnect: true,
    reconnectDelay: 2000,
    onConnect: () => {
        console.log('Dashboard connected!');
        ws.send("trigger|dashboard|connected");
    },
    onDisconnect: () => {
        ws.send("update|system-status|Offline");
        ws.send("addClass|system-status|error");
    }
});

// Simulate periodic updates
setInterval(() => {
    ws.send("trigger|dashboard|heartbeat");
}, 5000);

// Handle notifications
function showNotification(message, type = 'info') {
    const notification = `<div class="notification ${type}">${message}</div>`;
    ws.send("prepend|notifications|" + notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        ws.send("remove|notifications|");
    }, 5000);
}
```

### Step 3: Advanced Server

```javascript
// dashboard-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8765 });

let activeUsers = 0;
let messagesSent = 0;

wss.on('connection', (ws) => {
    activeUsers++;
    console.log(`User connected. Total: ${activeUsers}`);
    
    // Update dashboard for all clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send("update|active-users|" + activeUsers);
            client.send("animate|active-users|fadeIn|0.5s|ease");
        }
    });
    
    ws.on('message', (message) => {
        const msg = message.toString();
        const [verb, element, event, data] = msg.split('|');
        
        if (verb === 'trigger') {
            switch(element) {
                case 'dashboard':
                    if (event === 'connected') {
                        // Send initial data
                        ws.send("update|active-users|" + activeUsers);
                        ws.send("update|messages-sent|" + messagesSent);
                        ws.send("update|system-status|Online");
                        ws.send("addClass|system-status|success");
                        
                        // Add to activity log
                        const activity = `<div>Dashboard connected at ${new Date().toLocaleTimeString()}</div>`;
                        ws.send("prepend|activity-log|" + activity);
                    } else if (event === 'heartbeat') {
                        messagesSent++;
                        ws.send("update|messages-sent|" + messagesSent);
                        ws.send("animate|messages-sent|pulse|0.3s|ease");
                    }
                    break;
            }
        }
    });
    
    ws.on('close', () => {
        activeUsers--;
        console.log(`User disconnected. Total: ${activeUsers}`);
        
        // Update all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send("update|active-users|" + activeUsers);
                client.send("animate|active-users|fadeOut|0.5s|ease");
            }
        });
    });
});

// Simulate system events
setInterval(() => {
    const events = [
        'System backup completed',
        'New user registration',
        'Database optimization',
        'Cache cleared'
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const activity = `<div>${randomEvent} at ${new Date().toLocaleTimeString()}</div>`;
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send("prepend|activity-log|" + activity);
        }
    });
}, 10000);
```

## 🎓 Congratulations! You're a WebSocket Hypermedia Hero!

You've now built:
- ✅ Real-time counter application
- ✅ Multi-user chat system
- ✅ Interactive forms with validation
- ✅ Sophisticated dashboard with animations

### Next Steps

1. **Explore the Examples**: Check out the `examples/` folder for more advanced use cases
2. **Read the Guides**: Learn about specific implementation patterns in `guides.md`
3. **Study the Reference**: Master every API detail in `reference.md`
4. **Understand Concepts**: Deep dive into hypermedia philosophy in `concepts.md`

### Tips for Success

- **Start Simple**: Begin with basic `update` actions before diving into complex features
- **Test Thoroughly**: Always test with multiple browser windows/tabs
- **Handle Errors**: Implement proper error handling and reconnection logic
- **Security First**: Remember to sanitize HTML and validate data on the server side

Happy coding! 🚀 