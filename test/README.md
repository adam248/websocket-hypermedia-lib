# WebSocket Hypermedia Test

A simple test setup to verify the WebSocket Hypermedia library works correctly.

## Quick Start

### Option 1: Automated Testing (Recommended)

Run all tests with a single command:

```bash
cd test
nix-shell --run "test"
```

Or with npm:
```bash
cd test
npm test
```

This will:
- Set up the environment automatically
- Start the WebSocket server
- Run comprehensive automated tests
- Show clear pass/fail results
- Clean up automatically

### Option 2: Manual Testing

If you want to test manually in a browser:

```bash
cd test
nix-shell --run "run-test"
```

Then open `test-client.html` in your web browser.

### Option 3: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run automated tests:**
   ```bash
   npm test
   ```

3. **Or start the test server manually:**
   ```bash
   npm start
   ```

## What Gets Tested

The automated test suite covers all the core WebSocket Hypermedia functionality:

### **Core Functionality**
- **WebSocket Connection** - Basic connection establishment
- **Options Passing** - Extra parameter handling (`verb|noun|subject|options`)
- **Standard Actions** - `get_time`, `add_message`, `clear_messages`
- **Server Communication** - Bidirectional message passing
- **Error Handling** - Connection errors and timeouts
- **Cleanup** - Automatic server shutdown

### **Edge Cases & Hypermedia Patterns**
- **Empty Content** - Handling empty HTML content gracefully
- **Large Content** - Processing large HTML payloads efficiently
- **Special Characters** - Unicode, HTML entities, and special chars
- **Nested HTML** - Complex HTML structures and DOM manipulation
- **Form Submission** - Form data handling and validation
- **Concurrent Updates** - Multiple simultaneous message processing
- **Invalid Element ID** - Graceful handling of missing elements
- **Malformed Messages** - Robust parsing of invalid message formats
- **Rapid Fire Messages** - High-frequency message handling
- **Connection Recovery** - Reconnection and state recovery

## Manual Testing

If you want to test manually in a browser, the test demonstrates:

- **update** - Replace content in elements
- **append** - Add content to the end of elements  
- **remove** - Remove elements from the DOM
- **Connection management** - Connect/disconnect handling
- **Error handling** - Connection errors and reconnection

## Test Actions

Click the buttons to test different functionality:

- **Ping Server** - Tests basic communication
- **Get Current Time** - Tests dynamic content updates
- **Add Message** - Tests append functionality
- **Clear Messages** - Tests update functionality
- **Remove Status** - Tests remove functionality
- **Send Echo** - Tests custom action handling
- **Connect/Disconnect** - Tests connection management

## Expected Behavior

1. When you open the page, it should connect automatically
2. The content area should show "Welcome to WebSocket Hypermedia!"
3. Clicking buttons should trigger real-time updates
4. The connection status should show "Connected" when working
5. You can disconnect and reconnect to test reconnection

## Nix Environment

The `shell.nix` file provides a reproducible development environment with:

- **Node.js 20** - Latest LTS version
- **npm** - Package manager
- **run-test** - Custom command to start the test server
- **Auto-run** - Automatically starts the test on fresh environments

### Available Commands in Nix Shell

- `test` - Run automated test suite (recommended)
- `run-test` - Start the WebSocket server for manual testing
- `npm install` - Install dependencies
- `npm start` - Start the server manually
- `npm test` - Run automated test suite

## Troubleshooting

- Make sure the server is running on port 8765
- Check browser console for any JavaScript errors
- Verify the WebSocket connection in browser dev tools
- Ensure `websocket-hypermedia.js` is in the parent directory (../websocket-hypermedia.js)
- **Repository**: [https://github.com/adam248/websocket-hypermedia-lib](https://github.com/adam248/websocket-hypermedia-lib)
- If using Nix, make sure you're in the nix-shell environment 