export interface Site {
  id: string
  domain: string
  name: string
  public: boolean
  created_at: string
}

export interface Session {
  id: string
  site_id: string
  visitor_id: string
  country: string | null
  city: string | null
  device: string | null
  browser: string | null
  os: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  duration: number
  pageview_count: number
  started_at: string
}

export interface Pageview {
  id: string
  site_id: string
  session_id: string
  visitor_id: string
  pathname: string
  referrer: string | null
  duration: number
  timestamp: string
}

export interface Event {
  id: string
  site_id: string
  session_id: string
  visitor_id: string
  name: string
  props: Record<string, unknown> | null
  timestamp: string
}

export interface SiteStats {
  uniqueVisitors: number
  averageVisitors: number
  totalVisits: number
  totalPageviews: number
  viewsPerVisit: number
  bounceRate: number
  visitDuration: number
  uniqueVisitorsTrend: number
  totalVisitsTrend: number
  totalPageviewsTrend: number
  viewsPerVisitTrend: number
  bounceRateTrend: number
  visitDurationTrend: number
}

export interface TimeSeriesData {
  timestamp: string
  visitors: number
  visits: number
  pageviews: number
}

export interface SourceData {
  source: string
  visitors: number
  icon?: string
}

export interface PageData {
  pathname: string
  visitors: number
}

export interface CountryData {
  country: string
  visitors: number
  code: string
}

export interface BrowserData {
  browser: string
  visitors: number
}

export interface OSData {
  os: string
  visitors: number
}

export interface DeviceData {
  device: string
  visitors: number
}

export interface GoalData {
  name: string
  uniques: number
  total: number
  cr: number
}

export interface SiteSummary extends Site {
  visitors24h: number
  trend: number
  sparklineData: number[]
}

export type TimeRange = '24h' | '7d' | '30d' | '12m' | 'all'
