'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Header } from '@/components/analytics/header'
import { SiteCard } from '@/components/analytics/site-card'
import { AddSiteDialog } from '@/components/analytics/add-site-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockSites } from '@/lib/mock-data'
import type { SiteSummary } from '@/lib/types'

export default function HomePage() {
  const [sites, setSites] = useState<SiteSummary[]>(mockSites)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Most visitors')

  const handleAddSite = (site: SiteSummary) => {
    setSites((prev) => [site, ...prev])
  }

  const filteredSites = sites
    .filter((site) =>
      site.domain.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'Most visitors') {
        return b.visitors24h - a.visitors24h
      }
      return a.domain.localeCompare(b.domain)
    })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">My personal sites</h1>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Press / to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  {sortBy}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('Most visitors')}>
                  Most visitors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Alphabetical')}>
                  Alphabetical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AddSiteDialog onAdd={handleAddSite} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sites found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  )
}
