import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  HeartPulse,
  X,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Patients",
    icon: Users,
    path: "/patients",
  },
  {
    title: "Prediction",
    icon: BrainCircuit,
    path: "/new-prediction",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "#",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "#",
  },
];

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name ?? "Doctor";

  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Physician";

  const handleNavigation = (item) => {
    if (item.path === "#") {
      return;
    }

    navigate(item.path);

    // Mobile sidebar close
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col lg:bottom-6 lg:left-6 lg:top-6 lg:rounded-[24px]
        bg-[#0D123B] text-white border-r border-indigo-900/50 shadow-[0_20px_50px_rgba(6,10,40,0.3)]
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >

      {/* Brand Header */}
      <div className="flex h-[70px] shrink-0 items-center justify-between px-6 border-b border-slate-800/80">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-[0_4px_14px_rgba(37,99,235,0.35)]">
            <HeartPulse
              size={20}
              className="text-white"
              strokeWidth={2.2}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">

              <h1 className="text-[15px] font-bold tracking-tight text-white leading-tight">
                DiaFed AI
              </h1>

              <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-blue-400 border border-blue-500/30">
                v4.2
              </span>

            </div>

            <p className="text-[11px] font-medium text-slate-400 leading-tight">
              Clinical Workspace
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

      </div>


      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5">

        <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Navigation
        </p>


        <nav className="space-y-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => handleNavigation(item)}
                className={`
                  group relative flex h-10 w-full items-center gap-3 rounded-xl px-3.5
                  text-[13px] font-semibold transition-all duration-150
                  ${
                    isActive
                    ? "bg-[#4B46E5] text-white shadow-[0_6px_18px_rgba(75,70,229,0.32)]"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }
                `}
              >

                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-200"
                  }
                />

                <span>{item.title}</span>

              </button>
            );
          })}

        </nav>


        {/* Federated Learning Node Card */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">

          <div className="flex items-center gap-2.5">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck size={16} />
            </div>

            <div>

              <p className="text-[12px] font-bold text-slate-200">
                FL Node #01 Active
              </p>

              <p className="text-[10px] font-medium text-slate-400">
                Global Accuracy: 94.8%
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Bottom Profile */}
      <div className="shrink-0 border-t border-slate-800 p-4 space-y-2.5">

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">

          <div className="flex items-center gap-3">

            <div className="relative">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB]/20 ring-2 ring-slate-700">

                <UserCircle
                  size={22}
                  className="text-blue-400"
                />

              </div>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0F172A]" />

            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-[13px] font-bold text-white">
                {displayName}
              </p>

              <p className="truncate text-[11px] font-medium text-slate-400">
                {displayRole}
              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          onClick={onLogout}
          className="flex h-9.5 w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 text-[13px] font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
