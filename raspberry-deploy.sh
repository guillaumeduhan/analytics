#!/bin/bash
# Full-clean deploy script for Raspberry Pi
# Usage: ./raspberry-deploy.sh (or `make deploy`)

set -e

cd "$(dirname "$0")"

echo "→ git pull"
git pull origin main

echo "→ pm2 delete all + kill daemon"
pm2 delete all || true
pm2 kill || true

echo "→ free ports 4200 / 3000"
sudo fuser -k 4200/tcp 3000/tcp 2>/dev/null || true
kill $(lsof -ti:4200) 2>/dev/null || true
kill $(lsof -ti:3000) 2>/dev/null || true

echo "→ clean API (full reinstall)"
cd API
rm -rf dist node_modules package-lock.json
npm install
npm run build
cd ..

echo "→ clean frontend (full reinstall)"
cd frontend
rm -rf .next node_modules package-lock.json yarn.lock pnpm-lock.yaml
npm install
npm run build
cd ..

echo "→ pm2 flush + start"
pm2 flush || true
pm2 start ecosystem.config.js
pm2 save

echo "→ pm2 list"
pm2 list

echo "→ pm2 logs (last 30 lines)"
pm2 logs --lines 30 --nostream

echo ""
echo "✓ Deploy done. Tail live logs with: pm2 logs"
