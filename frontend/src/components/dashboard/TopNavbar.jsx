import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
  Search,
  UserCircle,
} from "lucide-react";

const TopNavbar = ({ onMenuClick, user }) => {

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const displayName = user?.name ?? "Doctor";

  return (
    <header className="sticky top-0 z-30 h-[76px] shrink-0 border-b border-indigo-100/70 bg-[#fbfbff]/95 backdrop-blur">

      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-6 sm:px-8">

        {/* LEFT SIDE */}
        <div className="flex min-w-0 flex-1 items-center gap-4">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={19} />
          </button>

          {/* SEARCH BAR */}
          <div className="relative w-full max-w-[340px] md:max-w-[400px]">

            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search patients, medical records, or dates..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">

          {/* DATE */}
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 lg:flex">

            <CalendarDays
              size={15}
              className="text-[#2563EB]"
            />

            <span className="text-[12px] font-semibold text-slate-700">
              {todayFormatted}
            </span>

          </div>

          {/* NOTIFICATION */}
          <button
            type="button"
            className="relative flex h-9.5 w-9.5 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            aria-label="Notifications"
          >

            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />

          </button>

          {/* DIVIDER */}
          <div className="hidden h-6 w-px bg-slate-200 md:block" />

          {/* PROFILE */}
          <div className="flex cursor-pointer items-center gap-2.5 rounded-xl py-1 pl-1 pr-1.5 transition-colors hover:bg-slate-50">

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB]/10 ring-1 ring-slate-200">

              <UserCircle
                size={20}
                className="text-[#2563EB]"
              />

            </div>

            {/* Name */}
            <div className="hidden text-left md:block">

              <p className="text-[13px] font-bold leading-tight text-slate-900">
                {displayName}
              </p>

              <p className="text-[11px] font-medium leading-tight text-slate-500">
                Physician
              </p>

            </div>

            {/* Arrow */}
            <ChevronDown
              size={14}
              className="hidden text-slate-400 md:block"
            />

          </div>

        </div>

      </div>

    </header>
  );
};

export default TopNavbar;
