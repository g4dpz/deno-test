#!/bin/bash

# Test runner script that starts the server and runs tests

echo "🚀 Starting Deno application..."
deno task start &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server is running
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Server is running"
    
    # Run tests
    echo "🧪 Running tests..."
    deno task test
    TEST_EXIT_CODE=$?
    
    # Stop server
    echo "🛑 Stopping server..."
    kill $SERVER_PID
    
    # Exit with test exit code
    exit $TEST_EXIT_CODE
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
