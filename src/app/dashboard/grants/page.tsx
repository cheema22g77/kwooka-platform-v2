'use client'

import { useState } from 'react'
import Link from 'next/link'

// Australian grants data - sourced from business.gov.au and GrantConnect
const sampleGrants = [
  {
    id: '1',
    title: 'Export Market Development Grant (EMDG)',
    provider: 'Austrade',
    funding_amount_min: 20000,
    funding_amount_max: 80000,
    close_date: '2026-06-30',
    status: 'open',
    category: 'Export',
    match_score: 92,
    description: 'Matched funding for Australian SMEs to market and promote goods and services globally. Tier 1 ($30k), Tier 2 ($50k), or Tier 3 ($80k) based on export readiness.',
  },
  {
    id: '2',
    title: 'R&D Tax Incentive',
    provider: 'ATO / Department of Industry',
    funding_amount_min: 20000,
    funding_amount_max: 150000000,
    close_date: '2026-04-30',
    status: 'open',
    category: 'Innovation',
    match_score: 88,
    description: 'Tax offset for eligible R&D activities. Refundable 43.5% offset for companies under $20M turnover, non-refundable offset for larger companies.',
  },
  {
    id: '3',
    title: 'Energy Efficiency Grants for SMEs',
    provider: 'Department of Climate Change',
    funding_amount_min: 10000,
    funding_amount_max: 25000,
    close_date: '2026-03-31',
    status: 'open',
    category: 'Sustainability',
    match_score: 85,
    description: 'Grants to help small and medium businesses upgrade equipment, improve energy management, and reduce energy costs and emissions.',
  },
  {
    id: '4',
    title: 'Business Growth and Impact Grants',
    provider: 'City of Melbourne',
    funding_amount_min: 10000,
    funding_amount_max: 50000,
    close_date: '2026-02-14',
    status: 'closing_soon',
    category: 'Regional',
    match_score: 78,
    description: 'Supporting creation and growth of small businesses that bring innovation, diversity and economic opportunities to the City of Melbourne.',
  },
  {
    id: '5',
    title: 'Support for NDIS Providers Grant',
    provider: 'NDIS Quality and Safeguards Commission',
    funding_amount_min: 100000,
    funding_amount_max: 800000,
    close_date: '2026-05-15',
    status: 'open',
    category: 'Healthcare',
    match_score: 95,
    description: 'Funding for activities that support NDIS providers to increase quality and safeguarding. Focus on education, training and consulting with participants.',
  },
  {
    id: '6',
    title: 'NSW Small Business Recovery Grant',
    provider: 'Service NSW',
    funding_amount_min: 5000,
    funding_amount_max: 25000,
    close_date: '2026-03-15',
    status: 'open',
    category: 'Recovery',
    match_score: 72,
    description: 'Recovery grants for small businesses affected by natural disasters. Covers clean-up, repairs, and reopening costs with initial $5,000 for immediate needs.',
  },
  {
    id: '7',
    title: 'Powering Business Grants',
    provider: 'SA Office for Small Business',
    funding_amount_min: 2500,
    funding_amount_max: 75000,
    close_date: '2026-04-30',
    status: 'open',
    category: 'Sustainability',
    match_score: 81,
    description: 'Supporting South Australian SMEs and not-for-profits to invest in energy efficient equipment to reduce and manage energy use and costs.',
  },
  {
    id: '8',
    title: 'Apprentice Wage Subsidy',
    provider: 'Department of Employment',
    funding_amount_min: 5000,
    funding_amount_max: 10000,
    close_date: '2026-06-30',
    status: 'open',
    category: 'Employment',
    match_score: 68,
    description: 'Wage subsidies for businesses that hire eligible apprentices into ongoing jobs. Priority given to housing construction apprentices.',
  },
  {
    id: '9',
    title: 'Australian Small Business Advisory Services',
    provider: 'Department of Industry',
    funding_amount_min: 0,
    funding_amount_max: 25136000,
    close_date: '2026-02-28',
    status: 'closing_soon',
    category: 'Advisory',
    match_score: 74,
    description: 'Digital solutions program providing advisory services to help small businesses adopt digital technologies and improve operations.',
  },
  {
    id: '10',
    title: 'Instant Asset Write-Off',
    provider: 'Australian Taxation Office',
    funding_amount_min: 1000,
    funding_amount_max: 20000,
    close_date: '2026-06-30',
    status: 'open',
    category: 'Tax',
    match_score: 90,
    description: 'Immediate tax deductions on eligible asset purchases up to $20,000 for small businesses. Extended through mid-2026 to ease cash flow.',
  },
  {
    id: '11',
    title: 'Regional Growth Fund',
    provider: 'Department of Infrastructure',
    funding_amount_min: 25000,
    funding_amount_max: 100000,
    close_date: '2026-04-15',
    status: 'open',
    category: 'Regional',
    match_score: 82,
    description: 'Supporting economic development in regional Australia. Priority for projects creating sustainable employment and diversifying regional economies.',
  },
  {
    id: '12',
    title: 'NDIS Quality Supports Program',
    provider: 'NDIA',
    funding_amount_min: 50000,
    funding_amount_max: 2000000,
    close_date: '2026-07-31',
    status: 'open',
    category: 'Healthcare',
    match_score: 91,
    description: 'Grants for therapy providers, SIL providers and support coordinators to pilot quality service delivery models. Over $45 million available.',
  },
]

