import { Bell, LogOut, UserCircle2 } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-5">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          DiaFed AI
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome back, Doctor 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
          <Bell className="text-slate-600" size={22} />

          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">

          <UserCircle2
            size={42}
            className="text-blue-600"
          />

          <div>
            <h3 className="font-semibold text-slate-800">
              Dr. Rahul
            </h3>

            <p className="text-sm text-slate-500">
              General Physician
            </p>
          </div>

        </div>

        <button
          className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-red-500
          px-4
          py-2
          text-white
          hover:bg-red-600
          transition
          "
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </header>
  );
};

export default DashboardHeader;