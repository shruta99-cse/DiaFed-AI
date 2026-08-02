import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const RegisterInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const renderIcon = () => {
    if (type === "email") return <Mail size={18} />;
    if (type === "password") return <Lock size={18} />;
    return <User size={18} />;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-blue-500">

        <div className="px-4 text-slate-400">
          {renderIcon()}
        </div>

        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
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

export default RegisterInput;