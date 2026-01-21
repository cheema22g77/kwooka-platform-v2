import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kwooka Platform',
  description: 'Grants, Compliance and Council Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
