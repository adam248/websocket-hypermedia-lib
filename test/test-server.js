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
        
        // Parse action with potential options
        const parts = action.split('|');
        const verb = parts[0];
        const noun = parts[1] || '';
        const subject = parts[2] || '';
        const options = parts.slice(3);
        
        // Handle different actions
        switch (verb) {
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
                
            case 'special_update':
                // Demonstrate options passing
                const priority = options.includes('priority-high') ? 'high' : 'normal';
                const code = options.find(param => param.startsWith('code-'))?.substring(5) || 'default';
                ws.send(`update|${noun}|<p class="${code}">Special update with ${priority} priority!</p>|processed|${priority}|${code}`);
                break;
                
            case 'test_escape':
                // Test escape character functionality
                const contentWithPipes = '<p>Hello World | & Good Morning New York!</p>';
                ws.send(`update|content|~${contentWithPipes}~`);
                break;
                
            case 'test_custom_escape':
                // Test custom escape character (caret)
                const logContent = '<span>Error: File not found | Path: /usr/local/bin</span>';
                ws.send(`append|messages|^${logContent}^`);
                break;
                
            case 'form_submit':
                // Handle form submission with validation
                if (options.includes('validate')) {
                    ws.send('update|form-data|<p>Form submitted successfully</p>|validated|success');
                } else {
                    ws.send('update|form-data|<p>Form submitted</p>');
                }
                break;
                
            default:
                if (verb.startsWith('echo:')) {
                    const text = verb.substring(5);
                    ws.send(`append|messages|<p>Echo: ${text}</p>`);
                } else {
                    // Echo back the action with options for demonstration
                    const optionsStr = options.length > 0 ? '|' + options.join('|') : '';
                    ws.send(`update|status|<p>Unknown action: ${verb}${optionsStr}</p>|received|${verb}${optionsStr}`);
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
console.log('Options passing demo: special_update|breaking-news|content|priority-high|code-black');
console.log('Escape character tests: test_escape, test_custom_escape'); 