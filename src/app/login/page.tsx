'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-orange-50 to-ochre-100">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-ochre-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/kwooka_mascot_clean.png"
              alt="Kwooka Mascot"
              width={100}
              height={100}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-earth-800">Kwooka</h1>
          <p className="text-earth-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-kwooka-500 focus:border-transparent bg-cream/30"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-kwooka-500 focus:border-transparent bg-cream/30"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-kwooka-500 to-kwooka-600 hover:from-kwooka-600 hover:to-kwooka-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-kwooka-500/25"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-earth-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-kwooka-600 hover:text-kwooka-700 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
