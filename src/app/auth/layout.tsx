import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/kwooka_mascot_clean.png"
              alt="Kwooka Mascot"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
            <div>
              <span className="text-2xl font-bold tracking-tight">Kwooka</span>
              <span className="block text-xs text-white/60 uppercase tracking-widest">
                Platform
              </span>
            </div>
          </Link>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Large Mascot */}
            <div className="flex justify-center">
              <Image
                src="/images/kwooka_mascot_clean.png"
                alt="Kwooka Mascot"
                width={280}
                height={280}
                className="drop-shadow-2xl"
              />
            </div>
            
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold leading-tight">
                Grants, Compliance
                <br />
                <span className="text-amber-400">& Council Solutions</span>
              </h1>
              <p className="text-lg text-white/70 max-w-md mx-auto">
                One unified platform for grant discovery, compliance management, 
                and council services — powered by AI.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Grants', value: '🎯' },
                { label: 'Compliance', value: '✓' },
                { label: 'Council', value: '🏛️' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
                  <div className="text-3xl mb-2">{stat.value}</div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} Kwooka. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}