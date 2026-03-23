'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  trend?: number
  active?: boolean
  onClick?: () => void
}

export function StatsCard({ label, value, trend, active, onClick }: StatsCardProps) {
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-1 px-4 py-3 rounded-lg transition-colors text-left ${
        active ? 'bg-secondary/50' : 'hover:bg-secondary/30'
      }`}
    >
      <span
        className={`text-xs font-medium uppercase tracking-wider ${
          active ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              isPositive
                ? 'text-success'
                : isNegative
                ? 'text-destructive'
                : 'text-muted-foreground'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : isNegative ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </button>
  )
}
