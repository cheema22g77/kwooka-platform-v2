'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Grants', href: '/dashboard/grants', icon: '💰' },
  { name: 'Compliance', href: '/dashboard/compliance', icon: '📋' },
  { name: 'Council', href: '/dashboard/council', icon: '🏛️' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="/images/kwooka_mascot_clean.png"
            alt="Kwooka"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Kwooka</h1>
            <p className="text-xs text-gray-500">Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-gray-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <span className="text-lg">🚪</span>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )
}
