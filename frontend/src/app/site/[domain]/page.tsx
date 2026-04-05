'use client'

import { useState, useEffect, useCallback } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { ChevronDown, Circle } from 'lucide-react'
import { Header } from '@/components/analytics/header'
import { StatsCard } from '@/components/analytics/stats-card'
import { VisitorsChart } from '@/components/analytics/visitors-chart'
import { DataTable } from '@/components/analytics/data-table'
import { WorldMap } from '@/components/analytics/world-map'
import { GoalsTable } from '@/components/analytics/goals-table'
import { TimeRangeSelector } from '@/components/analytics/time-range-selector'
import { SourceIcon } from '@/components/analytics/source-icon'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getSites,
  getSummary,
  getTimeseries,
  getSources,
  getCampaigns,
  getPages,
  getEntryPages,
  getExitPages,
  getCountries,
  getCities,
  getBrowsers,
  getDevices,
  getOS,
  getEvents,
  getRealtime,
} from '@/lib/api'
import { formatNumber } from '@/lib/format'
import type {
  TimeRange,
  SiteStats,
  TimeSeriesData,
  SourceData,
  PageData,
  CountryData,
  BrowserData,
  DeviceData,
  GoalData,
  Site,
} from '@/lib/types'

interface PageProps {
  params: Promise<{ domain: string }>
}

const emptyStats: SiteStats = {
  uniqueVisitors: 0,
  averageVisitors: 0,
  totalVisits: 0,
  totalPageviews: 0,
  viewsPerVisit: 0,
  bounceRate: 0,
  visitDuration: 0,
  uniqueVisitorsTrend: 0,
  totalVisitsTrend: 0,
  totalPageviewsTrend: 0,
  viewsPerVisitTrend: 0,
  bounceRateTrend: 0,
  visitDurationTrend: 0,
}

