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

### Test Structure

The test suite is organized into modular test files:

- **`core-tests.js`** - Basic WebSocket functionality
- **`edge-case-tests.js`** - Unusual scenarios and robustness
- **`escape-tests.js`** - Content escaping and parsing
- **`click-to-send-tests.js`** - Element interaction feature
- **`unified-test-runner.js`** - Main test runner that executes all modules

### Running Specific Test Modules

You can run individual test modules by modifying the `unified-test-runner.js` file or by creating custom test runners.

## What Gets Tested

The automated test suite covers all the core WebSocket Hypermedia functionality:

### **Core Functionality** (3 tests)
- **WebSocket Connection** - Basic connection establishment
- **Options Passing** - Extra parameter handling (`verb|noun|subject|options`)
- **Standard Actions** - `get_time`, `add_message`, `clear_messages`
- **Server Communication** - Bidirectional message passing
- **Error Handling** - Connection errors and timeouts
- **Cleanup** - Automatic server shutdown

### **Edge Cases & Hypermedia Patterns** (9 tests)
- **Empty Content** - Handling empty HTML content gracefully
- **Large Content** - Processing large HTML payloads efficiently
- **Special Characters** - Unicode, HTML entities, and special chars
- **Nested HTML** - Complex HTML structures and DOM manipulation
- **Form Submission** - Form data handling and validation
- **Invalid Element ID** - Graceful handling of missing elements
- **Malformed Messages** - Robust parsing of invalid message formats
- **Rapid Fire Messages** - High-frequency message handling
- **Connection Recovery** - Reconnection and state recovery

### **Escape Character Tests** (4 tests)
- **Default Escape Character** - Basic tilde (~) escaping
- **Custom Escape Character** - Configurable escape characters
- **Escape with Pipes** - Content containing pipe characters
- **Helper Methods** - sendEscaped() convenience methods

### **Click-to-Send Feature** (7 tests)
- **Basic Connection** - Auto-initialization and connection establishment
- **Click-to-Send Disabled** - Default state verification
- **Enable Click-to-Send** - Dynamic feature enabling
- **Custom Click Verb** - Configurable click action verbs
- **Element Click Detection** - Proper element targeting
- **Interactive Element Skipping** - Form element handling
- **HTML Content Escaping** - Content safety and escaping

### **Data-URL Auto-Initialization** (7 tests)
- **Basic Data-URL Initialization** - Primary showcased feature testing
- **Data-URL with Custom Config** - Hybrid auto/manual configuration
- **Data-URL with Message Handlers** - Adding handlers to auto-initialized instance
- **Data-URL with Interactive Elements** - Complete interactive workflow
- **Data-URL Error Handling** - Graceful error handling with invalid URLs
- **Data-URL Multiple Script Tags** - Proper handling of duplicate script tags
- **Data-URL Different Formats** - URL format parsing and validation

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

### **Click-to-Send Testing**
- **Enable Click-to-Send** - Enable the click-to-send feature
- **Disable Click-to-Send** - Disable the click-to-send feature
- **Test Custom Click Verb** - Test with custom click verb
- **Test Server Click Handling** - Test server-side click handling
- **Click Test Elements** - Click on paragraph, div, span elements to test
- **Interactive Elements** - Verify buttons and links don't trigger click-to-send
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