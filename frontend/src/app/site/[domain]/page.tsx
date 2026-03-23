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
  getPages,
  getCountries,
  getBrowsers,
  getDevices,
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
  const [pages, setPages] = useState<PageData[]>([])
  const [countries, setCountries] = useState<CountryData[]>([])
  const [browsers, setBrowsers] = useState<BrowserData[]>([])
  const [devices, setDevices] = useState<DeviceData[]>([])
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
      const [s, ts, src, pg, co, br, dv, ev, rt] = await Promise.all([
        getSummary(siteId, timeRange),
        getTimeseries(siteId, timeRange),
        getSources(siteId, timeRange),
        getPages(siteId, timeRange),
        getCountries(siteId, timeRange),
        getBrowsers(siteId, timeRange),
        getDevices(siteId, timeRange),
        getEvents(siteId, timeRange),
        getRealtime(siteId),
      ])

      setStats(s)
      setTimeseries(ts)
      setSources(src)
      setPages(pg)
      setCountries(co)
      setBrowsers(br)
      setDevices(dv)
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
            <VisitorsChart data={timeseries} />
          </CardContent>
        </Card>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Sources */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <DataTable
                tabs={[
                  { value: 'channels', label: 'CHANNELS' },
                  { value: 'sources', label: 'SOURCES' },
                  { value: 'campaigns', label: 'CAMPAIGNS' },
                ]}
                defaultTab="sources"
                data={sources}
                columns={[
                  {
                    key: 'source',
                    header: 'Source',
                    render: (value, item) => (
                      <div className="flex items-center gap-2">
                        <SourceIcon type={item.source as string} className="w-4 h-4 text-muted-foreground" />
                        <span>{value as string}</span>
                      </div>
                    ),
                  },
                  { key: 'visitors', header: 'Visitors' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <DataTable
                tabs={[
                  { value: 'top', label: 'TOP PAGES' },
                  { value: 'entry', label: 'ENTRY PAGES' },
                  { value: 'exit', label: 'EXIT PAGES' },
                ]}
                defaultTab="top"
                data={pages}
                columns={[
                  { key: 'pathname', header: 'Page' },
                  { key: 'visitors', header: 'Visitors' },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* World Map */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <WorldMap data={countries} />
            </CardContent>
          </Card>

          {/* Browsers & Devices */}
          <Card className="border-0 bg-card">
            <CardContent className="p-6">
              <DataTable
                tabs={[
                  { value: 'browsers', label: 'BROWSERS' },
                  { value: 'os', label: 'OPERATING SYSTEMS' },
                  { value: 'devices', label: 'DEVICES' },
                ]}
                defaultTab="browsers"
                data={browsers}
                columns={[
                  {
                    key: 'browser',
                    header: 'Browser',
                    render: (value) => (
                      <div className="flex items-center gap-2">
                        <SourceIcon type={value as string} className="w-4 h-4 text-muted-foreground" />
                        <span>{value as string}</span>
                      </div>
                    ),
                  },
                  { key: 'visitors', header: 'Visitors' },
                ]}
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
