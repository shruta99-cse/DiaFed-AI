import { ShieldCheck } from "lucide-react";
import LoginInput from "./LoginInput";

const LoginForm = () => {
  return (
    <form className="mt-10 space-y-7">

      {/* Email */}
      <LoginInput
        label="Email Address"
        type="email"
        placeholder="doctor@example.com"
      />

      {/* Password */}
      <LoginInput
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      {/* Remember & Forgot Password */}
      <div className="flex items-center justify-between">

        <label className="flex items-center gap-3 cursor-pointer">

          <input
            type="checkbox"
            className="
            h-4
            w-4
            rounded
            border-slate-300
            text-blue-600
            focus:ring-2
            focus:ring-blue-500
            "
          />

          <span className="text-sm text-slate-600">
            Remember me
          </span>

        </label>

        <button
          type="button"
          className="
          text-sm
          font-semibold
          text-blue-600
          hover:text-indigo-700
          transition
          "
        >
          Forgot Password?
        </button>

      </div>

      {/* Login Button */}

      <button
        type="submit"
        className="
        w-full
        h-12
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-blue-700
        text-white
        font-semibold
        shadow-lg
        hover:shadow-xl
        hover:scale-[1.02]
        active:scale-100
        transition-all
        duration-300
        "
      >
        Sign In
      </button>

      {/* Divider */}

      <div className="flex items-center gap-4">

        <div className="flex-1 h-px bg-slate-200"></div>

        <span className="text-xs uppercase tracking-[3px] text-slate-400">
          Secure Login
        </span>

        <div className="flex-1 h-px bg-slate-200"></div>

      </div>

      {/* Security Notice */}

      <div
        className="
        flex
        items-start
        gap-3
        rounded-xl
        border
        border-blue-100
        bg-blue-50
        p-4
        "
      >

        <ShieldCheck
          size={20}
          className="text-blue-600 mt-0.5"
        />

        <p className="text-sm leading-6 text-slate-600">
          Your login is protected with enterprise-grade encryption.
          Access is restricted to authorized healthcare professionals.
        </p>

      </div>

    </form>
  );
};

export default LoginForm;