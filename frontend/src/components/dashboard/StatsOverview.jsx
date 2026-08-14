import {
  BrainCircuit,
  TriangleAlert,
  ShieldCheck,
  Building2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    title: "Total Predictions",
    value: "986",
    change: "+8.2%",
    positive: true,
    subtext: "vs last week",
    icon: BrainCircuit,
    iconColor: "text-[#2563EB]",
    bgColor: "bg-blue-50",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    title: "High Risk Patients",
    value: "84",
    change: "-3.1%",
    positive: true,
    subtext: "vs last week",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    title: "Model Accuracy",
    value: "94.8%",
    change: "+0.8%",
    positive: true,
    subtext: "Federated v4.2",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    title: "Active Hospitals",
    value: "3 Nodes",
    change: "Online",
    positive: true,
    subtext: "Federated Sync",
    icon: Building2,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    badgeStyle: "bg-blue-50 text-[#2563EB] border-blue-200",
  },
];

const StatsOverview = () => {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        const TrendIcon = item.change.startsWith("+")
          ? TrendingUp
          : item.change.startsWith("-")
          ? TrendingDown
          : ShieldCheck;

        return (
          <div
            key={item.title}
            className="dashboard-card dashboard-card-hover flex h-[156px] flex-col justify-between p-5 sm:p-6"
          >
            {/* Header: Icon & Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bgColor}`}
              >
                <Icon size={19} strokeWidth={2.2} className={item.iconColor} />
              </div>

              <div
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${item.badgeStyle}`}
              >
                {item.change.startsWith("+") || item.change.startsWith("-") ? (
                  <TrendIcon size={12} strokeWidth={2.5} />
                ) : null}
                <span>{item.change}</span>
              </div>
            </div>

            {/* Metric Number & Label */}
            <div>
              <p className="text-[13px] font-semibold text-slate-500">
                {item.title}
              </p>
              <p className="mt-0.5 text-[28px] font-bold tracking-tight text-slate-900 leading-none">
                {item.value}
              </p>
            </div>

            {/* Bottom Subtext */}
            <div className="border-t border-slate-100 pt-2.5">
              <span className="text-[12px] font-medium text-slate-400">
                {item.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatsOverview;
