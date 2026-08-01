import Logo from "../components/login/Logo";
import LoginForm from "../components/login/LoginForm";
import LoginIllustration from "../components/login/LoginIllustration";

const Login = () => {
  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-100
      via-blue-50
      to-slate-100
      flex
      items-center
      justify-center
      p-6
      "
    >
      <div
        className="
        w-full
        max-w-6xl
        min-h-[650px]
        grid
        lg:grid-cols-2
        rounded-3xl
        overflow-hidden
        bg-white
        border
        border-slate-200
        shadow-[0_20px_70px_rgba(15,23,42,0.12)]
        "
      >
        {/* Left Side */}
        <LoginIllustration />

        {/* Right Side */}
        <div
          className="
          flex
          items-center
          justify-center
          bg-white
          p-12
          "
        >
          <div className="w-full max-w-md">

            <Logo />

            <h2 className="mt-10 text-4xl font-bold tracking-tight text-slate-900">
              Welcome Back, Doctor
            </h2>

            <p className="mt-3 text-slate-600 leading-relaxed">
              Sign in to access your clinical dashboard and monitor
              AI-powered diabetes predictions securely.
            </p>

            <div className="mt-10">
              <LoginForm />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;