const categories = ['All', 'Export', 'Innovation', 'Sustainability', 'Healthcare', 'Regional', 'Recovery', 'Employment', 'Tax', 'Advisory']

export default function GrantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'amount'>('match')

  const filteredGrants = sampleGrants
    .filter(grant => {
      const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.provider.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || grant.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.match_score - a.match_score
      if (sortBy === 'deadline') return new Date(a.close_date).getTime() - new Date(b.close_date).getTime()
      if (sortBy === 'amount') return b.funding_amount_max - a.funding_amount_max
      return 0
    })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getDaysUntilClose = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-earth-800">Grant Discovery</h1>
          <p className="text-earth-500 mt-1">Find and apply for grants matched to your business</p>
        </div>
        <Link
          href="/dashboard/grants/applications"
          className="px-4 py-2 bg-white border border-earth-200 rounded-xl text-earth-700 hover:bg-earth-50 transition-colors text-sm font-medium"
        >
          My Applications
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-earth-100 mb-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400">🔍</span>
            <input
              type="text"
              placeholder="Search grants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-earth-200 rounded-xl focus:ring-2 focus:ring-kwooka-500 focus:border-transparent bg-cream/30"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('Export')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Export'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Export
          </button>
          <button
            onClick={() => setSelectedCategory('Innovation')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Innovation'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Innovation
          </button>
          <button
            onClick={() => setSelectedCategory('Sustainability')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Sustainability'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sustainability
          </button>
          <button
            onClick={() => setSelectedCategory('Healthcare')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Healthcare'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Healthcare
          </button>
          <button
            onClick={() => setSelectedCategory('Regional')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Regional'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Regional
          </button>
          <button
            onClick={() => setSelectedCategory('Recovery')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Recovery'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Recovery
          </button>
          <button
            onClick={() => setSelectedCategory('Employment')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Employment'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Employment
          </button>
          <button
            onClick={() => setSelectedCategory('Tax')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Tax'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tax
          </button>
          <button
            onClick={() => setSelectedCategory('Advisory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'Advisory'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Advisory
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-earth-100">
          <span className="text-sm text-earth-500">Sort by:</span>
          <button
            onClick={() => setSortBy('match')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'match' ? 'bg-ochre-100 text-ochre-700' : 'text-earth-500 hover:bg-earth-50'
            }`}
          >
            Best Match
          </button>
          <button
            onClick={() => setSortBy('deadline')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'deadline' ? 'bg-ochre-100 text-ochre-700' : 'text-earth-500 hover:bg-earth-50'
            }`}
          >
            Closing Soon
          </button>
          <button
            onClick={() => setSortBy('amount')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'amount' ? 'bg-ochre-100 text-ochre-700' : 'text-earth-500 hover:bg-earth-50'
            }`}
          >
            Highest Amount
          </button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-earth-500 mb-4">{filteredGrants.length} grants found</p>

      {/* Grants List */}
      <div className="space-y-4">
        {filteredGrants.map(grant => {
          const daysLeft = getDaysUntilClose(grant.close_date)
          const isClosingSoon = daysLeft <= 14

          return (
            <Link
              key={grant.id}
              href={`/dashboard/grants/${grant.id}`}
              className="block bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:shadow-md hover:border-kwooka-200 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-ochre-100 text-ochre-700 rounded text-xs font-medium">
                      {grant.category}
                    </span>
                    {isClosingSoon && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium">
                        Closing Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-earth-800 mb-1">{grant.title}</h3>
                  <p className="text-sm text-earth-500 mb-3">{grant.provider}</p>
                  <p className="text-sm text-earth-600 line-clamp-2">{grant.description}</p>
                </div>

                {/* Match Score */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${
                    grant.match_score >= 80 ? 'bg-green-100 text-green-700' :
                    grant.match_score >= 60 ? 'bg-ochre-100 text-ochre-700' :
                    'bg-earth-100 text-earth-600'
                  }`}>
                    {grant.match_score}%
                  </div>
                  <p className="text-xs text-earth-500 mt-1">Match</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-earth-100">
                <div>
                  <p className="text-xs text-earth-500">Funding Amount</p>
                  <p className="text-sm font-semibold text-earth-800">
                    {formatCurrency(grant.funding_amount_min)} - {formatCurrency(grant.funding_amount_max)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-earth-500">Closes</p>
                  <p className={`text-sm font-semibold ${isClosingSoon ? 'text-red-600' : 'text-earth-800'}`}>
                    {formatDate(grant.close_date)} ({daysLeft} days)
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-kwooka-600 text-sm font-medium">View Details →</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filteredGrants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-earth-100">
          <p className="text-earth-500">No grants found matching your criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
            className="mt-2 text-kwooka-600 hover:text-kwooka-700 text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
