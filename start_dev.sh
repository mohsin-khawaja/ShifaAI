#!/bin/bash

# ShifaAI Development Startup Script (Node.js + React)
echo "🚀 Starting ShifaAI Development Environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one based on sample_env"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

# Start the unified development environment
echo "🎯 Starting both Node.js backend and React frontend..."
echo "📊 Backend API: http://localhost:8000/api"
echo "🎨 Frontend App: http://localhost:3000"
echo "🔧 Press Ctrl+C to stop both servers"
echo ""

# Run the development command
npm run dev 