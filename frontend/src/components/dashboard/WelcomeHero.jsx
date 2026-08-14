import {
  ArrowUpRight,
  Plus,
  Users,
  BrainCircuit,
  ShieldCheck,
} from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
};

const heroKpis = [
  {
    label: "Today's Patients",
    value: "128",
    subtext: "12 scheduled today",
    icon: Users,
    color: "text-[#2563EB]",
    bgColor: "bg-blue-50",
  },
  {
    label: "AI Predictions",
    value: "96",
    subtext: "Active reviews",
    icon: BrainCircuit,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    label: "Model Accuracy",
    value: "94.8%",
    subtext: "Federated v4.2",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

const WelcomeHero = ({ user, onNewPrediction }) => {
  const greeting = getGreeting();

  const displayName = user?.name ?? "Doctor";

  return (
    <section className="dashboard-card bg-white p-6 sm:p-7">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

        {/* LEFT SECTION */}
        <div className="min-w-0 flex-1">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-[11px] font-semibold text-[#2563EB]">
            <span>Clinical Workspace</span>
          </div>

          {/* Greeting */}
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {greeting}, {displayName}
          </h1>

          {/* Description */}
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-slate-600">
            Monitor AI-powered diabetes predictions, patient risk and
            federated model performance from one secure clinical workspace.
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-5 flex flex-wrap items-center gap-3">

            {/* NEW PREDICTION */}
            <button
              type="button"
              onClick={onNewPrediction}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Plus
                size={16}
                strokeWidth={2.5}
              />

              <span>
                New Prediction
              </span>
            </button>

            {/* VIEW REPORTS */}
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span>
                View Reports
              </span>

              <ArrowUpRight size={15} />
            </button>

          </div>

        </div>

        {/* RIGHT SECTION - KPI CARDS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[460px] lg:shrink-0">

          {heroKpis.map((kpi) => {

            const Icon = kpi.icon;

            return (
              <div
                key={kpi.label}
                className="dashboard-card-hover rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >

                {/* Icon */}
                <div className="flex items-center justify-between">

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.bgColor}`}
                  >
                    <Icon
                      size={16}
                      className={kpi.color}
                      strokeWidth={2.2}
                    />
                  </div>

                </div>

                {/* Label */}
                <p className="mt-3 truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {kpi.label}
                </p>

                {/* Value */}
                <p className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                  {kpi.value}
                </p>

                {/* Subtext */}
                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                  {kpi.subtext}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
};

export default WelcomeHero;