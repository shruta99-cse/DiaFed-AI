import { TrendingUp } from "lucide-react";

const RiskChart = () => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      border-slate-200
      p-6
      h-[350px]
      "
    >
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          Diabetes Risk Analysis
        </h2>

        <TrendingUp
          size={22}
          className="text-green-600"
        />

      </div>

      <div
        className="
        flex
        items-center
        justify-center
        h-[250px]
        rounded-xl
        border-2
        border-dashed
        border-slate-300
        bg-slate-50
        "
      >
        <div className="text-center">

          <TrendingUp
            size={55}
            className="mx-auto text-blue-600"
          />

          <p className="mt-4 text-lg font-semibold text-slate-700">
            Risk Analytics Chart
          </p>

          <p className="text-sm text-slate-500 mt-2">
            Patient risk distribution will appear here.
          </p>

        </div>

      </div>

    </div>
  );
};

export default RiskChart;