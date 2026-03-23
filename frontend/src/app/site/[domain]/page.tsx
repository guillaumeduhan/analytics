'use client'

import { useState } from 'react'
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
  mockSiteStats,
  mockTimeSeriesData,
  mockSources,
  mockPages,
  mockCountries,
  mockBrowsers,
  mockDevices,
  mockGoals,
} from '@/lib/mock-data'
import type { TimeRange } from '@/lib/types'

interface PageProps {
  params: Promise<{ domain: string }>
}

export default function SiteDashboard({ params }: PageProps) {
  const { domain } = use(params)
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [activeMetric, setActiveMetric] = useState<string>('uniqueVisitors')

  const stats = mockSiteStats

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
                    {domain}
                  </Link>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/site/ceowire.co">ceowire.co</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/site/oksaas.co">oksaas.co</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/site/guillaume.ceo">guillaume.ceo</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2 text-sm text-success">
              <Circle className="w-2 h-2 fill-current" />
              <span>0 current visitors</span>
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
                value={stats.uniqueVisitors}
                trend={stats.uniqueVisitorsTrend}
                active={activeMetric === 'uniqueVisitors'}
                onClick={() => setActiveMetric('uniqueVisitors')}
              />
              <StatsCard
                label="Total Visits"
                value={stats.totalVisits}
                trend={stats.totalVisitsTrend}
                active={activeMetric === 'totalVisits'}
                onClick={() => setActiveMetric('totalVisits')}
              />
              <StatsCard
                label="Total Pageviews"
                value={stats.totalPageviews}
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
            <VisitorsChart data={mockTimeSeriesData} />
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
                data={mockSources}
                columns={[
                  {
                    key: 'source',
                    header: 'Source',
                    render: (value, item) => (
                      <div className="flex items-center gap-2">
                        <SourceIcon type={item.icon as string} className="w-4 h-4 text-muted-foreground" />
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
                data={mockPages}
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
              <WorldMap data={mockCountries} />
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
                data={mockBrowsers}
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
            <GoalsTable data={mockGoals} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
