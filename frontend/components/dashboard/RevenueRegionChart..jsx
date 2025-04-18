import dynamic from "next/dynamic";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const MapChart = dynamic(() => import("@/components/MapChart"), { ssr: false });

export default function RevenueRegionChart({ summary, isDarkMode, countryRegionMap, regionMapColors }) {
  const revenueData = summary?.revenue_by_region ?? [];

  return (
    <div className="card bg-white rounded-lg dark:bg-gray-800 shadow p-4 dark:shadow-slate-900">
      <h3 className="text-md font-semibold mb-4 dark:text-slate-200">Revenue By Region</h3>

      <div className="flex flex-col sm:relative gap-4 sm:h-[310px]">
        <div className="w-full h-[200px] sm:h-[300px] sm:absolute">
          <MapChart countryRegionMap={countryRegionMap} regionMapColors={regionMapColors} />
        </div>

        <div className="w-full h-[200px] sm:w-[40%] sm:relative sm:bottom-[-100px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={revenueData}
              barCategoryGap={12}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="region"
                type="category"
                width={100}
                tick={{
                  fontSize: 12,
                  fontWeight: 600,
                  fill: isDarkMode ? "#ffffff" : "#374151"
                }}
              />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={regionMapColors[entry.region]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
