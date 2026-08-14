import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

const weeklyData = [
  { day: "Mon", risk: 18, avg: 22 },
  { day: "Tue", risk: 26, avg: 24 },
  { day: "Wed", risk: 21, avg: 23 },
  { day: "Thu", risk: 34, avg: 26 },
  { day: "Fri", risk: 29, avg: 27 },
  { day: "Sat", risk: 38, avg: 29 },
  { day: "Sun", risk: 31, avg: 28 },
];

const dailyData = [
  { day: "08:00", risk: 4, avg: 5 },
  { day: "10:00", risk: 8, avg: 7 },
  { day: "12:00", risk: 15, avg: 11 },
  { day: "14:00", risk: 12, avg: 10 },
  { day: "16:00", risk: 19, avg: 14 },
  { day: "18:00", risk: 11, avg: 9 },
  { day: "20:00", risk: 6, avg: 5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-md">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="mt-1 space-y-1">
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
          <span>{payload[0].value} High-Risk Cases</span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span>{payload[1].value} Historical Avg</span>
          </div>
        )}
      </div>
    </div>
  );
};

const RiskChart = () => {
  const [timeframe, setTimeframe] = useState("Weekly");
  const activeData = timeframe === "Weekly" ? weeklyData : dailyData;

  return (
    <div className="dashboard-card flex h-[400px] flex-col p-6 sm:p-7">
      {/* Header */}
      <div className="mb-3 flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-slate-900">
              Diabetes Risk Trend
            </h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">
              AI Analytics
            </span>
          </div>
          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            Weekly high-risk patient prediction density
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Toggle Buttons */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setTimeframe("Daily")}
              className={`rounded-lg px-3 py-1 text-[12px] font-semibold transition-all ${
                timeframe === "Daily"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("Weekly")}
              className={`rounded-lg px-3 py-1 text-[12px] font-semibold transition-all ${
                timeframe === "Weekly"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Weekly
            </button>
          </div>

          {/* Legend */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
              <span className="text-[12px] font-medium text-slate-600">High Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="text-[12px] font-medium text-slate-500">Average</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="mb-3 flex shrink-0 items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-2 text-[12px]">
          <TrendingUp size={15} className="text-emerald-600" />
          <span className="font-bold text-emerald-600">+14.2%</span>
          <span className="text-slate-500">vs historical baseline average</span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
          Sync: Realtime
        </span>
      </div>

      {/* Chart */}
      <div className="min-h-0 flex-1 relative w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E2E8F0"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
              dy={6}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
              width={34}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#94A3B8", strokeWidth: 1, strokeDasharray: "3 3" }} />

            <Area
              type="monotone"
              dataKey="avg"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="transparent"
            />

            <Area
              type="monotone"
              dataKey="risk"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#riskColor)"
              activeDot={{ r: 5, fill: "#2563EB", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskChart;
