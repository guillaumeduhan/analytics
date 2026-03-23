'use client'

import { useState } from 'react'
import { Plus, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SiteSummary } from '@/lib/types'

interface AddSiteDialogProps {
  onAdd: (site: SiteSummary) => void
}

// Validates that the string looks like a real domain
function isValidDomain(value: string): boolean {
  const cleaned = value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/
  return domainRegex.test(cleaned)
}

function cleanDomain(value: string): string {
  return value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase().trim()
}

export function AddSiteDialog({ onAdd }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false)
  const [domain, setDomain] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [isLoading, setIsLoading] = useState(false)

  const handleDomainChange = (value: string) => {
    setDomain(value)
    if (!value) {
      setStatus('idle')
      return
    }
    setStatus('checking')
    // Small debounce to avoid flickering on every keystroke
    setTimeout(() => {
      setStatus(isValidDomain(value) ? 'valid' : 'invalid')
    }, 400)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'valid') return
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const cleaned = cleanDomain(domain)
    const newSite: SiteSummary = {
      id: Date.now().toString(),
      domain: cleaned,
      name: cleaned,
      public: false,
      created_at: new Date().toISOString(),
      visitors24h: 0,
      trend: 0,
      sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }

    onAdd(newSite)
    setDomain('')
    setStatus('idle')
    setIsLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setDomain(''); setStatus('idle') } }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new website</DialogTitle>
          <DialogDescription>
            Enter your website domain to start tracking analytics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="domain">Website domain</Label>
            <div className="relative">
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                disabled={isLoading}
                className="bg-secondary border-0 pr-9"
              />
              {status === 'checking' && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
              )}
              {status === 'valid' && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
              )}
              {status === 'invalid' && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
              )}
            </div>
            {status === 'invalid' && (
              <p className="text-xs text-destructive">
                Please enter a valid domain, e.g. example.com
              </p>
            )}
            {status === 'idle' && (
              <p className="text-xs text-muted-foreground">
                Enter your domain without https:// or www.
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={status !== 'valid' || isLoading}>
              {isLoading ? 'Adding...' : 'Add website'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
