import Logo from "../components/login/Logo";
import RegisterForm from "../components/register/RegisterForm";
import RegisterIllustration from "../components/register/RegisterIllustration";

const Register = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#202651] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] lg:min-h-[720px] lg:grid-cols-2">
        <RegisterIllustration />

        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
          <Logo />

          <div className="mt-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create Doctor Account
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Register to access the DiaFed AI clinical platform.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
