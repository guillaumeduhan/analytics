'use client'

export interface User {
  name: string
  email: string
  avatar: string
  initials: string
}

const DEFAULT_USER: User = {
  name: 'Guillaume Duhan',
  email: 'contact@guillaume.ceo',
  avatar: 'https://avatars.githubusercontent.com/u/guillaumeduhan?v=4',
  initials: 'GD',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getUser(): User {
  if (typeof window === 'undefined') return DEFAULT_USER
  try {
    const stored = localStorage.getItem('user-profile')
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_USER
}

export function saveUser(user: User) {
  localStorage.setItem('user-profile', JSON.stringify(user))
}

export function updateUser(updates: { name?: string; email?: string }): User {
  const current = getUser()
  const updated: User = {
    ...current,
    ...updates,
    initials: updates.name ? getInitials(updates.name) : current.initials,
  }
  saveUser(updated)
  return updated
}

// Keep for backward compat in static contexts
export const currentUser = DEFAULT_USER
