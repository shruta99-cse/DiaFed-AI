import { HeartPulse } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)]">
        <HeartPulse size={24} strokeWidth={2.5} />
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          DiaFed AI
        </h1>
        <p className="text-sm text-slate-500">
          Explainable Diabetes Prediction
        </p>
      </div>
    </div>
  );
};

export default Logo;
