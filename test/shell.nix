{ pkgs ? import <nixpkgs> {} }:

let
  nodejs = pkgs.nodejs_20;
  npm = pkgs.nodePackages.npm;
  
  # Create a simple test runner script
  testRunner = pkgs.writeShellScriptBin "run-test" ''
    echo "Setting up WebSocket Hypermedia test environment..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
      echo "Installing dependencies..."
      ${npm}/bin/npm install
    fi
    
    echo "Starting WebSocket server..."
    echo "Server will be available at: ws://localhost:8765"
    echo "Open test-client.html in your browser to test"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Start the server
    ${nodejs}/bin/node test-server.js
  '';
  
in pkgs.mkShell {
  buildInputs = [
    nodejs
    npm
    testRunner
  ];
  
  shellHook = ''
    echo "WebSocket Hypermedia Test Environment"
    echo "====================================="
    echo ""
    echo "Available commands:"
    echo "  run-test    - Start the WebSocket server and run tests"
    echo "  npm install - Install dependencies"
    echo "  npm start   - Start the server"
    echo ""
    echo "To automatically run the test, type: run-test"
    echo ""
    
    # Auto-run the test if this is a fresh environment
    if [ ! -d "node_modules" ]; then
      echo "Fresh environment detected. Running test automatically..."
      run-test
    fi
  '';
} 