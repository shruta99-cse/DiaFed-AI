import {
  BrainCircuit,
  Users,
  Server,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const ActivityTimeline = ({ dashboardData }) => {
  const activities = dashboardData?.activity ?? [];

  const getActivityIcon = (type) => {
    switch (type) {
      case "prediction":
        return {
          icon: BrainCircuit,
          iconColor: "text-[#2563EB]",
          bgColor: "bg-blue-50",
        };

      case "patient":
        return {
          icon: Users,
          iconColor: "text-indigo-600",
          bgColor: "bg-indigo-50",
        };

      case "federated":
      case "sync":
        return {
          icon: Server,
          iconColor: "text-emerald-600",
          bgColor: "bg-emerald-50",
        };

      case "explainability":
      case "shap":
        return {
          icon: ShieldCheck,
          iconColor: "text-purple-600",
          bgColor: "bg-purple-50",
        };

      default:
        return {
          icon: BrainCircuit,
          iconColor: "text-[#2563EB]",
          bgColor: "bg-blue-50",
        };
    }
  };

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
            Audit log of your clinical events, predictions, and model syncs
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
        {activities.length > 0 ? (
          activities.map((item, index) => {
            const {
              icon: Icon,
              iconColor,
              bgColor,
            } = getActivityIcon(item.type);

            const isLast =
              index === activities.length - 1;

            return (
              <div
                key={`${item.title}-${index}`}
                className={`flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50/80 ${
                  !isLast
                    ? "border-b border-slate-100 pb-4"
                    : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgColor}`}
                >
                  <Icon
                    size={18}
                    className={iconColor}
                    strokeWidth={2.2}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[13px] font-bold leading-tight text-slate-900">
                      {item.title}
                    </p>

                    <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <BrainCircuit
                size={22}
                className="text-slate-400"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No recent activity
            </p>

            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Clinical predictions and other events will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;