import { ShieldCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterInput from "./RegisterInput";
import { registerUser } from "../../services/api";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      // Navigate to login with a success indicator
      navigate("/?registered=1");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleRegister}>
      <RegisterInput
        label="Full Name"
        type="text"
        placeholder="Dr. John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <RegisterInput
        label="Email Address"
        type="email"
        placeholder="doctor@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <RegisterInput
        label="Password"
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <RegisterInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

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
            Creating account…
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-semibold text-[#2563EB] transition-colors hover:text-blue-700"
        >
          Sign In
        </button>
      </p>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
          Secure Registration
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/80 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#2563EB]" />
        <p className="text-sm leading-relaxed text-slate-600">
          Your account information is securely encrypted and stored in
          compliance with healthcare data standards.
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
