import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginInput = ({ label, type, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">

        <div className="px-4 text-slate-400">
          {type === "email" ? <Mail size={18} /> : <Lock size={18} />}
        </div>

        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="flex-1 py-3 pr-4 outline-none bg-transparent"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 text-slate-400 hover:text-blue-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

      </div>
    </div>
  );
};

export default LoginInput;