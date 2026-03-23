'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GoalData } from '@/lib/types'

interface GoalsTableProps {
  data: GoalData[]
}

export function GoalsTable({ data }: GoalsTableProps) {
  return (
    <Tabs defaultValue="goals" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-transparent p-0 h-auto gap-4">
          {['GOALS', 'PROPERTIES', 'FUNNELS'].map((tab) => (
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

      <TabsContent value="goals" className="mt-0">
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground uppercase tracking-wider">
            <span className="flex-1">Goal</span>
            <span className="w-16 text-right">Uniques</span>
            <span className="w-16 text-right">Total</span>
            <span className="w-16 text-right">CR</span>
          </div>
          {data.map((goal, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-secondary/50"
            >
              <span className="flex-1 text-sm text-foreground">{goal.name}</span>
              <span className="w-16 text-right text-sm text-muted-foreground">
                {goal.uniques}
              </span>
              <span className="w-16 text-right text-sm text-muted-foreground">
                {goal.total}
              </span>
              <span className="w-16 text-right text-sm text-muted-foreground">
                {goal.cr}%
              </span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="properties" className="mt-0">
        <div className="text-sm text-muted-foreground text-center py-8">
          No custom properties tracked
        </div>
      </TabsContent>

      <TabsContent value="funnels" className="mt-0">
        <div className="text-sm text-muted-foreground text-center py-8">
          No funnels configured
        </div>
      </TabsContent>
    </Tabs>
  )
}
