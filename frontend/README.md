# Analytics-G Frontend

Dashboard UI for Analytics-G — a self-hosted, privacy-friendly web analytics platform.

## About

Analytics-G Frontend is the client-side dashboard of the Analytics-G ecosystem. It visualizes pageviews, events, sessions, and visitor data collected by the API. Built with Next.js 16 and React 19.

- **Sites overview** — list and manage all tracked domains
- **Site detail** — per-domain analytics with stats, charts, and data tables
- **Visitors chart** — timeseries visualization of traffic over time
- **World map** — geographic breakdown of visitors
- **Data tables** — top pages, referrers, devices, browsers, OS, and UTM campaigns
- **Goals** — conversion tracking table
- **Time range selector** — filter stats by period
- **Dark mode** — theme toggle with system preference support
- **Profile page** — user settings

## Get Started

### Prerequisites

- **Node.js** >= 18
- **yarn**

### Installation

```bash
# From the repository root
cd frontend

# Install dependencies
yarn install
```

### Running

```bash
# Development (watch mode)
yarn dev

# Or use the Makefile
make dev

# Production build
yarn build
yarn start

# Lint
yarn lint
```

The dashboard will be available at `http://localhost:3000`.

## Architecture

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with theme provider
│   │   ├── page.tsx                  # Home — sites overview
│   │   ├── globals.css               # Global styles (Tailwind)
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile page
│   │   └── site/
│   │       └── [domain]/
│   │           └── page.tsx          # Per-site analytics dashboard
│   ├── components/
│   │   ├── analytics/                # Analytics-specific components
│   │   │   ├── add-site-dialog.tsx      # Add new site dialog
│   │   │   ├── data-table.tsx           # Generic data table
│   │   │   ├── goals-table.tsx          # Goals / conversions table
│   │   │   ├── header.tsx               # Dashboard header
│   │   │   ├── site-card.tsx            # Site overview card
│   │   │   ├── source-icon.tsx          # Traffic source icons
│   │   │   ├── stats-card.tsx           # Summary stat card
│   │   │   ├── theme-toggle.tsx         # Dark/light mode toggle
│   │   │   ├── time-range-selector.tsx  # Period filter
│   │   │   ├── visitors-chart.tsx       # Timeseries chart (Recharts)
│   │   │   └── world-map.tsx            # Geographic visitor map
│   │   ├── theme-provider.tsx        # next-themes provider
│   │   └── ui/                       # shadcn/ui component library
│   ├── hooks/                        # Custom React hooks
│   └── lib/                          # Utilities, types, mock data
├── public/                           # Static assets (icons, placeholders)
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (Radix UI) |
| Charts | Recharts |
| Number Formatting | numeral |
| Forms | React Hook Form + Zod |
| Theme | next-themes |
| Linting | ESLint |
