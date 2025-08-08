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
  
  # Create an automated test runner script
  autoTestRunner = pkgs.writeShellScriptBin "test" ''
    echo "Running automated WebSocket Hypermedia tests..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
      echo "Installing dependencies..."
      ${npm}/bin/npm install
    fi
    
    # Run the automated test suite
    ${nodejs}/bin/node run-tests.js
  '';
  
in pkgs.mkShell {
  buildInputs = [
    nodejs
    npm
    testRunner
    autoTestRunner
  ];
  
  shellHook = ''
    echo "WebSocket Hypermedia Test Environment"
    echo "====================================="
    echo ""
    echo "Available commands:"
    echo "  test        - Run automated test suite (recommended)"
    echo "  run-test    - Start the WebSocket server for manual testing"
    echo "  npm install - Install dependencies"
    echo "  npm start   - Start the server"
    echo "  npm test    - Run automated test suite"
    echo ""
    echo "For quick testing, type: test"
    echo ""
    
    # Auto-run the automated test if this is a fresh environment
    if [ ! -d "node_modules" ]; then
      echo "Fresh environment detected. Running automated tests..."
      test
    fi
  '';
} 