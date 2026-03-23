'use client'

import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { TimeSeriesData } from '@/lib/types'

interface VisitorsChartProps {
  data: TimeSeriesData[]
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: '#f3f4f6', fontWeight: 600, fontSize: 13 }}
            itemStyle={{ color: '#a78bfa', fontSize: 13 }}
          />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="#a78bfa"
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
