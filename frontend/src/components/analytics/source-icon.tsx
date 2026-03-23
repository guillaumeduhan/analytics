'use client'

import { Globe, Linkedin, Twitter, FileText, Search, Chrome, Smartphone, Monitor } from 'lucide-react'

interface SourceIconProps {
  type: string
  className?: string
}

export function SourceIcon({ type, className = 'w-4 h-4' }: SourceIconProps) {
  const normalizedType = type.toLowerCase()

  if (normalizedType === 'direct' || normalizedType.includes('direct')) {
    return <Search className={className} />
  }
  if (normalizedType === 'linkedin' || normalizedType.includes('linkedin')) {
    return <Linkedin className={className} />
  }
  if (normalizedType === 'twitter' || normalizedType.includes('twitter')) {
    return <Twitter className={className} />
  }
  if (normalizedType === 'medium' || normalizedType.includes('medium')) {
    return <FileText className={className} />
  }
  if (normalizedType === 'chrome' || normalizedType.includes('chrome')) {
    return <Chrome className={className} />
  }
  if (normalizedType === 'mobile' || normalizedType.includes('mobile')) {
    return <Smartphone className={className} />
  }
  if (normalizedType === 'desktop' || normalizedType.includes('desktop')) {
    return <Monitor className={className} />
  }

  return <Globe className={className} />
}
