#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Building frontend with explicit path to vite..."
# Use the local vite from node_modules
./node_modules/.bin/vite build

echo "Installing backend dependencies..."
cd ../backend
npm install

echo "Setup complete!"