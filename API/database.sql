-- ============================================================
-- Analytics DB — Schéma PostgreSQL
-- Raspberry Pi 4 / PostgreSQL 17
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Sites à tracker
-- ------------------------------------------------------------
CREATE TABLE sites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain      TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  public      BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Sessions visiteurs
-- ------------------------------------------------------------
CREATE TABLE sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id        UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  visitor_id     TEXT NOT NULL,
  country        TEXT,
  city           TEXT,
  device         TEXT,
  browser        TEXT,
  os             TEXT,
  referrer       TEXT,
  utm_source     TEXT,
  utm_medium     TEXT,
  utm_campaign   TEXT,
  duration       INTEGER NOT NULL DEFAULT 0,
  pageview_count INTEGER NOT NULL DEFAULT 0,
  started_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Pages vues
-- ------------------------------------------------------------
CREATE TABLE pageviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  visitor_id  TEXT NOT NULL,
  pathname    TEXT NOT NULL,
  referrer    TEXT,
  duration    INTEGER NOT NULL DEFAULT 0,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Événements custom (clics, formulaires, conversions, etc.)
-- ------------------------------------------------------------
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  visitor_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  props       JSONB,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Index pour les requêtes fréquentes
-- ------------------------------------------------------------
CREATE INDEX idx_sessions_site_id    ON sessions(site_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_visitor    ON sessions(visitor_id);

CREATE INDEX idx_pageviews_site_id   ON pageviews(site_id);
CREATE INDEX idx_pageviews_timestamp ON pageviews(timestamp);
CREATE INDEX idx_pageviews_pathname  ON pageviews(pathname);

CREATE INDEX idx_events_site_id      ON events(site_id);
CREATE INDEX idx_events_name         ON events(name);
CREATE INDEX idx_events_timestamp    ON events(timestamp);
