import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

export default function DealStatusPie({ dealStatusData }) {
  const pieColors = ["#4f46e5", "#4338ca", "#06b6d4"];

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow p-4 dark:shadow-slate-900">
      <h3 className="text-md font-semibold mb-4 dark:text-slate-200">Deal Status Breakdown</h3>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 sm:h-64">
        
        {/* Pie Chart */}
        <div className="w-full sm:w-1/2 h-40 sm:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dealStatusData.map(entry => ({ name: entry.status, value: entry.count }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
              >
                {dealStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-slate-200">
          {dealStatusData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pieColors[index] }}
              />
              <span>{entry.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
