import EyeIcon from "@/components/icons/EyeIcon";

export default function SalesRepsTable({
    salesReps,
    regionMapColors,
    setSelectedRep,
    selectedTooltip,
    tooltipPosition,
    setSelectedTooltip,
    setTooltipPosition,
  }) {
  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 dark:shadow-slate-900">
      <h3 className="text-md font-semibold mb-4 dark:text-slate-200">Sales Reps</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm dark:text-slate-300 border-separate border-spacing-x-4 border-spacing-y-2 sm:border-spacing-x-0">
          <thead className="whitespace-nowrap">
            <tr className="text-left text-gray-500 dark:text-slate-200 p-1">
              <th className="py-2">Name</th>
              <th>Region</th>
              <th>Deals Won</th>
              <th>Client</th>
              <th className="sticky right-0 bg-white dark:bg-gray-800 z-10">More</th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {salesReps.map((rep, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer">
                <td className="py-2 font-semibold">{rep.name}</td>
                <td>
                  <span
                    className="px-2 py-1 text-xs rounded-full font-semibold text-white"
                    style={{ backgroundColor: regionMapColors[rep.region] || '#9CA3AF' }}
                  >
                    {rep.region}
                  </span>
                </td>
                <td>${rep.deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</td>
                <td>{rep.clients.length}</td>
                <td className="sticky right-0 bg-white dark:bg-gray-800 z-10">
                  <div className="group relative">
                    <button
                      className="hover:bg-[#0F1B2B]/10 p-2 rounded-md transition duration-200 ease-in-out"
                      onClick={() => setSelectedRep(rep)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPosition({ x: rect.right + 10, y: rect.top + rect.height / 2 });
                        setSelectedTooltip(rep.name);
                      }}
                      onMouseLeave={() => setSelectedTooltip(null)}
                    >
                      <EyeIcon className="w-6 h-6 text-gray-700 dark:text-slate-300" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTooltip && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 text-[#0F1B2B] dark:text-white text-xs px-3 py-1 rounded-md shadow whitespace-nowrap"
          style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
        >
          View {selectedTooltip}
        </div>
      )}

    </div>
  );
}
