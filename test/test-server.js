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
        
        // Performance test handlers
        if (verb === 'performance_test') {
            ws.send('update|content|<p>Performance test message processed</p>');
            return;
        }
        
        if (verb === 'concurrent_test') {
            ws.send(`update|content|<p>Concurrent test: ${noun} processed</p>`);
            return;
        }
        
        if (verb === 'memory_test') {
            ws.send('update|content|<p>Memory test message processed</p>');
            return;
        }
        
        if (verb === 'latency_test') {
            ws.send('update|content|<p>Latency test response</p>');
            return;
        }
        
        if (verb === 'stress_test') {
            ws.send('update|content|<p>Stress test message processed</p>');
            return;
        }
        
        // Use case test handlers
        if (verb === 'chat_message') {
            ws.send('append|messages|<p>Chat message received and processed</p>');
            return;
        }
        
        if (verb === 'dashboard_update') {
            ws.send('update|stats|<p>Dashboard updated with real-time data</p>');
            return;
        }
        
        if (verb === 'news_update') {
            ws.send('prepend|feed|<p>News feed updated with latest content</p>');
            return;
        }
        
        if (verb === 'collaborative_edit') {
            ws.send('update|document|<p>Collaborative edit applied successfully</p>');
            return;
        }
        
        if (verb === 'inventory_update') {
            ws.send('update|product-123|<p>Inventory updated in real-time</p>');
            return;
        }
        
        if (verb === 'game_update') {
            ws.send('update|game-state|<p>Game state synchronized</p>');
            return;
        }
        
        if (verb === 'analytics_update') {
            ws.send('update|metrics|<p>Analytics data refreshed</p>');
            return;
        }
        
        if (verb === 'form_validation') {
            ws.send('update|username|<p>Form validation completed</p>');
            return;
        }
        
        // Advanced protocol test handlers
        if (verb === 'swap') {
            ws.send('update|form|<p>Swap action processed</p>');
            return;
        }
        
        if (verb === 'before') {
            ws.send('before|content|<p>Before action processed</p>');
            return;
        }
        
        if (verb === 'after') {
            ws.send('after|content|<p>After action processed</p>');
            return;
        }
        
        if (verb === 'highlight') {
            ws.send('update|content|<p>Custom verb highlight processed</p>');
            return;
        }
        
        if (verb === 'conditional_update') {
            ws.send('conditional_update|status|<p>Conditional update processed</p>');
            return;
        }
        
        if (verb === 'state_update') {
            ws.send('state_update|form|<p>State update processed</p>');
            return;
        }
        
        // Reconnection test handlers
        if (verb === 'test_reconnection_strategy') {
            ws.send('update|content|<p>Exponential backoff reconnection strategy tested</p>');
            return;
        }
        
        if (verb === 'test_max_reconnection_attempts') {
            ws.send('update|content|<p>Maximum reconnection attempts handling tested</p>');
            return;
        }
        
        if (verb === 'test_connection_recovery') {
            ws.send('update|content|<p>Connection recovery mechanism tested</p>');
            return;
        }
        
        if (verb === 'test_manual_reconnection') {
            ws.send('update|content|<p>Manual reconnection capability tested</p>');
            return;
        }
        
        if (verb === 'test_reconnection_delay_config') {
            ws.send('update|content|<p>Reconnection delay configuration tested</p>');
            return;
        }
        
        if (verb === 'test_reconnection_events') {
            ws.send('update|content|<p>Reconnection event callbacks tested</p>');
            return;
        }
        
        if (verb === 'test_network_interruption') {
            ws.send('update|content|<p>Network interruption recovery tested</p>');
            return;
        }
        
        if (verb === 'test_reconnection_state') {
            ws.send('update|content|<p>Reconnection state management tested</p>');
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
                } else if (noun === 'breaking-news' && options.includes('priority-high') && options.includes('code-black')) {
                    // Handle complex options passing test
                    ws.send(`update|${noun}|<p class="code-black">Breaking news with high priority!</p>|priority-high|code-black|user-id-123|timestamp-1234567890`);
                } else {
                    ws.send(`update|${noun}|<p>Updated content</p>`);
                }
                break;
                
            case 'addClass':
                // Handle CSS class addition
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`addClass|${noun}|${subject}`);
                }
                break;
                
            case 'removeClass':
                // Handle CSS class removal
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`removeClass|${noun}|${subject}`);
                }
                break;
                
            case 'toggleClass':
                // Handle CSS class toggling
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`toggleClass|${noun}|${subject}`);
                }
                break;
                
            case 'setAttr':
                // Handle attribute setting
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const attrName = subject;
                    const value = options[0] || '';
                    ws.send(`setAttr|${noun}|${attrName}|${value}`);
                }
                break;
                
            case 'removeAttr':
                // Handle attribute removal
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`removeAttr|${noun}|${subject}`);
                }
                break;
                
            case 'setStyle':
                // Handle style setting
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const property = subject;
                    const value = options[0] || '';
                    ws.send(`setStyle|${noun}|${property}|${value}`);
                }
                break;
                
            case 'removeStyle':
                // Handle style removal
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`removeStyle|${noun}|${subject}`);
                }
                break;
                
            case 'trigger':
                // Handle event triggering
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const eventType = subject;
                    const eventData = options[0] || '';
                    ws.send(`trigger|${noun}|${eventType}|${eventData}`);
                }
                break;
                
            case 'setValue':
                // Handle form value setting
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const value = subject;
                    ws.send(`setValue|${noun}|${value}`);
                }
                break;
                
            case 'setChecked':
                // Handle checkbox/radio checked state
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const checked = subject;
                    ws.send(`setChecked|${noun}|${checked}`);
                }
                break;
                
            case 'setSelected':
                // Handle select option selection
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const value = subject;
                    ws.send(`setSelected|${noun}|${value}`);
                }
                break;
                
            case 'animate':
                // Handle animation
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const animationName = subject;
                    const duration = options[0] || '1s';
                    const easing = options[1] || 'ease';
                    const delay = options[2] || '0s';
                    const iterations = options[3] || '1';
                    const direction = options[4] || 'normal';
                    const fillMode = options[5] || 'none';
                    ws.send(`animate|${noun}|${animationName}|${duration}|${easing}|${delay}|${iterations}|${direction}|${fillMode}`);
                }
                break;
                
            case 'transition':
                // Handle CSS transition
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const properties = subject;
                    const duration = options[0] || '0.3s';
                    const easing = options[1] || 'ease';
                    ws.send(`transition|${noun}|${properties}|${duration}|${easing}`);
                }
                break;
                
            case 'removeAnimation':
                // Handle animation removal
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`removeAnimation|${noun}`);
                }
                break;
                
            case 'pauseAnimation':
                // Handle animation pause
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`pauseAnimation|${noun}`);
                }
                break;
                
            case 'resumeAnimation':
                // Handle animation resume
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`resumeAnimation|${noun}`);
                }
                break;
                
            case 'getAnimationState':
                // Handle animation state query
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    ws.send(`animationState|${noun}|{"name": "test", "playState": "running", "currentTime": 0}`);
                }
                break;
                
            case 'keyframe':
                // Handle keyframe animation
                if (noun === 'non-existent-element') {
                    ws.send('update|status|<p>Element not found</p>');
                } else if (noun === 'invalid@id') {
                    ws.send('update|status|<p>Invalid element ID</p>');
                } else {
                    const animationName = subject;
                    const keyframes = options[0] || '{}';
                    const duration = options[1] || '1s';
                    ws.send(`keyframe|${noun}|${animationName}|${keyframes}|${duration}`);
                }
                break;
                
            case 'button_clicked':
                // Handle button click demo
                ws.send('addClass|demo-button|active highlight');
                setTimeout(() => {
                    ws.send('removeClass|demo-button|active highlight');
                }, 2000);
                break;
                
            case 'toggle_sidebar':
                // Handle sidebar toggle demo
                ws.send('toggleClass|sidebar|collapsed');
                break;
                
            case 'validate_form':
                // Handle form validation demo
                ws.send('setValue|username|valid_username');
                ws.send('setValue|email|valid@email.com');
                ws.send('setChecked|newsletter|true');
                break;
                
            case 'process_form':
                // Handle form processing demo
                ws.send('setAttr|submit-btn|disabled|true');
                ws.send('setAttr|submit-btn|data-processing|true');
                setTimeout(() => {
                    ws.send('removeAttr|submit-btn|disabled');
                    ws.send('removeAttr|submit-btn|data-processing');
                }, 3000);
                break;
                
            case 'reset_form':
                // Handle form reset demo
                console.log('Handling reset_form request');
                ws.send('setValue|username|');
                ws.send('setValue|email|');
                ws.send('setChecked|newsletter|false');
                console.log('Sent reset_form responses');
                break;
                
            case 'toggle_modal':
                // Handle modal toggle demo
                ws.send('setAttr|modal|aria-hidden|false');
                break;
                
            case 'close_modal':
                // Handle modal close demo
                ws.send('setAttr|modal|aria-hidden|true');
                break;
                
            case 'toggle_expansion':
                // Handle expansion toggle demo
                ws.send('setAttr|expand-button|aria-expanded|true');
                break;
                
            case 'set_user_online':
                // Handle user online demo
                ws.send('setAttr|user-card|data-status|online');
                break;
                
            case 'set_user_offline':
                // Handle user offline demo
                ws.send('setAttr|user-card|data-status|offline');
                break;
                
            case 'update_last_active':
                // Handle last active update demo
                const now = new Date().toLocaleTimeString();
                ws.send(`setAttr|user-card|data-last-active|${now}`);
                break;
                
            case 'show_notification':
                // Handle notification demo
                const type = subject;
                const html = `<div class="notification" data-type="${type}">This is a ${type} notification!</div>`;
                ws.send(`notification|notifications|${html}`);
                break;
                
            case 'change_color':
                // Handle color change demo
                const color = subject;
                ws.send(`setStyle|color-demo|background-color|${color}`);
                break;
                
            case 'reset_color':
                // Handle color reset demo
                ws.send('removeStyle|color-demo|background-color');
                break;
                
            case 'random_color':
                // Handle random color demo
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                ws.send(`setStyle|color-demo|background-color|${randomColor}`);
                break;
                
            case 'gradient_background':
                // Handle gradient background demo
                ws.send('setStyle|color-demo|background|linear-gradient(45deg, #ff6b6b, #4ecdc4)');
                break;
                
            case 'start_animation':
                // Handle animation start demo
                ws.send('setStyle|animated-box|animation|pulse 2s infinite');
                break;
                
            case 'pause_animation':
                // Handle animation pause demo
                ws.send('setStyle|animated-box|animation-play-state|paused');
                break;
                
            case 'stop_animation':
                // Handle animation stop demo
                ws.send('removeStyle|animated-box|animation');
                break;
                
            case 'change_animation':
                // Handle animation change demo
                ws.send('setStyle|animated-box|animation|bounce 1s infinite');
                break;
                
            case 'set_mobile_size':
                // Handle mobile size demo
                ws.send('setStyle|responsive-container|max-width|480px');
                break;
                
            case 'set_tablet_size':
                // Handle tablet size demo
                ws.send('setStyle|responsive-container|max-width|768px');
                break;
                
            case 'set_desktop_size':
                // Handle desktop size demo
                ws.send('setStyle|responsive-container|max-width|1200px');
                break;
                
            case 'set_full_width':
                // Handle full width demo
                ws.send('removeStyle|responsive-container|max-width');
                break;
                
            case 'change_font':
                // Handle font change demo
                ws.send('setStyle|typography-demo|font-family|Georgia, serif');
                break;
                
            case 'change_size':
                // Handle size change demo
                ws.send('setStyle|typography-demo|font-size|24px');
                break;
                
            case 'change_spacing':
                // Handle spacing change demo
                ws.send('setStyle|typography-demo|letter-spacing|2px');
                break;
                
            case 'reset_typography':
                // Handle typography reset demo
                ws.send('removeStyle|typography-demo|font-family');
                ws.send('removeStyle|typography-demo|font-size');
                ws.send('removeStyle|typography-demo|letter-spacing');
                break;
                
            case 'set_primary_color':
                // Handle primary color demo
                ws.send('setStyle|css-vars-demo|--primary-color|#007bff');
                break;
                
            case 'set_secondary_color':
                // Handle secondary color demo
                ws.send('setStyle|css-vars-demo|--secondary-color|#6c757d');
                break;
                
            case 'set_spacing':
                // Handle spacing demo
                ws.send('setStyle|css-vars-demo|--spacing|2rem');
                break;
                
            case 'reset_css_vars':
                // Handle CSS vars reset demo
                ws.send('removeStyle|css-vars-demo|--primary-color');
                ws.send('removeStyle|css-vars-demo|--secondary-color');
                ws.send('removeStyle|css-vars-demo|--spacing');
                break;
                
            case 'trigger_click':
                // Handle click trigger demo
                ws.send('trigger|demo-button|click');
                break;
                
            case 'trigger_focus':
                // Handle focus trigger demo
                ws.send('trigger|demo-input|focus');
                break;
                
            case 'trigger_blur':
                // Handle blur trigger demo
                ws.send('trigger|demo-input|blur');
                break;
                
            case 'trigger_input':
                // Handle input trigger demo
                ws.send('trigger|demo-input|input');
                break;
                
            case 'trigger_change':
                // Handle change trigger demo
                ws.send('trigger|demo-select|change');
                break;
                

                
            case 'trigger_save':
                // Handle save trigger demo
                ws.send('trigger|document|keydown|{"key": "s", "ctrlKey": true}');
                break;
                
            case 'trigger_undo':
                // Handle undo trigger demo
                ws.send('trigger|document|keydown|{"key": "z", "ctrlKey": true}');
                break;
                
            case 'trigger_escape':
                // Handle escape trigger demo
                ws.send('trigger|document|keydown|{"key": "Escape"}');
                break;
                
            case 'trigger_enter':
                // Handle enter trigger demo
                ws.send('trigger|demo-form|keydown|{"key": "Enter"}');
                break;
                
            case 'trigger_custom':
                // Handle custom event trigger demo
                ws.send('trigger|custom-event-target|custom-event');
                break;
                
            case 'trigger_data':
                // Handle data event trigger demo
                ws.send('trigger|custom-event-target|custom-event|{"detail": {"action": "save", "id": 123}}');
                break;
                
            case 'trigger_complex':
                // Handle complex event trigger demo
                ws.send('trigger|custom-event-target|custom-event|{"detail": {"user": {"id": 456, "name": "John"}, "action": "update"}}');
                break;
                
            case 'trigger_multiple':
                // Handle multiple events trigger demo
                ws.send('trigger|demo-button|click');
                setTimeout(() => {
                    ws.send('trigger|demo-button|focus');
                }, 100);
                setTimeout(() => {
                    ws.send('trigger|demo-button|blur');
                }, 200);
                break;
                
            case 'auto_fill_form':
                // Handle form auto-fill demo
                ws.send('setValue|username|john_doe');
                setTimeout(() => {
                    ws.send('setValue|email|john@example.com');
                }, 100);
                setTimeout(() => {
                    ws.send('setSelected|country|us');
                }, 200);
                break;
                
            case 'validate_form':
                // Handle form validation demo
                ws.send('setValue|username|valid_username');
                ws.send('setValue|email|valid@email.com');
                ws.send('setChecked|newsletter|true');
                break;
                
            case 'sequence_animation':
                // Handle animation sequence demo
                ws.send('animate|test-element|fadeIn|1s');
                setTimeout(() => {
                    ws.send('animate|test-element|slideIn|1s');
                }, 100);
                break;
                
            case 'performance_animation':
                // Handle animation performance demo
                ws.send('animate|test-element|performance|0.1s');
                break;
                
            case 'cleanup_animation':
                // Handle animation cleanup demo
                ws.send('removeAnimation|test-element');
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