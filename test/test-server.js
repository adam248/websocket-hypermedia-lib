const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8765 });

console.log('WebSocket server running on ws://localhost:8765');

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);
    
    // Send initial content
    ws.send('update|content|<h2>Welcome to WebSocket Hypermedia!</h2><p>Server is ready.</p>');
    
    ws.on('message', (message) => {
        const action = message.toString();
        console.log('Received:', action);
        
        // Handle different actions
        switch (action) {
            case 'ping':
                ws.send('update|status|<p>Pong! Server is alive.</p>');
                break;
                
            case 'get_time':
                const time = new Date().toLocaleTimeString();
                ws.send(`update|time|<p>Current time: ${time}</p>`);
                break;
                
            case 'add_message':
                ws.send('append|messages|<p>New message added!</p>');
                break;
                
            case 'clear_messages':
                ws.send('update|messages|<p>Messages cleared.</p>');
                break;
                
            case 'remove_status':
                ws.send('remove|status|');
                break;
                
            default:
                if (action.startsWith('echo:')) {
                    const text = action.substring(5);
                    ws.send(`append|messages|<p>Echo: ${text}</p>`);
                } else {
                    ws.send(`update|status|<p>Unknown action: ${action}</p>`);
                }
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('Test server ready!');
console.log('Available actions: ping, get_time, add_message, clear_messages, remove_status, echo:text'); 