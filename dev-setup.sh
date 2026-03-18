#!/bin/bash
set -e

echo "🌿 ArtisanHub — Development Setup"
echo "=================================="

# ── Idempotent: Check Node.js ──────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Please install Node.js 20+ from https://nodejs.org"
  exit 1
fi

NODE_VER=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js 18+ required (found $(node -v))"
  exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"

# ── Server setup ───────────────────────────────────────────────
if [ -d "server" ]; then
  echo ""
  echo "📦 Setting up server..."
  cd server

  if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
    npm install
  else
    echo "   node_modules up to date, skipping install"
  fi

  if [ ! -f .env ]; then
    cp .env.example .env
    echo "   Created server/.env from .env.example"
  fi

  echo "   Setting up database..."
  npx prisma generate
  npx prisma db push
  node src/prisma/seed.js

  cd ..
fi

# ── Client setup ───────────────────────────────────────────────
if [ -d "client" ]; then
  echo ""
  echo "📦 Setting up client..."
  cd client

  if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
    npm install
  else
    echo "   node_modules up to date, skipping install"
  fi

  cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  Terminal 1: cd server && npm run dev"
echo "  Terminal 2: cd client && npm run dev"
echo ""
echo "App:    http://localhost:5173"
echo "API:    http://localhost:5001"