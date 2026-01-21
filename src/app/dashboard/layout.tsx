'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { SectorProvider } from '@/contexts/sector-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SectorProvider>
      <div className="min-h-screen flex bg-gradient-to-br from-cream via-orange-50/30 to-ochre-50">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </SectorProvider>
  )
}
