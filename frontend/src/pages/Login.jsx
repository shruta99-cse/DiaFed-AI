import { useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Logo from "../components/login/Logo";
import LoginForm from "../components/login/LoginForm";
import LoginIllustration from "../components/login/LoginIllustration";

const Login = () => {
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#202651] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] lg:min-h-[660px] lg:grid-cols-2">
        <LoginIllustration />

        <div className="flex items-center justify-center p-8 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <Logo />

            <h2 className="mt-8 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome Back, Doctor
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
              Sign in to access your clinical dashboard and monitor AI-powered
              diabetes predictions securely.
            </p>

            {/* Post-registration success banner */}
            {justRegistered && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">
                  Account created successfully! Please sign in.
                </p>
              </div>
            )}

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
