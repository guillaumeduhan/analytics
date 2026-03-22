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
└── ...           # Frontend (coming soon)
```

## Get Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** 17
- **npm**

### Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd analytics-g

# Set up the database
psql -U <user> -d analytics_db -f API/database.sql

# Install & run the API
cd API
npm install
cp .env.EXAMPLE .env   # configure your database credentials
npm run start:dev
```

The API will be available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/docs`.

### Production (PM2)

```bash
cd API
npm run build
pm2 start ecosystem.config.js
```

## Tech Stack

| Component | Technology |
|---|---|
| API | NestJS 11, TypeScript 5 |
| Database | PostgreSQL 17, TypeORM |
| Hosting | Raspberry Pi 4 |
| Process Manager | PM2 |
