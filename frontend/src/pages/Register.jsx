import Logo from "../components/login/Logo";
import RegisterForm from "../components/register/RegisterForm";
import RegisterIllustration from "../components/register/RegisterIllustration";

const Register = () => {
  return (
    <div
      className="
      min-h-screen
      bg-slate-50
      flex
      items-center
      justify-center
      p-6
      "
    >
      <div
        className="
        max-w-6xl
        w-full
        grid
        lg:grid-cols-2
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        "
      >
        {/* Left Side */}
        <RegisterIllustration />

        {/* Right Side */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">

          <Logo />

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Create Doctor Account
            </h1>

            <p className="mt-2 text-slate-500">
              Register to access DiaFed AI platform.
            </p>
          </div>

          <RegisterForm />

        </div>
      </div>
    </div>
  );
};

export default Register;