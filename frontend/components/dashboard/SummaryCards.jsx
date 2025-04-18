export default function SummaryCards({summary}){
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-slate-900 p-4">
        <h3 className="text-sm text-gray-500 dark:text-slate-300">Total Revenue</h3>
        <p className="text-2xl font-bold dark:text-slate-200">${summary?.total_revenue?.toLocaleString() || "0"}</p>
      </div>
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4 dark:shadow-slate-900">
        <h3 className="text-sm text-gray-500 dark:text-slate-300">Pipeline (In Progress)</h3>
        <p className="text-2xl font-bold dark:text-slate-200">
          ${summary?.in_progress_revenue?.toLocaleString() || "0"}
        </p>
      </div>
    </div>
    )
}