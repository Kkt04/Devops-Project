#!/bin/bash
set -e

echo "🌿 ArtisanHub — Development Setup"
echo "=================================="

if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi

NODE_VER=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js 18+ required (found $(node -v))"
  exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"

if [ -d "server" ]; then
  echo ""
  echo "📦 Setting up server..."
  cd server
  if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
    npm install
  else
    echo "   node_modules up to date"
  fi
  cd ..
fi

if [ -d "client" ]; then
  echo ""
  echo "📦 Setting up client..."
  cd client
  if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
    npm install
  else
    echo "   node_modules up to date"
  fi
  cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Start development:"
echo "  Terminal 1 → cd server && npm run dev   (API on :5001)"
echo "  Terminal 2 → cd client && npm run dev   (UI on :5173)"