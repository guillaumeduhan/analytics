#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GREEN}=== Analytics-G Installer ===${NC}"
echo ""

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
OS="$(uname -s)"

# -------------------------------------------------------
# Helper: check if a command exists
# -------------------------------------------------------
has() {
  command -v "$1" >/dev/null 2>&1
}

# -------------------------------------------------------
# Step 0 — Install missing tools
# -------------------------------------------------------
echo -e "${BLUE}[0/5] Checking your system...${NC}"

# Detect package manager
if [ "$OS" = "Darwin" ]; then
  if ! has brew; then
    echo -e "${YELLOW}  Homebrew not found. Installing...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
  PKG="brew install"
elif [ -f /etc/debian_version ]; then
  sudo apt-get update -qq
  PKG="sudo apt-get install -y"
elif [ -f /etc/arch-release ]; then
  PKG="sudo pacman -S --noconfirm"
else
  PKG=""
fi

# Node.js
if ! has node; then
  echo -e "${YELLOW}  Node.js not found. Installing...${NC}"
  if [ -n "$PKG" ]; then
    if [ "$OS" = "Darwin" ]; then
      $PKG node
    else
      # Use NodeSource for Linux to get latest LTS
      curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
      sudo apt-get install -y nodejs
    fi
  else
    echo -e "${RED}  Could not install Node.js automatically. Install it from https://nodejs.org${NC}"
    exit 1
  fi
else
  echo -e "  Node.js $(node -v) — ok"
fi

# npm (comes with Node but just in case)
if ! has npm; then
  echo -e "${RED}  npm not found. It should come with Node.js. Something is wrong.${NC}"
  exit 1
fi

# yarn
if ! has yarn; then
  echo -e "${YELLOW}  yarn not found. Installing...${NC}"
  npm install -g yarn
else
  echo -e "  yarn $(yarn -v) — ok"
fi

# PostgreSQL client
if ! has psql; then
  echo -e "${YELLOW}  PostgreSQL client not found. Installing...${NC}"
  if [ -n "$PKG" ]; then
    if [ "$OS" = "Darwin" ]; then
      $PKG postgresql
    else
      $PKG postgresql-client
    fi
  else
    echo -e "${YELLOW}  Could not install psql automatically. Database setup will be skipped.${NC}"
  fi
else
  echo -e "  psql $(psql --version | head -1) — ok"
fi

# PM2
if ! has pm2; then
  echo -e "${YELLOW}  PM2 not found. Installing...${NC}"
  npm install -g pm2
else
  echo -e "  PM2 $(pm2 -v) — ok"
fi

echo ""

# -------------------------------------------------------
# Step 1 — API dependencies
# -------------------------------------------------------
echo -e "${BLUE}[1/5] Installing API dependencies...${NC}"
cd "$ROOT_DIR/API"
npm install

# -------------------------------------------------------
# Step 2 — API environment
# -------------------------------------------------------
echo -e "${BLUE}[2/5] Setting up API environment...${NC}"
if [ ! -f .env ]; then
  cp .env.EXAMPLE .env
  echo -e "  Created ${GREEN}.env${NC} from .env.EXAMPLE"
  echo -e "  ${YELLOW}Edit API/.env with your database credentials and API key.${NC}"
else
  echo "  .env already exists, skipping."
fi

# -------------------------------------------------------
# Step 3 — Database
# -------------------------------------------------------
echo -e "${BLUE}[3/5] Setting up database...${NC}"
if [ -f database.sql ] && has psql; then
  DB_NAME=$(grep DATABASE_NAME .env | cut -d '=' -f2)
  DB_USER=$(grep DATABASE_USER .env | cut -d '=' -f2)
  DB_HOST=$(grep DATABASE_HOST .env | cut -d '=' -f2)
  DB_PORT=$(grep DATABASE_PORT .env | cut -d '=' -f2)

  echo "  Running database.sql on ${DB_NAME:-postgres}..."
  PGPASSWORD=$(grep DATABASE_PASSWORD .env | cut -d '=' -f2) \
    psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-guillaume}" -d "${DB_NAME:-postgres}" -f database.sql 2>/dev/null || \
    echo -e "  ${YELLOW}Could not run database.sql — run it manually if needed.${NC}"
else
  echo "  Skipped (no database.sql or psql not available)."
fi

# -------------------------------------------------------
# Step 4 — Frontend dependencies
# -------------------------------------------------------
echo -e "${BLUE}[4/5] Installing Frontend dependencies...${NC}"
cd "$ROOT_DIR/frontend"
yarn install

# -------------------------------------------------------
# Step 5 — Frontend environment
# -------------------------------------------------------
echo -e "${BLUE}[5/5] Setting up Frontend environment...${NC}"
if [ ! -f .env.local ]; then
  cp .env.EXAMPLE .env.local
  echo -e "  Created ${GREEN}.env.local${NC} from .env.EXAMPLE"
  echo -e "  ${YELLOW}Edit frontend/.env.local if your API is not on localhost:4200.${NC}"
else
  echo "  .env.local already exists, skipping."
fi

# -------------------------------------------------------
# Done
# -------------------------------------------------------
echo ""
echo -e "${GREEN}=== Installation complete ===${NC}"
echo ""
echo "Start in development:"
echo "  cd API && npm run start:dev"
echo "  cd frontend && yarn dev"
echo ""
echo "Start in production:"
echo "  cd API && npm run build"
echo "  cd frontend && yarn build"
echo "  pm2 start ecosystem.config.js"
echo ""
