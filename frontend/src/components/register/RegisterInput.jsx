import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const RegisterInput = ({ label, type, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const renderIcon = () => {
    if (type === "email") return <Mail size={18} />;
    if (type === "password") return <Lock size={18} />;
    return <User size={18} />;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#2563EB]/10">
        <div className="px-4 text-slate-400">{renderIcon()}</div>

        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent py-3.5 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 text-slate-400 transition-colors hover:text-[#2563EB]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterInput;
