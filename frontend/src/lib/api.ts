import type {
  Site,
  SiteStats,
  TimeSeriesData,
  SourceData,
  PageData,
  CountryData,
  BrowserData,
  DeviceData,
  GoalData,
  SiteSummary,
  TimeRange,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || ''

const authHeaders: Record<string, string> = {
  'X-API-Key': API_KEY,
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

function mapPeriod(timeRange: TimeRange): string {
  switch (timeRange) {
    case '24h': return 'today'
    case '7d': return '7d'
    case '30d': return '30d'
    case '12m': return '12m'
    case 'all': return '12m'
  }
}

// ── Sites ──

export async function getSites(): Promise<SiteSummary[]> {
  const sites = await fetchApi<Site[]>('/sites')

  const summaries = await Promise.all(
    sites.map(async (site) => {
      try {
        const [summary, timeseries] = await Promise.all([
          fetchApi<{ visitors: number; pageviews: number; sessions: number; avg_duration: number; bounce_rate: number }>(
            `/stats/${site.id}/summary?period=today`
          ),
          fetchApi<{ date: string; pageviews: number; visitors: number }[]>(
            `/stats/${site.id}/timeseries?period=7d`
          ),
        ])
        return {
          ...site,
          visitors24h: summary.visitors,
          trend: 0,
          sparklineData: timeseries.map((d) => d.visitors),
        } satisfies SiteSummary
      } catch {
        return {
          ...site,
          visitors24h: 0,
          trend: 0,
          sparklineData: [],
        } satisfies SiteSummary
      }
    })
  )

  return summaries
}

export async function createSite(domain: string, name: string): Promise<Site> {
  const res = await fetch(`${API_URL}/sites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ domain, name }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function deleteSite(siteId: string): Promise<void> {
  const res = await fetch(`${API_URL}/sites/${siteId}`, { method: 'DELETE', headers: authHeaders })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
}

// ── Stats ──

export async function getSummary(siteId: string, timeRange: TimeRange): Promise<SiteStats> {
  const period = mapPeriod(timeRange)
  const [current, previous] = await Promise.all([
    fetchApi<{ visitors: number; pageviews: number; sessions: number; avg_duration: number; bounce_rate: number }>(
      `/stats/${siteId}/summary?period=${period}`
    ),
    fetchApi<{ visitors: number; pageviews: number; sessions: number; avg_duration: number; bounce_rate: number }>(
      `/stats/${siteId}/summary?period=${period}`
    ),
  ])

  const daysByRange: Record<TimeRange, number> = { '24h': 1, '7d': 7, '30d': 30, '12m': 365, 'all': 365 }
  const days = daysByRange[timeRange] || 1

  return {
    uniqueVisitors: current.visitors,
    averageVisitors: days > 0 ? Math.round((current.visitors / days) * 10) / 10 : 0,
    totalVisits: current.sessions,
    totalPageviews: current.pageviews,
    viewsPerVisit: current.sessions > 0 ? Math.round((current.pageviews / current.sessions) * 100) / 100 : 0,
    bounceRate: current.bounce_rate,
    visitDuration: current.avg_duration,
    uniqueVisitorsTrend: 0,
    totalVisitsTrend: 0,
    totalPageviewsTrend: 0,
    viewsPerVisitTrend: 0,
    bounceRateTrend: 0,
    visitDurationTrend: 0,
  }
}

export async function getTimeseries(siteId: string, timeRange: TimeRange): Promise<TimeSeriesData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ date: string; pageviews: number; visitors: number; visits: number }[]>(
    `/stats/${siteId}/timeseries?period=${period}`
  )

  // For 24h: fill 24 hourly buckets from (now - 24h) to now, rolling
  if (timeRange === '24h') {
    const byHour = new Map<number, { pageviews: number; visitors: number; visits: number }>()
    rows.forEach((r) => {
      const h = new Date(r.date)
      h.setMinutes(0, 0, 0)
      byHour.set(h.getTime(), { pageviews: r.pageviews, visitors: r.visitors, visits: r.visits })
    })

    const now = new Date()
    now.setMinutes(0, 0, 0)
    const buckets: TimeSeriesData[] = []
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600_000)
      const m = byHour.get(d.getTime()) || { pageviews: 0, visitors: 0, visits: 0 }
      buckets.push({
        timestamp: d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }),
        visitors: m.visitors,
        visits: m.visits,
        pageviews: m.pageviews,
      })
    }
    return buckets
  }

  return rows.map((r) => ({
    timestamp: new Date(r.date).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
    }),
    visitors: r.visitors,
    visits: r.visits,
    pageviews: r.pageviews,
  }))
}

export async function getSources(siteId: string, timeRange: TimeRange): Promise<SourceData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ referrer: string; sessions: number }[]>(
    `/stats/${siteId}/referrers?period=${period}`
  )
  return rows.map((r) => ({
    source: (r.referrer || 'Direct / None').replace(/^https?:\/\//, ''),
    visitors: Number(r.sessions),
  }))
}

export async function getPages(siteId: string, timeRange: TimeRange): Promise<PageData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ pathname: string; views: string; visitors: string }[]>(
    `/stats/${siteId}/pages?period=${period}`
  )
  return rows.map((r) => ({
    pathname: r.pathname,
    visitors: Number(r.visitors),
  }))
}

export async function getCountries(siteId: string, timeRange: TimeRange): Promise<CountryData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ country: string; sessions: string; visitors: string }[]>(
    `/stats/${siteId}/countries?period=${period}`
  )
  return rows.map((r) => ({
    country: r.country,
    visitors: Number(r.visitors),
    code: '',
  }))
}

export async function getCities(siteId: string, timeRange: TimeRange): Promise<{ city: string; visitors: number }[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ city: string; visitors: string }[]>(
    `/stats/${siteId}/cities?period=${period}`
  )
  return rows.map((r) => ({
    city: r.city,
    visitors: Number(r.visitors),
  }))
}

export async function getBrowsers(siteId: string, timeRange: TimeRange): Promise<BrowserData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ browser: string; sessions: string }[]>(
    `/stats/${siteId}/breakdown/browser?period=${period}`
  )
  return rows.map((r) => ({
    browser: r.browser,
    visitors: Number(r.sessions),
  }))
}

export async function getDevices(siteId: string, timeRange: TimeRange): Promise<DeviceData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ device: string; sessions: string }[]>(
    `/stats/${siteId}/breakdown/device?period=${period}`
  )
  return rows.map((r) => ({
    device: r.device,
    visitors: Number(r.sessions),
  }))
}

export async function getOS(siteId: string, timeRange: TimeRange): Promise<{ os: string; visitors: number }[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ os: string; sessions: string }[]>(
    `/stats/${siteId}/breakdown/os?period=${period}`
  )
  return rows.map((r) => ({
    os: r.os,
    visitors: Number(r.sessions),
  }))
}

export async function getEvents(siteId: string, timeRange: TimeRange): Promise<GoalData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ name: string; count: string; visitors: string }[]>(
    `/stats/${siteId}/events?period=${period}`
  )
  return rows.map((r) => ({
    name: r.name,
    total: Number(r.count),
    uniques: Number(r.visitors),
    cr: 0,
  }))
}

export async function getCampaigns(siteId: string, timeRange: TimeRange): Promise<SourceData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ source: string; medium: string; campaign: string; sessions: string }[]>(
    `/stats/${siteId}/utm?period=${period}`
  )
  return rows.map((r) => ({
    source: [r.source, r.medium, r.campaign].filter(Boolean).join(' / ') || 'Unknown',
    visitors: Number(r.sessions),
  }))
}

export async function getEntryPages(siteId: string, timeRange: TimeRange): Promise<PageData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ pathname: string; visitors: string }[]>(
    `/stats/${siteId}/entry-pages?period=${period}`
  )
  return rows.map((r) => ({
    pathname: r.pathname,
    visitors: Number(r.visitors),
  }))
}

export async function getExitPages(siteId: string, timeRange: TimeRange): Promise<PageData[]> {
  const period = mapPeriod(timeRange)
  const rows = await fetchApi<{ pathname: string; visitors: string }[]>(
    `/stats/${siteId}/exit-pages?period=${period}`
  )
  return rows.map((r) => ({
    pathname: r.pathname,
    visitors: Number(r.visitors),
  }))
}

export async function getRealtime(siteId: string): Promise<number> {
  const data = await fetchApi<{ active_visitors: number }>(`/stats/${siteId}/realtime`)
  return data.active_visitors
}
