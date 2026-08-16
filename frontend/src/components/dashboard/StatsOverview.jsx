import { useState } from "react";
import {
  BrainCircuit,
  TriangleAlert,
  ShieldCheck,
  Building2,
  TrendingUp,
  TrendingDown,
  X,
  Users,
  Activity,
  MapPin,
  Server,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const StatsOverview = ({ dashboardData }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const totalPatients = dashboardData?.total_patients ?? 0;
  const highRiskPatients = dashboardData?.high_risk_patients ?? 0;
  const modelAccuracy = dashboardData?.model_accuracy ?? "0%";
  const activeHospitals = dashboardData?.active_hospitals ?? 0;

  const recentPatients = dashboardData?.recent_patients ?? [];
  const federatedNodes = dashboardData?.federated_nodes ?? [];

  const stats = [
    {
      id: "patients",
      title: "Total Patients",
      value: totalPatients.toLocaleString(),
      change: "Live",
      positive: true,
      subtext: "Your registered patients",
      icon: BrainCircuit,
      iconColor: "text-[#2563EB]",
      bgColor: "bg-blue-50",
    },
    {
      id: "high-risk",
      title: "High Risk Patients",
      value: highRiskPatients.toLocaleString(),
      change: highRiskPatients > 0 ? "Attention" : "Clear",
      positive: highRiskPatients === 0,
      subtext: "Currently high risk",
      icon: TriangleAlert,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "accuracy",
      title: "Model Accuracy",
      value:
        typeof modelAccuracy === "number"
          ? `${modelAccuracy}%`
          : modelAccuracy,
      change: "Live",
      positive: true,
      subtext: "Global Federated Model",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "hospitals",
      title: "Active Hospitals",
      value: `${activeHospitals} Nodes`,
      change: "Online",
      positive: true,
      subtext: "Federated Sync",
      icon: Building2,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const getModalTitle = () => {
    switch (selectedCard) {
      case "patients":
        return "Your Registered Patients";
      case "high-risk":
        return "High Risk Patients";
      case "accuracy":
        return "Federated Model Performance";
      case "hospitals":
        return "Federated Hospital Network";
      default:
        return "";
    }
  };

  const renderModalContent = () => {
    if (selectedCard === "patients") {
      return (
        <div className="space-y-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Total Registered
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {totalPatients}
                </p>
              </div>

              <Users className="text-blue-600" size={28} />
            </div>
          </div>

          <div className="max-h-[320px] space-y-2 overflow-y-auto">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {patient.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Age {patient.age} · {patient.gender}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        patient.risk_level === "High"
                          ? "bg-red-50 text-red-700"
                          : patient.risk_level === "Moderate"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {patient.risk_level} Risk
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Glucose</span>
                      <p className="font-semibold text-slate-700">
                        {patient.glucose}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400">BP</span>
                      <p className="font-semibold text-slate-700">
                        {patient.blood_pressure}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400">BMI</span>
                      <p className="font-semibold text-slate-700">
                        {patient.bmi}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No patient records available.
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedCard === "high-risk") {
      const highRiskList = recentPatients.filter(
        (patient) => patient.risk_level === "High"
      );

      return (
        <div>
          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                  Current High Risk
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {highRiskPatients}
                </p>
              </div>

              <TriangleAlert className="text-red-600" size={28} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {highRiskList.length > 0 ? (
              highRiskList.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-xl border border-red-100 bg-red-50/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {patient.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Glucose {patient.glucose} · BMI {patient.bmi}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                      High Risk
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2
                  className="mx-auto text-emerald-500"
                  size={34}
                />

                <p className="mt-2 font-semibold text-slate-800">
                  No high-risk patients
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your currently registered patients have no high-risk
                  classification.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedCard === "accuracy") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Global Model Accuracy
                </p>

                <p className="mt-1 text-4xl font-bold text-slate-900">
                  {typeof modelAccuracy === "number"
                    ? `${modelAccuracy}%`
                    : modelAccuracy}
                </p>
              </div>

              <ShieldCheck
                className="text-emerald-600"
                size={34}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400">
                Model
              </p>

              <p className="mt-1 font-bold text-slate-800">
                Federated v4.2
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400">
                Training Nodes
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {federatedNodes.length}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <Activity
                size={17}
                className="text-blue-600"
              />

              <span className="text-sm font-semibold text-slate-800">
                Global Federated Model
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Model performance is calculated from the federated
              learning pipeline and is shared globally without
              exposing hospital patient records.
            </p>
          </div>
        </div>
      );
    }

    if (selectedCard === "hospitals") {
      return (
        <div className="space-y-3">
          <div className="rounded-xl bg-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Active Nodes
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {activeHospitals}
                </p>
              </div>

              <Server
                className="text-indigo-600"
                size={30}
              />
            </div>
          </div>

          {federatedNodes.length > 0 ? (
            federatedNodes.map((node) => (
              <div
                key={node.nodeId}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {node.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={13} />
                      <span>{node.nodeId}</span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      node.online
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {node.online ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="text-slate-400">
                      Local Model
                    </span>

                    <p className="mt-0.5 font-semibold text-slate-700">
                      {node.localModel}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="text-slate-400">
                      Sync
                    </span>

                    <p className="mt-0.5 font-semibold text-slate-700">
                      {node.syncStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  {node.trainingStatus?.includes("Training") ? (
                    <Clock3 size={13} className="text-amber-500" />
                  ) : (
                    <CheckCircle2
                      size={13}
                      className="text-emerald-500"
                    />
                  )}

                  <span>{node.trainingStatus}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">
              No federated nodes available.
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          const TrendIcon =
            item.change.startsWith("+")
              ? TrendingUp
              : item.change.startsWith("-")
              ? TrendingDown
              : ShieldCheck;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => setSelectedCard(item.id)}
              className="dashboard-card dashboard-card-hover flex h-[156px] flex-col justify-between p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bgColor}`}
                >
                  <Icon
                    size={19}
                    strokeWidth={2.2}
                    className={item.iconColor}
                  />
                </div>

                <div
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    item.positive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  <TrendIcon size={12} strokeWidth={2.5} />
                  <span>{item.change}</span>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-slate-500">
                  {item.title}
                </p>

                <p className="mt-0.5 text-[28px] font-bold leading-none tracking-tight text-slate-900">
                  {item.value}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-2.5">
                <span className="text-[12px] font-medium text-slate-400">
                  {item.subtext}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* =========================================================
          DYNAMIC CARD MODAL
         ========================================================= */}

      {selectedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {getModalTitle()}
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Live information from your clinical workspace
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-5">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatsOverview;