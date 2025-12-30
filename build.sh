#!/bin/bash

# Build script for P2P Chatter Lite (macOS/Linux)

echo "========================================"
echo "P2P Chatter Lite - Build Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

echo "[1/4] Checking dependencies..."
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

echo "[2/4] Installing Node modules..."
npm install || { echo "Error: Failed to install dependencies"; exit 1; }

echo "[3/4] Building Electron application..."
npm run build || { echo "Error: Failed to build application"; exit 1; }

echo "[4/4] Build complete!"
echo ""
echo "Output files:"
echo "- Built in: dist/"
echo ""
