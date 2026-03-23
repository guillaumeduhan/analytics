import type {
  SiteSummary,
  SiteStats,
  TimeSeriesData,
  SourceData,
  PageData,
  CountryData,
  BrowserData,
  DeviceData,
  GoalData,
} from './types'

export const mockSites: SiteSummary[] = [
  {
    id: '1',
    domain: 'ceowire.co',
    name: 'CEO Wire',
    public: false,
    created_at: '2024-01-15T10:00:00Z',
    visitors24h: 7,
    trend: -50,
    sparklineData: [0, 1, 3, 1, 0, 2, 3, 2, 0, 1, 2, 1],
  },
  {
    id: '2',
    domain: 'oksaas.co',
    name: 'OK SaaS',
    public: false,
    created_at: '2024-02-20T10:00:00Z',
    visitors24h: 0,
    trend: -100,
    sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: '3',
    domain: 'guillaume.ceo',
    name: 'Guillaume CEO',
    public: true,
    created_at: '2024-03-10T10:00:00Z',
    visitors24h: 5,
    trend: 150,
    sparklineData: [0, 1, 2, 0, 1, 3, 2, 1, 0, 2, 1, 2],
  },
  {
    id: '4',
    domain: 'okagents.ai',
    name: 'OK Agents',
    public: false,
    created_at: '2024-04-05T10:00:00Z',
    visitors24h: 0,
    trend: -100,
    sparklineData: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
]

export const mockSiteStats: SiteStats = {
  uniqueVisitors: 7,
  totalVisits: 8,
  totalPageviews: 14,
  viewsPerVisit: 1.75,
  bounceRate: 75,
  visitDuration: 10,
  uniqueVisitorsTrend: 42,
  totalVisitsTrend: -33,
  totalPageviewsTrend: -30,
  viewsPerVisitTrend: 0,
  bounceRateTrend: 8,
  visitDurationTrend: -90,
}

export const mockTimeSeriesData: TimeSeriesData[] = [
  { timestamp: '22 Mar, 08:00', visitors: 2 },
  { timestamp: '22 Mar, 10:00', visitors: 5 },
  { timestamp: '22 Mar, 12:00', visitors: 8 },
  { timestamp: '22 Mar, 14:00', visitors: 6 },
  { timestamp: '22 Mar, 16:00', visitors: 12 },
  { timestamp: '22 Mar, 18:00', visitors: 9 },
  { timestamp: '22 Mar, 20:00', visitors: 14 },
  { timestamp: '22 Mar, 22:00', visitors: 11 },
  { timestamp: '23 Mar, 00:00', visitors: 7 },
  { timestamp: '23 Mar, 02:00', visitors: 4 },
  { timestamp: '23 Mar, 04:00', visitors: 6 },
  { timestamp: '23 Mar, 06:00', visitors: 10 },
  { timestamp: '23 Mar, 08:00', visitors: 13 },
]

export const mockSources: SourceData[] = [
  { source: 'Direct / None', visitors: 4, icon: 'direct' },
  { source: 'LinkedIn', visitors: 1, icon: 'linkedin' },
  { source: 'Twitter', visitors: 1, icon: 'twitter' },
  { source: 'guillaumeduhan.medium.com', visitors: 1, icon: 'medium' },
]

export const mockPages: PageData[] = [
  { pathname: '/startups/100-free-platforms-launch-saas-2026', visitors: 3 },
  { pathname: '/', visitors: 2 },
  { pathname: '/startups/yc-winter-2026-batch-ai-agent-infra...', visitors: 2 },
  { pathname: '/ai/pentagon-ai-chatbots-targeting-decisions-...', visitors: 1 },
  { pathname: '/ceo-portraits', visitors: 1 },
  { pathname: '/tech/elon-musk-terafab-chip-factory-tesla-sp...', visitors: 1 },
]

export const mockCountries: CountryData[] = [
  { country: 'United States', visitors: 3, code: 'US' },
  { country: 'France', visitors: 2, code: 'FR' },
  { country: 'United Kingdom', visitors: 1, code: 'GB' },
  { country: 'Germany', visitors: 1, code: 'DE' },
]

export const mockBrowsers: BrowserData[] = [
  { browser: 'Chrome', visitors: 5 },
  { browser: 'Microsoft Edge', visitors: 1 },
  { browser: 'Mobile App', visitors: 1 },
]

export const mockDevices: DeviceData[] = [
  { device: 'Desktop', visitors: 5 },
  { device: 'Mobile', visitors: 2 },
]

export const mockGoals: GoalData[] = [
  { name: 'Outbound Link: Click', uniques: 1, total: 2, cr: 14.3 },
]
