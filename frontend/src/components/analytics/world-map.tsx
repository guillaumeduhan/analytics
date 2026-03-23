'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CountryData } from '@/lib/types'
import { formatNumber } from '@/lib/format'

interface WorldMapProps {
  data: CountryData[]
}

export function WorldMap({ data }: WorldMapProps) {
  return (
    <Tabs defaultValue="map" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-transparent p-0 h-auto gap-4">
          {['MAP', 'COUNTRIES', 'REGIONS', 'CITIES'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="px-0 py-1 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none rounded-none"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Expand className="w-4 h-4" />
        </Button>
      </div>

      <TabsContent value="map" className="mt-0">
        {data.length > 0 ? (
          <div className="relative aspect-[2/1] bg-secondary/30 rounded-lg overflow-hidden">
            <SimplifiedWorldMap highlightedCountries={data.map((d) => d.code)} />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            No visitor data yet
          </div>
        )}
      </TabsContent>

      <TabsContent value="countries" className="mt-0">
        {data.length > 0 ? (
          <div className="space-y-1">
            {data.map((country) => (
              <div
                key={country.code}
                className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-secondary/50"
              >
                <span className="text-sm text-foreground">{country.country}</span>
                <span className="text-sm text-muted-foreground">{formatNumber(country.visitors)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            No visitor data yet
          </div>
        )}
      </TabsContent>

      <TabsContent value="regions" className="mt-0">
        <div className="text-sm text-muted-foreground text-center py-8">
          No region data available
        </div>
      </TabsContent>

      <TabsContent value="cities" className="mt-0">
        <div className="text-sm text-muted-foreground text-center py-8">
          No city data available
        </div>
      </TabsContent>
    </Tabs>
  )
}

function SimplifiedWorldMap({ highlightedCountries }: { highlightedCountries: string[] }) {
  // Simplified world map representation using circles for countries
  const countryPositions: Record<string, { x: number; y: number }> = {
    US: { x: 25, y: 40 },
    CA: { x: 22, y: 30 },
    MX: { x: 22, y: 50 },
    BR: { x: 35, y: 65 },
    AR: { x: 32, y: 80 },
    GB: { x: 48, y: 32 },
    FR: { x: 50, y: 38 },
    DE: { x: 52, y: 35 },
    ES: { x: 47, y: 42 },
    IT: { x: 53, y: 42 },
    PL: { x: 55, y: 34 },
    RU: { x: 70, y: 30 },
    CN: { x: 78, y: 45 },
    JP: { x: 88, y: 42 },
    KR: { x: 85, y: 45 },
    IN: { x: 72, y: 52 },
    AU: { x: 85, y: 75 },
    ZA: { x: 55, y: 75 },
    NG: { x: 52, y: 55 },
    EG: { x: 58, y: 48 },
  }

  return (
    <svg viewBox="0 0 100 90" className="w-full h-full">
      {/* Background dots for world outline */}
      {Object.entries(countryPositions).map(([code, pos]) => (
        <circle
          key={code}
          cx={pos.x}
          cy={pos.y}
          r={highlightedCountries.includes(code) ? 3 : 1.5}
          fill={
            highlightedCountries.includes(code)
              ? 'hsl(var(--primary))'
              : 'hsl(var(--muted-foreground) / 0.3)'
          }
          className="transition-all duration-300"
        />
      ))}
    </svg>
  )
}
