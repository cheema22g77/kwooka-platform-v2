'use client'

import Link from 'next/link'

// Sample applications data
const applications = [
  {
    id: 'app-1',
    grant_id: '1',
    grant_title: 'Small Business Innovation Grant',
    provider: 'Business Australia',
    status: 'draft',
    progress: 25,
    submitted_at: null,
    deadline: '2025-03-15',
    funding_requested: 35000,
    last_updated: '2025-01-18',
  },
  {
    id: 'app-2',
    grant_id: '4',
    grant_title: 'Digital Transformation Grant',
    provider: 'Tech Council Australia',
    status: 'submitted',
    progress: 100,
    submitted_at: '2025-01-10',
    deadline: '2025-02-14',
    funding_requested: 50000,
    last_updated: '2025-01-10',
  },
  {
    id: 'app-3',
    grant_id: '3',
    grant_title: 'Export Market Development Grant',
    provider: 'Austrade',
    status: 'under_review',
    progress: 100,
    submitted_at: '2024-12-15',
    deadline: '2024-12-31',
    funding_requested: 75000,
    last_updated: '2025-01-05',
  },
]

const savedGrants = [
  {
    id: '2',
    title: 'Regional Growth Fund',
    provider: 'Department of Infrastructure',
    close_date: '2025-02-28',
    match_score: 85,
  },
  {
    id: '5',
    title: 'Sustainability Initiative Fund',
    provider: 'Department of Environment',
    close_date: '2025-05-31',
    match_score: 65,
  },
]

export default function ApplicationsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-earth-100 text-earth-600',
      submitted: 'bg-blue-100 text-blue-600',
      under_review: 'bg-ochre-100 text-ochre-700',
      approved: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600',
    }
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Not Successful',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getDaysUntilDeadline = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-earth-800">My Applications</h1>
          <p className="text-earth-500 mt-1">Track and manage your grant applications</p>
        </div>
        <Link
          href="/dashboard/grants"
          className="px-4 py-2 bg-gradient-to-r from-kwooka-500 to-kwooka-600 hover:from-kwooka-600 hover:to-kwooka-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-kwooka-500/25"
        >
          Find New Grants
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-earth-100">
          <p className="text-2xl font-bold text-earth-800">{applications.length}</p>
          <p className="text-sm text-earth-500">Total Applications</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-earth-100">
          <p className="text-2xl font-bold text-ochre-600">
            {applications.filter(a => a.status === 'draft').length}
          </p>
          <p className="text-sm text-earth-500">In Progress</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-earth-100">
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length}
          </p>
          <p className="text-sm text-earth-500">Awaiting Decision</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-earth-100">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(applications.reduce((sum, a) => sum + a.funding_requested, 0))}
          </p>
          <p className="text-sm text-earth-500">Total Requested</p>
        </div>
      </div>

      {/* Active Applications */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-earth-800 mb-4">Active Applications</h2>
        <div className="space-y-4">
          {applications.map(app => {
            const daysLeft = getDaysUntilDeadline(app.deadline)
            const isUrgent = daysLeft <= 7 && app.status === 'draft'

            return (
              <div
                key={app.id}
                className="bg-white p-5 rounded-2xl border border-earth-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(app.status)}
                      {isUrgent && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium">
                          ⚠️ Due Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-earth-800">{app.grant_title}</h3>
                    <p className="text-sm text-earth-500">{app.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-earth-800">{formatCurrency(app.funding_requested)}</p>
                    <p className="text-xs text-earth-500">Requested</p>
                  </div>
                </div>

                {/* Progress Bar (for drafts) */}
                {app.status === 'draft' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-earth-500">Application Progress</span>
                      <span className="text-earth-700 font-medium">{app.progress}%</span>
                    </div>
                    <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-kwooka-500 to-kwooka-600 rounded-full"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-earth-100">
                  <div className="flex items-center gap-4 text-sm text-earth-500">
                    {app.status === 'draft' ? (
                      <span className={daysLeft <= 7 ? 'text-red-600 font-medium' : ''}>
                        Deadline: {formatDate(app.deadline)} ({daysLeft} days)
                      </span>
                    ) : (
                      <span>Submitted: {formatDate(app.submitted_at!)}</span>
                    )}
                    <span>•</span>
                    <span>Updated: {formatDate(app.last_updated)}</span>
                  </div>
                  <div className="flex gap-2">
                    {app.status === 'draft' ? (
                      <>
                        <Link
                          href={`/dashboard/grants/${app.grant_id}`}
                          className="px-3 py-1.5 text-sm text-earth-600 hover:text-earth-800"
                        >
                          View Grant
                        </Link>
                        <button className="px-3 py-1.5 text-sm bg-kwooka-500 text-white rounded-lg hover:bg-kwooka-600">
                          Continue
                        </button>
                      </>
                    ) : (
                      <Link
                        href={`/dashboard/grants/${app.grant_id}`}
                        className="px-3 py-1.5 text-sm text-kwooka-600 hover:text-kwooka-700 font-medium"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Saved Grants */}
      <div>
        <h2 className="text-lg font-semibold text-earth-800 mb-4">Saved Grants</h2>
        {savedGrants.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {savedGrants.map(grant => (
              <Link
                key={grant.id}
                href={`/dashboard/grants/${grant.id}`}
                className="bg-white p-4 rounded-xl border border-earth-100 hover:shadow-md hover:border-kwooka-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-earth-800">{grant.title}</h3>
                    <p className="text-sm text-earth-500">{grant.provider}</p>
                    <p className="text-sm text-earth-500 mt-2">Closes: {formatDate(grant.close_date)}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                    grant.match_score >= 80 ? 'bg-green-100 text-green-700' :
                    grant.match_score >= 60 ? 'bg-ochre-100 text-ochre-700' :
                    'bg-earth-100 text-earth-600'
                  }`}>
                    {grant.match_score}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-earth-100 text-center">
            <p className="text-earth-500">No saved grants yet.</p>
            <Link href="/dashboard/grants" className="text-kwooka-600 hover:text-kwooka-700 text-sm font-medium">
              Browse available grants
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
