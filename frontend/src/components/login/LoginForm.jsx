import { ShieldCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "./LoginInput";
import { loginUser } from "../../services/api";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      <LoginInput
        label="Email Address"
        type="email"
        placeholder="doctor@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <LoginInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
          />
          <span className="text-sm text-slate-600">Remember me</span>
        </label>

        <button
          type="button"
          className="text-sm font-medium text-[#2563EB] transition-colors hover:text-blue-700"
        >
          Forgot Password?
        </button>
      </div>

      {/* Inline Error Message */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all duration-200 hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing in…
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-semibold text-[#2563EB] transition-colors hover:text-blue-700"
        >
          Create Account
        </button>
      </p>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
          Secure Login
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/80 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#2563EB]" />
        <p className="text-sm leading-relaxed text-slate-600">
          Your login is protected with enterprise-grade encryption. Access is
          restricted to authorized healthcare professionals.
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
