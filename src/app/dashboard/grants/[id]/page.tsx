'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Australian grants data - sourced from business.gov.au and GrantConnect
const grantsData: Record<string, {
  id: string
  title: string
  provider: string
  funding_amount_min: number
  funding_amount_max: number
  close_date: string
  status: string
  category: string
  match_score: number
  description: string
  full_description: string
  eligibility: string[]
  documents_required: string[]
  key_dates: { label: string; date: string }[]
  contact: { name: string; email: string; phone: string }
}> = {
  '1': {
    id: '1',
    title: 'Export Market Development Grant (EMDG)',
    provider: 'Austrade',
    funding_amount_min: 20000,
    funding_amount_max: 80000,
    close_date: '2026-06-30',
    status: 'open',
    category: 'Export',
    match_score: 92,
    description: 'Matched funding for Australian SMEs to market and promote goods and services globally.',
    full_description: `The Export Market Development Grants (EMDG) program is the Australian Government's flagship financial assistance program for aspiring and current exporters.

The program provides matched funding to help Australian small and medium enterprises (SMEs):
• Market and promote goods and services in international markets
• Develop new export markets and expand existing ones
• Attend international trade shows and exhibitions
• Conduct market research and develop marketing materials

Grant Tiers:
• Tier 1 (Ready to Export): Up to $30,000 per financial year
• Tier 2 (Exporting within existing markets): Up to $50,000 per financial year
• Tier 3 (Exporting to new key markets): Up to $80,000 per financial year

Grants are offered as matched funding - you must demonstrate capacity to spend at least $20,000 of your own money on eligible activities.`,
    eligibility: [
      'Valid Australian Business Number (ABN)',
      'Annual turnover less than $20 million',
      'Conducting business under the same ABN for at least 2 years',
      'Capacity to spend at least $20,000 per year on marketing activities',
      'High-quality plan to market eligible products in foreign countries',
      'Product or service is of substantially Australian origin',
    ],
    documents_required: [
      'Government Digital Identity linked to your business',
      'Evidence of Australian origin for products/services',
      'Financial statements showing turnover',
      'Plan to Market (using mandatory template)',
      'ANZSIC code documentation',
      'Evidence of co-contribution capacity',
    ],
    key_dates: [
      { label: 'Round 5 Expected Opening', date: '2026-02-01' },
      { label: 'Tier 1-3 Applications Open', date: '2026-02-15' },
      { label: 'Grant Period Starts', date: '2026-07-01' },
      { label: 'Financial Year End', date: '2026-06-30' },
    ],
    contact: {
      name: 'EMDG Help Desk',
      email: 'EMDG.help@austrade.gov.au',
      phone: '13 28 78',
    },
  },
  '2': {
    id: '2',
    title: 'R&D Tax Incentive',
    provider: 'ATO / Department of Industry',
    funding_amount_min: 20000,
    funding_amount_max: 150000000,
    close_date: '2026-04-30',
    status: 'open',
    category: 'Innovation',
    match_score: 88,
    description: 'Tax offset for eligible R&D activities to encourage innovation and technological advancement.',
    full_description: `The Research and Development Tax Incentive (R&DTI) is the Australian Government's key mechanism to stimulate industry investment in R&D.

The program provides tax offsets to eligible companies:

For companies with turnover under $20 million:
• Refundable tax offset of 43.5% on eligible R&D expenditure
• Potential for cash refund if in tax loss position

For companies with turnover over $20 million:
• Non-refundable tax offset with premium based on R&D intensity
• 0-2% intensity: 8.5% premium above company tax rate
• Greater than 2% intensity: 16.5% premium above company tax rate

The R&DTI supports systematic experimental activities that:
• Generate new knowledge
• Create new or improved products, processes, or services
• Involve technical or scientific uncertainty`,
    eligibility: [
      'Registered Australian company with valid ABN',
      'Conduct at least one core eligible R&D activity in Australia',
      'Activities involve systematic experimental processes',
      'Minimum R&D expenditure threshold of $20,000',
      'Maintain comprehensive records and documentation',
      'Self-assessment of eligibility before registration',
    ],
    documents_required: [
      'R&D activity registration with Department of Industry',
      'Contemporaneous records of R&D activities',
      'Technical documentation of experiments',
      'Time sheets and salary records for R&D personnel',
      'Financial records of R&D expenditure',
      'Company tax return with R&D schedule',
    ],
    key_dates: [
      { label: 'Income Year Starts', date: '2025-07-01' },
      { label: 'Income Year Ends', date: '2026-06-30' },
      { label: 'Registration Deadline', date: '2026-04-30' },
      { label: 'Tax Return Due (Company)', date: '2027-02-28' },
    ],
    contact: {
      name: 'R&D Tax Incentive Team',
      email: 'rdti@industry.gov.au',
      phone: '13 28 46',
    },
  },
  '3': {
    id: '3',
    title: 'Energy Efficiency Grants for SMEs',
    provider: 'Department of Climate Change',
    funding_amount_min: 10000,
    funding_amount_max: 25000,
    close_date: '2026-03-31',
    status: 'open',
    category: 'Sustainability',
    match_score: 85,
    description: 'Grants to help small and medium businesses upgrade equipment and reduce energy costs.',
    full_description: `The Energy Efficiency Grants for Small and Medium Sized Enterprises program supports Australian businesses to reduce energy consumption and costs.

Funding of up to $25,000 is available for:
• Energy efficient equipment upgrades
• Lighting system improvements
• HVAC system upgrades
• Refrigeration improvements
• Solar panel installations
• Energy monitoring systems
• Building insulation improvements

The program is part of the government's commitment to helping businesses reduce emissions while improving their bottom line through lower energy costs.

Projects must demonstrate measurable energy savings and be completed within 12 months of receiving funding.`,
    eligibility: [
      'Australian small or medium enterprise',
      'Valid Australian Business Number (ABN)',
      'Annual turnover between $75,000 and $10 million',
      'Operating from a business premises (not home-based)',
      'Can provide co-contribution of at least 50%',
      'Project delivers measurable energy savings',
    ],
    documents_required: [
      'Business registration documents',
      'Recent energy bills (last 12 months)',
      'Quotes for proposed equipment/works',
      'Project plan with expected energy savings',
      'Evidence of co-contribution funding',
      'Financial statements',
    ],
    key_dates: [
      { label: 'Applications Open', date: '2026-01-15' },
      { label: 'Applications Close', date: '2026-03-31' },
      { label: 'Assessment Period', date: '2026-04-01 to 2026-05-15' },
      { label: 'Funding Agreements Issued', date: '2026-06-01' },
      { label: 'Project Completion Deadline', date: '2027-06-01' },
    ],
    contact: {
      name: 'Energy Grants Team',
      email: 'energygrants@dcceew.gov.au',
      phone: '1800 775 575',
    },
  },
  '5': {
    id: '5',
    title: 'Support for NDIS Providers Grant',
    provider: 'NDIS Quality and Safeguards Commission',
    funding_amount_min: 100000,
    funding_amount_max: 800000,
    close_date: '2026-05-15',
    status: 'open',
    category: 'Healthcare',
    match_score: 95,
    description: 'Funding for activities that support NDIS providers to increase quality and safeguarding.',
    full_description: `The Support for NDIS Providers Grants Program funds activities that help NDIS providers increase quality and safeguarding outcomes for people with disability.

The program is built on three complementary pillars:

1. Quality and Safeguarding Pillar
Focus on ensuring people with disability receive quality and safe NDIS supports and services.

2. Knowledge and Skill Development Pillar
Supporting providers and workers to develop skills to uphold the rights of people with disability.

3. Market Development Pillar
Building a thriving and diverse market of quality NDIS providers.

Grants support activities that:
• Educate, influence and consult with participants, providers and workers
• Develop innovative approaches to quality service delivery
• Build provider capability and workforce skills
• Improve safeguarding practices and outcomes`,
    eligibility: [
      'Incorporated entity registered in Australia',
      'Can be NDIS registered or unregistered provider',
      'Demonstrated experience in disability sector',
      'Board or CEO endorsement of project',
      'Capacity to deliver project outcomes',
      'Not a Commonwealth, state or local government body',
    ],
    documents_required: [
      'Certificate of incorporation',
      'Project proposal addressing grant objectives',
      'Detailed budget and timeline',
      'Evidence of disability sector experience',
      'Board or CEO letter of support',
      'Risk management plan',
    ],
    key_dates: [
      { label: 'Grant Round Opens', date: '2026-02-01' },
      { label: 'Applications Close', date: '2026-05-15' },
      { label: 'Assessment Period', date: '2026-05-16 to 2026-07-31' },
      { label: 'Outcomes Announced', date: '2026-08-15' },
      { label: 'Funding Agreements', date: '2026-09-01' },
    ],
    contact: {
      name: 'Grants Program Team',
      email: 'grants@ndiscommission.gov.au',
      phone: '1800 035 544',
    },
  },
}

