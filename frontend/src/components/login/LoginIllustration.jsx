import { HeartPulse, ShieldCheck, BrainCircuit } from "lucide-react";

const LoginIllustration = () => {
  return (
    <div
      className="
      hidden
      lg:flex
      flex-col
      justify-center
      items-center
      h-full
      bg-gradient-to-br
      from-blue-600
      via-indigo-700
      to-slate-900
      text-white
      p-12
      "
    >
      {/* Main Icon */}

      <div
        className="
        w-52
        h-52
        rounded-full
        bg-white/10
        backdrop-blur-md
        border
        border-white/20
        flex
        items-center
        justify-center
        shadow-2xl
        "
      >
        <HeartPulse
          size={100}
          strokeWidth={2}
        />
      </div>

      {/* Title */}

      <h1 className="mt-10 text-4xl font-bold text-center">
        DiaFed AI
      </h1>

      {/* Subtitle */}

      <p className="mt-4 max-w-sm text-center text-blue-100 leading-7">
        AI-powered Explainable Federated Learning platform
        for secure and intelligent diabetes prediction.
      </p>

      {/* Features */}

      <div className="mt-12 space-y-5">

        <div className="flex items-center gap-3">
          <ShieldCheck size={20} />
          <span className="text-blue-100">
            Secure Clinical Access
          </span>
        </div>

        <div className="flex items-center gap-3">
          <BrainCircuit size={20} />
          <span className="text-blue-100">
            Explainable AI Models
          </span>
        </div>

        <div className="flex items-center gap-3">
          <HeartPulse size={20} />
          <span className="text-blue-100">
            Early Diabetes Prediction
          </span>
        </div>

      </div>
    </div>
  );
};

export default LoginIllustration;