export default function SiteDashboard({ params }: PageProps) {
  const { domain } = use(params)
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [activeMetric, setActiveMetric] = useState<string>('uniqueVisitors')

  const [allSites, setAllSites] = useState<Site[]>([])
  const [siteId, setSiteId] = useState<string | null>(null)
  const [realtimeVisitors, setRealtimeVisitors] = useState(0)
  const [stats, setStats] = useState<SiteStats>(emptyStats)
  const [timeseries, setTimeseries] = useState<TimeSeriesData[]>([])
  const [sources, setSources] = useState<SourceData[]>([])
  const [campaigns, setCampaigns] = useState<SourceData[]>([])
  const [pages, setPages] = useState<PageData[]>([])
  const [entryPages, setEntryPages] = useState<PageData[]>([])
  const [exitPages, setExitPages] = useState<PageData[]>([])
  const [countries, setCountries] = useState<CountryData[]>([])
  const [cities, setCities] = useState<{ city: string; visitors: number }[]>([])
  const [browsers, setBrowsers] = useState<BrowserData[]>([])
  const [devices, setDevices] = useState<DeviceData[]>([])
  const [osData, setOsData] = useState<{ os: string; visitors: number }[]>([])
  const [goals, setGoals] = useState<GoalData[]>([])

  // Resolve siteId from domain
  useEffect(() => {
    getSites().then((sites) => {
      setAllSites(sites)
      const match = sites.find((s) => s.domain === decodeURIComponent(domain))
      if (match) setSiteId(match.id)
    }).catch(console.error)
  }, [domain])

  // Fetch all stats when siteId or timeRange changes
  const fetchData = useCallback(async () => {
    if (!siteId) return

    try {
      const [s, ts, src, camp, pg, ep, xp, co, ci, br, dv, os, ev, rt] = await Promise.all([
        getSummary(siteId, timeRange),
        getTimeseries(siteId, timeRange),
        getSources(siteId, timeRange),
        getCampaigns(siteId, timeRange),
        getPages(siteId, timeRange),
        getEntryPages(siteId, timeRange),
        getExitPages(siteId, timeRange),
        getCountries(siteId, timeRange),
        getCities(siteId, timeRange),
        getBrowsers(siteId, timeRange),
        getDevices(siteId, timeRange),
        getOS(siteId, timeRange),
        getEvents(siteId, timeRange),
        getRealtime(siteId),
      ])

      setStats(s)
      setTimeseries(ts)
      setSources(src)
      setCampaigns(camp)
      setPages(pg)
      setEntryPages(ep)
      setExitPages(xp)
      setCountries(co)
      setCities(ci)
      setBrowsers(br)
      setDevices(dv)
      setOsData(os)
      setGoals(ev)
      setRealtimeVisitors(rt)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [siteId, timeRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-3">
        {/* Site Selector & Time Range */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-foreground font-medium">
                  <Link href="/" className="hover:underline">
                    {decodeURIComponent(domain)}
                  </Link>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allSites.map((s) => (
                  <DropdownMenuItem key={s.id} asChild>
                    <Link href={`/site/${s.domain}`}>{s.domain}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2 text-sm text-success">
              <Circle className="w-2 h-2 fill-current" />
              <span>{realtimeVisitors} current visitor{realtimeVisitors !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>

        {/* Stats Row */}
        <Card className="mb-3 border-0 bg-card">
          <CardContent className="p-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              <StatsCard
                label="Unique Visitors"
                value={formatNumber(stats.uniqueVisitors)}
                trend={stats.uniqueVisitorsTrend}
                active={activeMetric === 'uniqueVisitors'}
                onClick={() => setActiveMetric('uniqueVisitors')}
              />
              <StatsCard
                label="Average Visitors / day"
                value={stats.averageVisitors}
                trend={0}
                active={activeMetric === 'averageVisitors'}
                onClick={() => setActiveMetric('averageVisitors')}
              />
              <StatsCard
                label="Total Visits"
                value={formatNumber(stats.totalVisits)}
                trend={stats.totalVisitsTrend}
                active={activeMetric === 'totalVisits'}
                onClick={() => setActiveMetric('totalVisits')}
              />
              <StatsCard
                label="Total Pageviews"
                value={formatNumber(stats.totalPageviews)}
                trend={stats.totalPageviewsTrend}
                active={activeMetric === 'totalPageviews'}
                onClick={() => setActiveMetric('totalPageviews')}
              />
              <StatsCard
                label="Views Per Visit"
                value={stats.viewsPerVisit}
                trend={stats.viewsPerVisitTrend}
                active={activeMetric === 'viewsPerVisit'}
                onClick={() => setActiveMetric('viewsPerVisit')}
              />
              <StatsCard
                label="Bounce Rate"
                value={`${stats.bounceRate}%`}
                trend={stats.bounceRateTrend}
                active={activeMetric === 'bounceRate'}
                onClick={() => setActiveMetric('bounceRate')}
              />
              <StatsCard
                label="Visit Duration"
                value={`${stats.visitDuration}s`}
                trend={stats.visitDurationTrend}
                active={activeMetric === 'visitDuration'}
                onClick={() => setActiveMetric('visitDuration')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card className="mb-3 border-0 bg-card">
          <CardContent className="p-4">
            <VisitorsChart data={timeseries} activeMetric={activeMetric} />
          </CardContent>
        </Card>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Sources */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <DataTable
                tabs={[
                  {
                    value: 'sources',
                    label: 'SOURCES',
                    data: sources,
                    columns: [
                      {
                        key: 'source',
                        header: 'Source',
                        render: (value: unknown, item: Record<string, unknown>) => {
                          const src = item.source as string
                          const isDirect = src === 'Direct / None'
                          const content = (
                            <div className="flex items-center gap-2">
                              <SourceIcon type={src} className="w-4 h-4 text-muted-foreground" />
                              <span className={isDirect ? '' : 'hover:underline hover:text-primary transition-colors'}>{value as string}</span>
                            </div>
                          )
                          return isDirect ? content : (
                            <a
                              href={`https://${src}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {content}
                            </a>
                          )
                        },
                      },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                  {
                    value: 'campaigns',
                    label: 'CAMPAIGNS',
                    data: campaigns,
                    columns: [
                      { key: 'source', header: 'Campaign' },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                ]}
                defaultTab="sources"
              />
            </CardContent>
          </Card>

          {/* Pages */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <DataTable
                tabs={[
                  {
                    value: 'top',
                    label: 'TOP PAGES',
                    data: pages,
                    columns: [
                      { key: 'pathname', header: 'Page' },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                  {
                    value: 'entry',
                    label: 'ENTRY PAGES',
                    data: entryPages,
                    columns: [
                      { key: 'pathname', header: 'Page' },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                  {
                    value: 'exit',
                    label: 'EXIT PAGES',
                    data: exitPages,
                    columns: [
                      { key: 'pathname', header: 'Page' },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                ]}
                defaultTab="top"
              />
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* World Map */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <WorldMap data={countries} cities={cities} />
            </CardContent>
          </Card>

          {/* Browsers & Devices */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <DataTable
                tabs={[
                  {
                    value: 'browsers',
                    label: 'BROWSERS',
                    data: browsers,
                    columns: [
                      {
                        key: 'browser',
                        header: 'Browser',
                        render: (value: unknown) => (
                          <div className="flex items-center gap-2">
                            <SourceIcon type={value as string} className="w-4 h-4 text-muted-foreground" />
                            <span>{value as string}</span>
                          </div>
                        ),
                      },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                  {
                    value: 'os',
                    label: 'OPERATING SYSTEMS',
                    data: osData,
                    columns: [
                      { key: 'os', header: 'OS' },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                  {
                    value: 'devices',
                    label: 'DEVICES',
                    data: devices,
                    columns: [
                      { key: 'device', header: 'Device' },
                      { key: 'visitors', header: 'Visitors' },
                    ],
                  },
                ]}
                defaultTab="browsers"
              />
            </CardContent>
          </Card>
        </div>

        {/* Goals */}
        <Card className="border-0 bg-card">
          <CardContent className="p-6">
            <GoalsTable data={goals} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
