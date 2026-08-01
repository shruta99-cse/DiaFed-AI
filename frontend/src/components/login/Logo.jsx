import { HeartPulse } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-4">

      <div
        className="
        w-14
        h-14
        rounded-2xl
        bg-gradient-to-br
        from-blue-600
        to-indigo-700
        flex
        items-center
        justify-center
        shadow-lg
        text-white
        "
      >
        <HeartPulse size={28} strokeWidth={2.5} />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
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