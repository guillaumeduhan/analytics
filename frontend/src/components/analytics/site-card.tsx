'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Settings, Trash2, Pin } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { SiteSummary } from '@/lib/types'

interface SiteCardProps {
  site: SiteSummary
  pinned?: boolean
  onDelete?: (siteId: string) => void
  onTogglePin?: (siteId: string) => void
}

const flatLineData = [
  { index: 0, visitors: 0 },
  { index: 1, visitors: 0 },
  { index: 2, visitors: 0 },
  { index: 3, visitors: 0 },
  { index: 4, visitors: 0 },
]

export function SiteCard({ site, pinned, onDelete, onTogglePin }: SiteCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isPositiveTrend = site.trend > 0
  const isNegativeTrend = site.trend < 0

  const hasData = site.sparklineData.length >= 2 && site.sparklineData.some((v) => v > 0)
  const chartData = hasData
    ? site.sparklineData.map((value, index) => ({ index, visitors: value }))
    : flatLineData

  return (
    <>
      <Link href={`/site/${site.domain}`}>
        <Card className="group relative overflow-hidden hover:bg-secondary/30 transition-colors cursor-pointer h-full flex flex-col">
          {/* Header: Title and Trend / Gear */}
          <div className="flex items-start justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              {pinned && <Pin className="w-3 h-3 text-primary" />}
              <span className="text-sm font-bold text-foreground">{site.domain}</span>
            </div>

            {/* Trend — hidden on hover, replaced by gear */}
            <div className="relative">
              <div
                className={`flex items-center gap-1 text-sm font-semibold whitespace-nowrap group-hover:opacity-0 transition-opacity ${
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

              <div
                className="absolute inset-0 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onTogglePin?.(site.id)}>
                      <Pin className="w-4 h-4 mr-2" />
                      {pinned ? 'Unpin' : 'Pin'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={hasData ? 0.25 : 0} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke={hasData ? '#3b82f6' : '#9ca3af'}
                    strokeWidth={hasData ? 2 : 1}
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{site.domain}</strong> and all its analytics data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete?.(site.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
