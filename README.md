# Analytics-G

Self-hosted, privacy-friendly, **multi-site** web analytics — track pageviews, events, and visitor sessions across all your domains without third-party services.

![Analytics-G Dashboard](dashboard.jpeg)

## Get started

### 1. Clone the project

```bash
git clone https://github.com/guillaumeduhan/analytics.git
cd analytics
```

### 2. Run the installer

```bash
chmod +x install.sh
./install.sh
```

The script checks your machine and installs what's missing (Node.js, yarn, PostgreSQL, PM2). Then it sets up the API and the frontend for you.

### 3. Configure your environment

After install, edit these two files with your own values:

- `API/.env` — database credentials and API key
- `frontend/.env.local` — API URL

### 4. Start the project

**Development:**

```bash
# Terminal 1 — API
cd API
npm run start:dev

# Terminal 2 — Frontend
cd frontend
yarn dev
```

- API: http://localhost:4200
- API docs: http://localhost:4200/docs
- Frontend: http://localhost:3000

**Production (PM2):**

```bash
cd API && npm run build
cd ../frontend && yarn build
pm2 start ecosystem.config.js
```

## Project structure

```
analytics/
├── API/                  # NestJS backend
├── frontend/             # Next.js dashboard
├── ecosystem.config.js   # PM2 config (API + frontend)
├── install.sh            # Auto-installer
└── makefile              # Shortcuts
```

## Tech stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS, Recharts, shadcn/ui |
| API | NestJS, TypeScript |
| Database | PostgreSQL, TypeORM |
| Hosting | Raspberry Pi 4 |
| Process Manager | PM2 |
| Tunnel | Cloudflare Tunnel |

## Features

- Pageview tracking — automatic page load and navigation
- Custom events — clicks, form submissions, conversions
- Session management — device, browser, OS, geo data
- UTM campaigns — source, medium, campaign attribution
- Realtime — live visitor count
- Multi-site — track all your domains from one dashboard
- Privacy-first — no cookies, no personal data, self-hosted
- API key auth — protected endpoints with X-API-Key header
- Swagger docs — auto-generated at /docs

## License

MIT
