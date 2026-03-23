import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/analytics/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { currentUser } from '@/lib/user-context'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sites
        </Link>

        <div className="flex items-center gap-5">
          <Avatar className="w-16 h-16">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="text-xl font-bold">{currentUser.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{currentUser.email}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
