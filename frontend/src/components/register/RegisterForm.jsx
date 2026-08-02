import { ShieldCheck } from "lucide-react";
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
      });

      alert("Registration Successful! Please Login.");

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className="mt-10 space-y-6" onSubmit={handleRegister}>

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
        transition
        "
      >
        Create Account
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-semibold text-blue-600 hover:text-indigo-700"
        >
          Sign In
        </button>
      </p>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200"></div>

        <span className="text-xs uppercase tracking-[3px] text-slate-400">
          Secure Registration
        </span>

        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

        <ShieldCheck
          size={20}
          className="text-blue-600 mt-0.5"
        />

        <p className="text-sm leading-6 text-slate-600">
          Your account information is securely encrypted and stored.
        </p>

      </div>

    </form>
  );
};

export default RegisterForm;