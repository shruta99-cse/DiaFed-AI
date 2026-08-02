import {
  Cpu,
  CheckCircle2,
  Network,
  Clock3,
} from "lucide-react";

const ModelStatus = () => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      border-slate-200
      p-6
      "
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        AI Model Status
      </h2>

      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="text-blue-600" />
            <span className="text-slate-600">
              Model
            </span>
          </div>

          <span className="font-semibold text-slate-800">
            Random Forest
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-600" />
            <span className="text-slate-600">
              Status
            </span>
          </div>

          <span className="font-semibold text-green-600">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="text-indigo-600" />
            <span className="text-slate-600">
              Federated Learning
            </span>
          </div>

          <span className="font-semibold text-slate-800">
            Connected
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock3 className="text-orange-500" />
            <span className="text-slate-600">
              Last Updated
            </span>
          </div>

          <span className="font-semibold text-slate-800">
            Just Now
          </span>
        </div>

      </div>
    </div>
  );
};

export default ModelStatus;