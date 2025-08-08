#!/bin/bash

# WebSocket Hypermedia Test Runner
# Run this from the project root to execute all tests

echo "🧪 Running WebSocket Hypermedia Tests..."
echo "========================================"

cd test
nix-shell --run "npm test"

# Exit with the same code as the test
exit $? 