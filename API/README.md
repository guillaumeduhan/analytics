# Analytics-G API

Backend API for Analytics-G — a self-hosted, privacy-friendly web analytics platform.

## About

Analytics-G API is the server-side engine of the Analytics-G ecosystem. It collects pageviews, events, and session data from tracked websites, then exposes statistics endpoints for the dashboard. Built to run on a Raspberry Pi 4 with PostgreSQL 17.

- **Collect** — ingest pageviews, custom events, and time-on-page duration
- **Sites** — register and manage tracked domains
- **Stats** — summary, timeseries, top pages, referrers, countries, device/browser/OS breakdown, UTM campaigns, custom events, and realtime visitors
- **Health** — `GET /health` endpoint for uptime monitoring
- **Swagger** — auto-generated API docs available at `/docs`

## Get Started

### Prerequisites

- **Node.js** >= 18
- **npm**
- **PostgreSQL** 17

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd analytics-g/API

# Install dependencies
npm install

# Set up the database
psql -U <user> -d analytics_db -f database.sql

# Set up environment variables
cp .env.EXAMPLE .env
# Fill in the required values in .env
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_HOST` | PostgreSQL host |
| `DATABASE_PORT` | PostgreSQL port (default `5432`) |
| `DATABASE_USER` | PostgreSQL user |
| `DATABASE_PASSWORD` | PostgreSQL password |
| `DATABASE_NAME` | PostgreSQL database name |
| `PORT` | API port (default `4200`) |

### Running

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Production with PM2
pm2 start ecosystem.config.js
```

### Makefile Shortcuts

| Command | Description |
|---|---|
| `make dev` | Start dev server (watch mode) |
| `make gt` | Add, commit, push |
| `make gm` | Checkout and pull main |

## Architecture

```
API/
├── src/
│   ├── main.ts                  # Bootstrap, CORS, Swagger setup
│   ├── app.module.ts            # Root module (TypeORM, Config)
│   ├── collect/                 # Data ingestion endpoints
│   │   ├── collect.controller.ts   # POST /collect/pageview, /event, /duration
│   │   ├── collect.service.ts      # Pageview & event processing
│   │   ├── collect.module.ts
│   │   └── collect.dto.ts          # Validation DTOs
│   ├── stats/                   # Analytics query endpoints
│   │   ├── stats.controller.ts     # GET /stats/:siteId/summary, timeseries, pages...
│   │   ├── stats.service.ts        # Aggregation queries
│   │   └── stats.module.ts
│   ├── sites/                   # Site management CRUD
│   │   ├── sites.controller.ts     # GET/POST/DELETE /sites
│   │   ├── sites.service.ts
│   │   ├── sites.module.ts
│   │   └── sites.dto.ts
│   ├── health/                  # Health check endpoint
│   │   ├── health.controller.ts    # GET /health
│   │   └── health.module.ts
│   └── entities/                # TypeORM entities
│       ├── site.entity.ts
│       ├── session.entity.ts
│       ├── pageview.entity.ts
│       └── event.entity.ts
├── test/                        # E2E tests
├── database.sql                 # PostgreSQL schema
├── ecosystem.config.js          # PM2 configuration
├── nest-cli.json
├── tsconfig.json
└── package.json
```

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| Database | PostgreSQL 17 |
| ORM | TypeORM |
| Validation | class-validator + class-transformer |
| API Docs | Swagger (via @nestjs/swagger) |
| Process Manager | PM2 |
| Linting | ESLint + Prettier |
| Testing | Jest + Supertest |

### Key Patterns

- **Data collection**: The tracking script sends `POST /collect/pageview` on page load, `POST /collect/event` for custom events, and `POST /collect/duration` on page unload to record time-on-page
- **Sessions**: A visitor's first pageview creates a session; subsequent pageviews on the same domain reuse the session ID
- **Stats queries**: All stats endpoints accept a `period` query param (`today`, `7d`, `30d`, `12m`) and return aggregated data per site
- **Realtime**: `GET /stats/:siteId/realtime` returns visitors active in the last 5 minutes
- **CORS enabled**: The API allows cross-origin requests so the tracking script can be embedded on any website
