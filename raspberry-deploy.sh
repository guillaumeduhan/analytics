#!/bin/bash
# Deploy script for Raspberry Pi
# Usage: ./raspberry-deploy.sh

set -e

cd "$(dirname "$0")"

echo "→ git pull"
git pull

echo "→ pm2 delete all"
pm2 delete all || true

echo "→ free ports 4200 / 3000"
sudo fuser -k 4200/tcp 3000/tcp 2>/dev/null || true

echo "→ clean API"
cd API
rm -rf dist node_modules/.cache
npm install
npm run build
cd ..

echo "→ clean frontend"
cd frontend
rm -rf .next node_modules/.cache
npm install
npm run build
cd ..

echo "→ pm2 flush + start"
pm2 flush
pm2 start ecosystem.config.js
pm2 save

echo "→ pm2 list"
pm2 list

echo "→ pm2 logs (Ctrl+C to exit)"
pm2 logs --lines 30
