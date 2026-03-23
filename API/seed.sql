-- ============================================================
-- Seed: 6 months of fake analytics data
-- Run: psql -U <user> -d analytics_db -f seed.sql
-- ============================================================

-- Use the existing sites (or create them if missing)
INSERT INTO sites (domain, name, public) VALUES
  ('guillaume.ceo', 'Guillaume CEO', true),
  ('ceowire.co', 'CEO Wire', false),
  ('oksaas.co', 'OK SaaS', false)
ON CONFLICT (domain) DO NOTHING;

-- Generate fake data using a DO block
DO $$
DECLARE
  site RECORD;
  day_offset INTEGER;
  hour_offset INTEGER;
  sessions_per_day INTEGER;
  i INTEGER;
  v_visitor TEXT;
  v_session UUID;
  v_timestamp TIMESTAMPTZ;
  v_pages TEXT[];
  v_page TEXT;
  v_countries TEXT[] := ARRAY['US','FR','GB','DE','CA','NL','ES','IT','BR','JP','IN','AU','SE','PL','CH'];
  v_cities TEXT[] := ARRAY['New York','Paris','London','Berlin','Toronto','Amsterdam','Madrid','Rome','Sao Paulo','Tokyo','Mumbai','Sydney','Stockholm','Warsaw','Zurich'];
  v_devices TEXT[] := ARRAY['Desktop','Desktop','Desktop','Mobile','Mobile','Tablet'];
  v_browsers TEXT[] := ARRAY['Chrome','Chrome','Chrome','Firefox','Safari','Safari','Microsoft Edge','Brave'];
  v_oses TEXT[] := ARRAY['Windows','Windows','macOS','macOS','Linux','iOS','Android'];
  v_referrers TEXT[] := ARRAY[NULL,NULL,NULL,'https://google.com','https://google.com','https://twitter.com','https://linkedin.com','https://github.com','https://reddit.com','https://medium.com'];
  v_utm_sources TEXT[] := ARRAY[NULL,NULL,NULL,NULL,'google','twitter','linkedin','newsletter','producthunt'];
  v_utm_mediums TEXT[] := ARRAY[NULL,NULL,NULL,NULL,'organic','social','social','email','referral'];
  v_event_names TEXT[] := ARRAY['Outbound Link: Click','Newsletter Signup','CTA Click','Download','Share'];
  v_country_idx INTEGER;
  v_pageview_count INTEGER;
  v_duration INTEGER;
BEGIN
  FOR site IN SELECT id, domain FROM sites WHERE domain IN ('guillaume.ceo','ceowire.co','oksaas.co') LOOP

    -- Site-specific pages
    IF site.domain = 'guillaume.ceo' THEN
      v_pages := ARRAY['/','/about','/projects','/blog','/blog/building-analytics','/blog/raspberry-pi-setup','/blog/nestjs-guide','/contact','/ceo-portraits','/resume'];
    ELSIF site.domain = 'ceowire.co' THEN
      v_pages := ARRAY['/','/startups/100-free-platforms-launch-saas-2026','/startups/yc-winter-2026-batch','/ai/pentagon-ai-chatbots','/tech/elon-musk-terafab','/business/openai-revenue','/feed','/about','/newsletter','/authors'];
    ELSE
      v_pages := ARRAY['/','/pricing','/features','/docs','/blog','/blog/saas-metrics','/login','/signup','/changelog','/about'];
    END IF;

    -- Loop over last 180 days
    FOR day_offset IN 0..179 LOOP

      -- More traffic on weekdays, growing over time
      sessions_per_day := GREATEST(1,
        (CASE
          WHEN site.domain = 'guillaume.ceo' THEN 5 + (day_offset / 10)
          WHEN site.domain = 'ceowire.co' THEN 8 + (day_offset / 8)
          ELSE 2 + (day_offset / 15)
        END)
        * (CASE WHEN EXTRACT(DOW FROM (NOW() - (day_offset || ' days')::INTERVAL)) IN (0,6) THEN 0.5 ELSE 1.0 END)::INTEGER
        + (random() * 5)::INTEGER
      );

      FOR i IN 1..sessions_per_day LOOP
        v_visitor := 'v_' || md5(random()::TEXT || i::TEXT || day_offset::TEXT);
        v_session := gen_random_uuid();
        hour_offset := (random() * 23)::INTEGER;
        v_timestamp := (NOW() - (day_offset || ' days')::INTERVAL) + (hour_offset || ' hours')::INTERVAL + ((random() * 59)::INTEGER || ' minutes')::INTERVAL;
        v_country_idx := (random() * (array_length(v_countries, 1) - 1))::INTEGER + 1;
        v_pageview_count := 1 + (random() * 4)::INTEGER;
        v_duration := (random() * 300)::INTEGER;

        INSERT INTO sessions (id, site_id, visitor_id, country, city, device, browser, os, referrer, utm_source, utm_medium, utm_campaign, duration, pageview_count, started_at)
        VALUES (
          v_session,
          site.id,
          v_visitor,
          v_countries[v_country_idx],
          v_cities[v_country_idx],
          v_devices[(random() * (array_length(v_devices, 1) - 1))::INTEGER + 1],
          v_browsers[(random() * (array_length(v_browsers, 1) - 1))::INTEGER + 1],
          v_oses[(random() * (array_length(v_oses, 1) - 1))::INTEGER + 1],
          v_referrers[(random() * (array_length(v_referrers, 1) - 1))::INTEGER + 1],
          v_utm_sources[(random() * (array_length(v_utm_sources, 1) - 1))::INTEGER + 1],
          v_utm_mediums[(random() * (array_length(v_utm_mediums, 1) - 1))::INTEGER + 1],
          CASE WHEN random() < 0.1 THEN 'launch' ELSE NULL END,
          v_duration,
          v_pageview_count,
          v_timestamp
        );

        -- Insert pageviews for this session
        FOR j IN 1..v_pageview_count LOOP
          v_page := v_pages[(random() * (array_length(v_pages, 1) - 1))::INTEGER + 1];
          INSERT INTO pageviews (site_id, session_id, visitor_id, pathname, referrer, duration, timestamp)
          VALUES (
            site.id,
            v_session,
            v_visitor,
            v_page,
            CASE WHEN j = 1 THEN v_referrers[(random() * (array_length(v_referrers, 1) - 1))::INTEGER + 1] ELSE NULL END,
            (random() * 120)::INTEGER,
            v_timestamp + ((j - 1) * 30 || ' seconds')::INTERVAL
          );
        END LOOP;

        -- 10% chance of an event per session
        IF random() < 0.1 THEN
          INSERT INTO events (site_id, session_id, visitor_id, name, props, timestamp)
          VALUES (
            site.id,
            v_session,
            v_visitor,
            v_event_names[(random() * (array_length(v_event_names, 1) - 1))::INTEGER + 1],
            '{"url": "https://example.com"}'::JSONB,
            v_timestamp + ('60 seconds')::INTERVAL
          );
        END IF;

      END LOOP;
    END LOOP;
  END LOOP;
END $$;
