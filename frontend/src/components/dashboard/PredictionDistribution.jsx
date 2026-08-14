import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Low Risk", value: 52, count: 649, color: "#16A34A" },
  { name: "Moderate Risk", value: 31, count: 387, color: "#F59E0B" },
  { name: "High Risk", value: 17, count: 212, color: "#EF4444" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-md">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <p className="text-[13px] font-bold text-slate-900">{item.name}</p>
      </div>
      <p className="mt-1 text-[12px] font-medium text-slate-600">
        <span className="font-bold text-slate-900">{item.count}</span> patients ({item.value}%)
      </p>
    </div>
  );
};

const PredictionDistribution = () => {
  return (
    <div className="dashboard-card flex h-[400px] flex-col p-6 sm:p-7">
      {/* Header */}
      <div className="mb-1 shrink-0">
        <h2 className="text-[16px] font-bold text-slate-900">
          Prediction Distribution
        </h2>
        <p className="mt-0.5 text-[13px] font-medium text-slate-500">
          Current patient risk classification
        </p>
      </div>

      {/* Donut Chart with Centered Total */}
      <div className="relative min-h-0 flex-1 w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="48%"
              innerRadius="56%"
              outerRadius="80%"
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Text */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="text-[24px] font-bold leading-none tracking-tight text-slate-900">
            1,248
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Patients
          </span>
        </div>
      </div>

      {/* Legend Breakdown */}
      <div className="mt-1 shrink-0 space-y-1.5 border-t border-slate-100 pt-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg p-1 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[13px] font-medium text-slate-700">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-medium text-slate-400">
                {item.count} pts
              </span>
              <span className="min-w-[36px] text-right text-[13px] font-bold text-slate-900">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionDistribution;