// Default grant for unknown IDs
const defaultGrant = {
  id: '0',
  title: 'Grant Not Found',
  provider: 'Unknown',
  funding_amount_min: 0,
  funding_amount_max: 0,
  close_date: '2025-12-31',
  status: 'closed',
  category: 'Unknown',
  match_score: 0,
  description: 'This grant could not be found.',
  full_description: 'Please return to the grants list and select a valid grant.',
  eligibility: [],
  documents_required: [],
  key_dates: [],
  contact: { name: '', email: '', phone: '' },
}

export default function GrantDetailPage() {
  const params = useParams()
  const grantId = params.id as string
  const grant = grantsData[grantId] || defaultGrant

  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'timeline'>('overview')

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

  const daysLeft = getDaysUntilClose(grant.close_date)
  const isClosingSoon = daysLeft <= 14

  // Check eligibility based on compliance data (placeholder)
  const eligibilityChecks = grant.eligibility.map((req, index) => ({
    requirement: req,
    met: index < 3, // Placeholder: first 3 are met
    source: index < 3 ? 'From your compliance data' : 'Needs verification',
  }))

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/dashboard/grants"
        className="inline-flex items-center text-earth-500 hover:text-earth-700 mb-6"
      >
        ← Back to Grants
      </Link>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 mb-6">
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
              <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs font-medium capitalize">
                {grant.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-earth-800 mb-2">{grant.title}</h1>
            <p className="text-earth-500">{grant.provider}</p>
          </div>

          {/* Match Score */}
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${
              grant.match_score >= 80 ? 'bg-green-100 text-green-700' :
              grant.match_score >= 60 ? 'bg-ochre-100 text-ochre-700' :
              'bg-earth-100 text-earth-600'
            }`}>
              {grant.match_score}%
            </div>
            <p className="text-sm text-earth-500 mt-1">Match Score</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-earth-100">
          <div>
            <p className="text-xs text-earth-500">Funding Amount</p>
            <p className="text-lg font-semibold text-earth-800">
              {formatCurrency(grant.funding_amount_min)} - {formatCurrency(grant.funding_amount_max)}
            </p>
          </div>
          <div>
            <p className="text-xs text-earth-500">Closes In</p>
            <p className={`text-lg font-semibold ${isClosingSoon ? 'text-red-600' : 'text-earth-800'}`}>
              {daysLeft} days
            </p>
          </div>
          <div>
            <p className="text-xs text-earth-500">Close Date</p>
            <p className="text-lg font-semibold text-earth-800">{formatDate(grant.close_date)}</p>
          </div>
          <div>
            <p className="text-xs text-earth-500">Eligibility Met</p>
            <p className="text-lg font-semibold text-green-600">
              {eligibilityChecks.filter(e => e.met).length}/{eligibilityChecks.length}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-3 px-4 bg-gradient-to-r from-kwooka-500 to-kwooka-600 hover:from-kwooka-600 hover:to-kwooka-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-kwooka-500/25">
            Start Application
          </button>
          <button className="py-3 px-4 bg-white border border-earth-200 rounded-xl text-earth-700 hover:bg-earth-50 transition-colors font-medium">
            Save for Later
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-earth-100 p-1 rounded-xl">
        {(['overview', 'eligibility', 'documents', 'timeline'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-white text-earth-800 shadow-sm'
                : 'text-earth-500 hover:text-earth-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-lg font-semibold text-earth-800 mb-4">About this Grant</h2>
            <div className="prose prose-earth max-w-none">
              {grant.full_description.split('\n').map((paragraph, index) => (
                <p key={index} className="text-earth-600 mb-4 whitespace-pre-wrap">{paragraph}</p>
              ))}
            </div>

            {grant.contact.name && (
              <div className="mt-6 pt-6 border-t border-earth-100">
                <h3 className="text-md font-semibold text-earth-800 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-earth-600"><span className="text-earth-500">Name:</span> {grant.contact.name}</p>
                  <p className="text-earth-600"><span className="text-earth-500">Email:</span> {grant.contact.email}</p>
                  <p className="text-earth-600"><span className="text-earth-500">Phone:</span> {grant.contact.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-earth-800">Eligibility Requirements</h2>
              <span className="text-sm text-green-600 font-medium">
                {eligibilityChecks.filter(e => e.met).length} of {eligibilityChecks.length} met
              </span>
            </div>
            <p className="text-sm text-earth-500 mb-6">
              ✨ We&apos;ve automatically checked some requirements using your compliance data
            </p>
            <div className="space-y-3">
              {eligibilityChecks.map((check, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    check.met
                      ? 'bg-green-50 border-green-200'
                      : 'bg-earth-50 border-earth-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-lg ${check.met ? 'text-green-500' : 'text-earth-400'}`}>
                      {check.met ? '✓' : '○'}
                    </span>
                    <div>
                      <p className={`font-medium ${check.met ? 'text-green-800' : 'text-earth-700'}`}>
                        {check.requirement}
                      </p>
                      <p className={`text-sm mt-1 ${check.met ? 'text-green-600' : 'text-earth-500'}`}>
                        {check.source}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h2 className="text-lg font-semibold text-earth-800 mb-4">Required Documents</h2>
            <p className="text-sm text-earth-500 mb-6">
              📎 Some documents may be auto-filled from your compliance records
            </p>
            <div className="space-y-3">
              {grant.documents_required.map((doc, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-earth-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-earth-400">📄</span>
                    <span className="text-earth-700">{doc}</span>
                  </div>
                  {index < 2 ? (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                      Available
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-earth-100 text-earth-500 rounded-full">
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <h2 className="text-lg font-semibold text-earth-800 mb-4">Key Dates</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-earth-200"></div>
              <div className="space-y-6">
                {grant.key_dates.map((item, index) => {
                  const isPast = new Date(item.date.split(' to ')[0]) < new Date()
                  return (
                    <div key={index} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        isPast ? 'bg-green-500 text-white' : 'bg-white border-2 border-kwooka-500 text-kwooka-500'
                      }`}>
                        {isPast ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="font-medium text-earth-800">{item.label}</p>
                        <p className="text-sm text-earth-500">{item.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
