import {
  Users,
  Activity,
  ShieldCheck,
} from "lucide-react";

const cards = [
  {
    title: "Total Patients",
    value: "124",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Predictions",
    value: "96",
    icon: Activity,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Model Accuracy",
    value: "94.8%",
    icon: ShieldCheck,
    color: "bg-purple-100 text-purple-600",
  },
];

const StatsCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
              bg-white
              rounded-2xl
              shadow-sm
              border
              border-slate-200
              p-6
              hover:shadow-lg
              transition-all
              duration-300
            "
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>
              </div>

              <div
                className={`
                  h-14
                  w-14
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${card.color}
                `}
              >
                <Icon size={28} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;