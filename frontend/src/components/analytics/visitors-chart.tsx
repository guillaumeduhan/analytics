'use client'

import { useMemo } from 'react'
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { TimeSeriesData } from '@/lib/types'

type MetricKey = 'visits' | 'visitors' | 'pageviews' | 'viewsPerVisit' | 'bounceRate' | 'visitDuration'

interface VisitorsChartProps {
  data: TimeSeriesData[]
  activeMetric?: string
}

export function VisitorsChart({ data, activeMetric = 'totalVisits' }: VisitorsChartProps) {
  const metricMap: Record<string, MetricKey> = {
    uniqueVisitors: 'visitors',
    totalVisits: 'visits',
    totalPageviews: 'pageviews',
    viewsPerVisit: 'viewsPerVisit',
    bounceRate: 'bounceRate',
    visitDuration: 'visitDuration',
  }

  const dataKey = metricMap[activeMetric] || 'visits'

  const chartData = useMemo(() => {
    if (data.length === 0) {
      return [
        { timestamp: '00:00', visits: 0, visitors: 0, pageviews: 0 },
        { timestamp: '06:00', visits: 0, visitors: 0, pageviews: 0 },
        { timestamp: '12:00', visits: 0, visitors: 0, pageviews: 0 },
        { timestamp: '18:00', visits: 0, visitors: 0, pageviews: 0 },
        { timestamp: '23:59', visits: 0, visitors: 0, pageviews: 0 },
      ]
    }
    return data
  }, [data])

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickMargin={8}
            allowDecimals={false}
            domain={[0, (max: number) => (max > 0 ? max : 10)]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: '#f3f4f6', fontWeight: 600, fontSize: 13 }}
            itemStyle={{ color: '#3b82f6', fontSize: 13 }}
          />
          <Area
            type="linear"
            dataKey={dataKey}
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#visitorsGradient)"
            isAnimationActive={true}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
