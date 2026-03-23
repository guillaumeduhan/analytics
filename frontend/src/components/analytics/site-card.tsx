'use client'

import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import type { SiteSummary } from '@/lib/types'

interface SiteCardProps {
  site: SiteSummary
}

export function SiteCard({ site }: SiteCardProps) {
  const isPositiveTrend = site.trend > 0
  const isNegativeTrend = site.trend < 0

  // Convert sparkline array to chart data format
  const chartData = site.sparklineData.map((value, index) => ({
    index,
    visitors: value,
  }))

  return (
    <Link href={`/site/${site.domain}`}>
      <Card className="overflow-hidden hover:bg-secondary/30 transition-colors cursor-pointer h-full flex flex-col">
        {/* Header: Title and Trend */}
        <div className="flex items-start justify-between px-4 pt-4 pb-3">
          <div className="text-sm font-bold text-foreground">
            {site.domain}
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-semibold whitespace-nowrap ${
              isPositiveTrend
                ? 'text-success'
                : isNegativeTrend
                ? 'text-destructive'
                : 'text-muted-foreground'
            }`}
          >
            {isPositiveTrend ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : isNegativeTrend ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : null}
            {Math.abs(site.trend)}%
          </div>
        </div>

        {/* Footer: Value and Chart on same line */}
        <div className="flex items-end justify-between px-4 py-2 mt-auto">
          {/* Left: Value */}
          <div className="flex-shrink-0">
            <div className="text-3xl font-bold text-foreground leading-tight">
              {site.visitors24h.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              last 24 hours
            </div>
          </div>

          {/* Right: Sparkline chart — ~1/3 of card width */}
          <div className="h-14 w-1/3 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${site.domain}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill={`url(#gradient-${site.domain})`}
                  isAnimationActive={false}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </Link>
  )
}
