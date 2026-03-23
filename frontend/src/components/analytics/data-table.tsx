'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DataTableProps<T> {
  tabs: {
    value: string
    label: string
  }[]
  data: T[]
  columns: {
    key: keyof T
    header: string
    render?: (value: T[keyof T], item: T) => React.ReactNode
  }[]
  defaultTab?: string
}

export function DataTable<T extends Record<string, unknown>>({
  tabs,
  data,
  columns,
  defaultTab,
}: DataTableProps<T>) {
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.value} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-transparent p-0 h-auto gap-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-0 py-1 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none rounded-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Expand className="w-4 h-4" />
        </Button>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground uppercase tracking-wider">
              {columns.map((col) => (
                <span
                  key={String(col.key)}
                  className={col.key === columns[0].key ? 'flex-1' : 'w-16 text-right'}
                >
                  {col.header}
                </span>
              ))}
            </div>
            {data.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-secondary/50 transition-colors"
              >
                {columns.map((col) => (
                  <span
                    key={String(col.key)}
                    className={`text-sm ${
                      col.key === columns[0].key
                        ? 'flex-1 text-foreground truncate pr-4'
                        : 'w-16 text-right text-muted-foreground'
                    }`}
                  >
                    {col.render
                      ? col.render(item[col.key], item)
                      : String(item[col.key])}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
