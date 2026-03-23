'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Header } from '@/components/analytics/header'
import { SiteCard } from '@/components/analytics/site-card'
import { AddSiteDialog } from '@/components/analytics/add-site-dialog'
import { Input } from '@/components/ui/input'
import { getSites, deleteSite } from '@/lib/api'
import type { SiteSummary } from '@/lib/types'

function getPinnedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('pinned-sites') || '[]')
  } catch {
    return []
  }
}

function savePinnedIds(ids: string[]) {
  localStorage.setItem('pinned-sites', JSON.stringify(ids))
}

export default function HomePage() {
  const [sites, setSites] = useState<SiteSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [pinnedIds, setPinnedIds] = useState<string[]>([])

  useEffect(() => {
    setPinnedIds(getPinnedIds())
    getSites()
      .then(setSites)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAddSite = (site: SiteSummary) => {
    setSites((prev) => [site, ...prev])
  }

  const handleDeleteSite = async (siteId: string) => {
    try {
      await deleteSite(siteId)
      setSites((prev) => prev.filter((s) => s.id !== siteId))
      const newPinned = pinnedIds.filter((id) => id !== siteId)
      setPinnedIds(newPinned)
      savePinnedIds(newPinned)
    } catch (err) {
      console.error('Failed to delete site:', err)
    }
  }

  const handleTogglePin = (siteId: string) => {
    const newPinned = pinnedIds.includes(siteId)
      ? pinnedIds.filter((id) => id !== siteId)
      : [...pinnedIds, siteId]
    setPinnedIds(newPinned)
    savePinnedIds(newPinned)
  }

  const filteredSites = sites
    .filter((site) =>
      site.domain.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id)
      const bPinned = pinnedIds.includes(b.id)
      if (aPinned !== bPinned) return aPinned ? -1 : 1
      return b.visitors24h - a.visitors24h
    })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-0"
            />
          </div>
          <AddSiteDialog onAdd={handleAddSite} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading sites...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                pinned={pinnedIds.includes(site.id)}
                onDelete={handleDeleteSite}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}

        {!loading && filteredSites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'No sites found matching your search.' : 'No sites yet. Add your first website to start tracking analytics.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
