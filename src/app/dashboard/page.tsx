export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-earth-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="text-lg font-semibold text-earth-800">Grants</h3>
          <p className="text-earth-500 text-sm mt-1">Find and apply for grants</p>
          <p className="text-2xl font-bold text-kwooka-600 mt-3">0 matches</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="text-lg font-semibold text-earth-800">Compliance</h3>
          <p className="text-earth-500 text-sm mt-1">Track compliance status</p>
          <p className="text-2xl font-bold text-green-600 mt-3">--% compliant</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🏛️</div>
          <h3 className="text-lg font-semibold text-earth-800">Council</h3>
          <p className="text-earth-500 text-sm mt-1">Manage council relationships</p>
          <p className="text-2xl font-bold text-ochre-600 mt-3">0 permits</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
        <h2 className="text-lg font-semibold text-earth-800 mb-4">Recent Activity</h2>
        <p className="text-earth-500">No recent activity. Start by completing your profile!</p>
      </div>
    </div>
  )
}
