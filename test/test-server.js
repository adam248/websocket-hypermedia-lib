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
        
        // Handle edge case tests
        if (verb === 'update' && subject === '') {
            ws.send('update|content|<p>Empty content handled</p>');
            return;
        }
        
        if (verb === 'update' && subject.includes('Large content test')) {
            ws.send('update|content|<p>Large content processed</p>');
            return;
        }
        
        if (verb === 'update' && subject.includes('Unicode: 你好世界')) {
            ws.send('update|content|<p>Special characters handled</p>');
            return;
        }
        
        if (verb === 'update' && subject.includes('container')) {
            ws.send('update|content|<p>Nested HTML processed</p>');
            return;
        }
        
        if (verb === 'update' && subject.includes('Content with | pipes | and special characters')) {
            ws.send('update|content|<p>Content with | pipes | and special characters</p>');
            return;
        }
        
        if (verb === 'concurrent_update') {
            ws.send(`update|content|<p>Concurrent update ${noun} processed</p>`);
            return;
        }
        
        if (verb === 'rapid_fire') {
            ws.send('update|content|<p>Rapid fire message processed</p>');
            return;
        }
        
        if (verb === 'test_connection_recovery') {
            ws.send('update|content|<p>Connection recovery tested</p>');
            return;
        }
        
        if (verb === 'test_helper_methods') {
            ws.send('update|content|<p>Helper methods tested</p>');
            return;
        }
        
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
                
            case 'test_click_to_send':
                // Test click-to-send functionality
                ws.send('update|click-results|<p>Server received click-to-send test request</p>');
                break;
                
            case 'element_clicked':
                // Handle click-to-send messages
                console.log(`Element clicked: ${noun} - HTML: ${subject}`);
                ws.send(`click_response|click-results|<p>Server received click on element: ${noun}</p>|clicked|${noun}`);
                break;
                
            case 'user_clicked':
                // Handle custom click verb
                console.log(`User clicked: ${noun} - HTML: ${subject}`);
                ws.send(`click_response|click-results|<p>Server received user click on: ${noun}</p>|user_clicked|${noun}`);
                break;
                
            case 'enable_click_to_send':
                // Test enabling click-to-send
                ws.send('update|click-results|<p>Click-to-send enabled</p>');
                break;
                
            case 'test_interactive_elements':
                // Test interactive element detection
                ws.send('update|click-results|<p>Interactive elements test completed</p>');
                break;
                
            case 'malformed':
                // Handle malformed message test
                ws.send('update|content|<p>Malformed message handled</p>');
                break;
                
            case 'update':
                // Handle update action with special cases
                if (noun === 'non_existent_element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else {
                    ws.send(`update|${noun}|<p>Updated content</p>`);
                }
                break;
                
            case 'form_submit':
                // Handle form submission with validation
                if (options.includes('validate')) {
                    ws.send('update|form-data|<p>Form submitted successfully</p>|validated|success');
                } else {
                    ws.send('update|form-data|<p>Form submitted</p>');
                }
                break;
                
            case 'refresh':
                // Handle refresh action for data-url tests
                ws.send('update|content|<p>Page refreshed</p>');
                break;
                
            case 'test_handler':
                // Handle test handler for data-url tests
                ws.send('update|content|<p>Test handler executed</p>');
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