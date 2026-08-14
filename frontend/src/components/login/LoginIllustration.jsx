import { HeartPulse, ShieldCheck, BrainCircuit, Activity } from "lucide-react";

const features = [
  { icon: ShieldCheck, label: "Secure Clinical Access" },
  { icon: BrainCircuit, label: "Explainable AI Models" },
  { icon: Activity, label: "Early Diabetes Prediction" },
];

const LoginIllustration = () => {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-[#0F172A] p-10 lg:flex xl:p-12">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#2563EB]/10" />
      <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-[#2563EB]/5" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Federated Learning Platform
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-[#2563EB] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <HeartPulse size={52} strokeWidth={1.75} />
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-white xl:text-4xl">
          DiaFed AI
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400 xl:text-base">
          AI-powered Explainable Federated Learning platform for secure and
          intelligent early diabetes prediction.
        </p>
      </div>

      <div className="relative z-10 space-y-3">
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#2563EB]">
              <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-slate-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginIllustration;
