#!/bin/bash
set -e

echo "=== Analytics-G Installer ==="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required. Install it first."; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "PostgreSQL client is required. Install it first."; exit 1; }

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# --- API ---
echo -e "${BLUE}[1/4] Installing API dependencies...${NC}"
cd "$ROOT_DIR/API"
npm install

echo -e "${BLUE}[2/4] Setting up API environment...${NC}"
if [ ! -f .env ]; then
  cp .env.EXAMPLE .env
  echo "  Created .env from .env.EXAMPLE — edit it with your database credentials."
else
  echo "  .env already exists, skipping."
fi

# --- Database ---
echo -e "${BLUE}[3/4] Setting up database...${NC}"
if [ -f database.sql ]; then
  DB_NAME=$(grep DATABASE_NAME .env | cut -d '=' -f2)
  DB_USER=$(grep DATABASE_USER .env | cut -d '=' -f2)
  DB_HOST=$(grep DATABASE_HOST .env | cut -d '=' -f2)
  DB_PORT=$(grep DATABASE_PORT .env | cut -d '=' -f2)

  echo "  Running database.sql on ${DB_NAME:-postgres}..."
  PGPASSWORD=$(grep DATABASE_PASSWORD .env | cut -d '=' -f2) \
    psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-guillaume}" -d "${DB_NAME:-postgres}" -f database.sql 2>/dev/null || \
    echo "  Warning: Could not run database.sql — you may need to run it manually."
else
  echo "  No database.sql found, skipping."
fi

# --- Frontend ---
echo -e "${BLUE}[4/4] Installing Frontend dependencies...${NC}"
cd "$ROOT_DIR/frontend"
yarn install

if [ ! -f .env.local ]; then
  cp .env.EXAMPLE .env.local
  echo "  Created .env.local from .env.EXAMPLE — edit NEXT_PUBLIC_API_URL."
else
  echo "  .env.local already exists, skipping."
fi

echo ""
echo -e "${GREEN}=== Installation complete ===${NC}"
echo ""
echo "To start the API:"
echo "  cd API && npm run start:dev"
echo ""
echo "To start the Frontend:"
echo "  cd frontend && yarn dev"
echo ""
echo "For production (PM2):"
echo "  cd API && npm run build && pm2 start ecosystem.config.js"
echo "  cd frontend && yarn build && yarn start"
