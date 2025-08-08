# WebSocket Hypermedia Test

A simple test setup to verify the WebSocket Hypermedia library works correctly.

## Quick Start

### Option 1: Using Nix (Recommended)

If you have Nix installed, this is the easiest way:

```bash
cd test
nix-shell
```

This will automatically:
- Set up a Node.js 20 environment
- Install dependencies
- Start the test server

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the test server:**
   ```bash
   npm start
   ```
   or
   ```bash
   node test-server.js
   ```

3. **Open the test client:**
   Open `test-client.html` in your web browser
   
   **Note:** Make sure you're running the server from the `test/` directory, or the client won't be able to find the WebSocket Hypermedia library.

## What to Test

The test demonstrates all the core WebSocket Hypermedia actions:

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

- `run-test` - Start the WebSocket server and run tests
- `npm install` - Install dependencies
- `npm start` - Start the server manually

## Troubleshooting

- Make sure the server is running on port 8765
- Check browser console for any JavaScript errors
- Verify the WebSocket connection in browser dev tools
- Ensure `websocket-hypermedia.js` is in the parent directory (../websocket-hypermedia.js)
- If using Nix, make sure you're in the nix-shell environment 