# Analytics-G

Self-hosted, privacy-friendly web analytics platform — track pageviews, events, and visitor sessions without third-party services.

## About

Analytics-G is a lightweight analytics solution designed to run on minimal hardware (Raspberry Pi 4). It provides a full-stack alternative to Google Analytics with complete data ownership.

- **Pageview tracking** — automatic page load and navigation tracking
- **Custom events** — track clicks, form submissions, conversions with custom properties
- **Session management** — visitor sessions with device, browser, OS, and geo data
- **UTM campaigns** — source, medium, and campaign attribution
- **Realtime** — live visitor count
- **Dashboard stats** — summary, timeseries, top pages, referrers, countries, device/browser/OS breakdown
- **Swagger docs** — auto-generated API documentation at `/docs`
- **Privacy-first** — no cookies, no personal data, self-hosted

## Project Structure

```
analytics-g/
├── API/          # NestJS backend — data collection & stats endpoints
└── frontend/     # Next.js dashboard — analytics UI
```

## Quick Start

```bash
git clone https://github.com/guillaumeduhan/analytics.git
cd analytics
./install.sh
```

This installs all dependencies (API + Frontend), sets up `.env` files, and runs the database schema.

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** 17
- **yarn** (frontend) / **npm** (API)

### Manual Setup

#### API

```bash
cd API
npm install
cp .env.EXAMPLE .env   # configure your database credentials
npm run start:dev
```

The API will be available at `http://localhost:4200`, Swagger docs at `http://localhost:4200/docs`, and health check at `http://localhost:4200/health`.

#### Frontend

```bash
cd frontend
yarn install
yarn dev
```

The dashboard will be available at `http://localhost:3000`.

### Production

```bash
# API (PM2)
cd API
npm run build
pm2 start ecosystem.config.js

# Frontend
cd frontend
yarn build
yarn start
```

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Recharts, shadcn/ui |
| API | NestJS 11, TypeScript 5 |
| Database | PostgreSQL 17, TypeORM |
| Hosting | Raspberry Pi 4 |
| Process Manager | PM2 |
