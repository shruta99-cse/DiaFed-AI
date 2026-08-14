import {
  BrainCircuit,
  Users,
  Server,
  ShieldCheck,
  ChevronRight,
  Activity as ActivityIcon,
} from "lucide-react";

const activities = [
  {
    title: "Diabetes prediction completed",
    detail: "Patient PAT-0041 · High risk flagged (96.4% confidence)",
    time: "2 min ago",
    icon: BrainCircuit,
    iconColor: "text-[#2563EB]",
    bgColor: "bg-blue-50",
  },
  {
    title: "Patient record updated",
    detail: "Priya Patel · Fasting glucose levels updated to 118 mg/dL",
    time: "12 min ago",
    icon: Users,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Federated model synchronized",
    detail: "Hospital B Node · Round 847 global aggregation complete",
    time: "28 min ago",
    icon: Server,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Explainability report generated",
    detail: "SHAP feature importance analysis for batch #129",
    time: "1 hour ago",
    icon: ShieldCheck,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const ActivityTimeline = () => {
  return (
    <div className="dashboard-card flex h-full min-h-[440px] flex-col p-6 sm:p-7">
      {/* Header */}
      <div className="mb-6 flex shrink-0 items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-slate-900">
              Recent Clinical Activity
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              Realtime
            </span>
          </div>
          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            Audit log of clinical events, predictions, and model syncs
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563EB] transition-colors hover:text-blue-700"
        >
          <span>View All Log</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Activity List */}
      <div className="flex-1 space-y-3">
        {activities.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === activities.length - 1;

          return (
            <div
              key={index}
              className={`flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50/80 ${
                !isLast ? "border-b border-slate-100 pb-4" : ""
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bgColor} shadow-2xs`}
              >
                <Icon size={18} className={item.iconColor} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13px] font-bold text-slate-900 leading-tight">
                    {item.title}
                  </p>
                  <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                    {item.time}
                  </span>
                </div>
                <p className="mt-1 text-[12px] font-medium text-slate-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
