#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Building frontend with npm..."
# Use npm to run the vite command through package.json
NODE_ENV=production npm run build

echo "Installing backend dependencies..."
cd ../backend
npm install

echo "Setup complete!"