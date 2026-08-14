import { HeartPulse } from "lucide-react";

const PageHeader = ({ eyebrow = "Clinical workspace", title, description, backAction, action }) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[76px] max-w-[1400px] items-center justify-between gap-4 px-6 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {backAction}
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm sm:flex">
            <HeartPulse size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">{eyebrow}</p>
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-950 sm:text-xl">{title}</h1>
            {description && <p className="hidden text-xs text-slate-500 sm:block">{description}</p>}
          </div>
        </div>
        {action}
      </div>
    </header>
  );
};

export default PageHeader;
