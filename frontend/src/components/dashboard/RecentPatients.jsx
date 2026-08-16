import { useEffect, useState } from "react";
import { Eye, ChevronRight, Filter } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const riskStyles = {
  High: "bg-red-50 text-red-700 border-red-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const predictionStyles = {
  Positive: "text-red-600 font-semibold",
  Negative: "text-emerald-600 font-semibold",
  Monitor: "text-amber-600 font-semibold",
};

const RecentPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(`${BASE_URL}/api/patients`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please login again.");
          }

          throw new Error("Failed to fetch patients.");
        }

        const data = await response.json();

        // Latest 5 patients
        const latestPatients = [...data]
          .sort(
            (a, b) =>
              new Date(b.created_at) - new Date(a.created_at)
          )
          .slice(0, 5);

        setPatients(latestPatients);
      } catch (err) {
        console.error("Patient fetch error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-[16px] font-bold text-slate-900">
            Recent Clinical Assessments
          </h2>

          <p className="mt-1 text-[13px] font-medium text-slate-500">
            Latest patient risk evaluations and AI prediction diagnostics
          </p>
        </div>

        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-[16px] font-bold text-slate-900">
            Recent Clinical Assessments
          </h2>
        </div>

        <div className="p-8 text-center">
          <p className="text-sm font-semibold text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card overflow-hidden">

      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 sm:px-7">

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-slate-900">
              Recent Clinical Assessments
            </h2>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              {patients.length} Recent
            </span>
          </div>

          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            Latest patient risk evaluations and AI prediction diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2">

          {/* Filter */}
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:inline-flex"
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>

          {/* View all */}
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#2563EB] transition-colors hover:border-blue-200 hover:bg-blue-50"
          >
            <span>View All Patients</span>
            <ChevronRight size={15} />
          </button>

        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {patients.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-semibold text-slate-600">
            No patients found.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add a patient to see clinical assessments here.
          </p>
        </div>
      ) : (

        /* ================= TABLE ================= */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">

            {/* TABLE HEADER */}
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">

                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:px-7">
                  Patient
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Age
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Prediction
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Risk
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Confidence
                </th>

                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:px-7">
                  Action
                </th>

              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-100">

              {patients.map((patient) => {

                const initials =
                  patient.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "PT";

                const riskClass =
                  riskStyles[patient.risk_level] ||
                  "bg-slate-50 text-slate-600 border-slate-200";

                const predictionClass =
                  predictionStyles[patient.prediction] ||
                  "text-slate-600 font-semibold";

                return (
                  <tr
                    key={patient.id}
                    className="group transition-colors hover:bg-slate-50/80"
                  >

                    {/* ================= PATIENT ================= */}
                    <td className="px-6 py-3.5 sm:px-7">

                      <div className="flex items-center gap-3">

                        {/* Avatar */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 ring-1 ring-blue-100">
                          {initials}
                        </div>

                        {/* Name */}
                        <div>

                          <p className="text-[13px] font-bold text-slate-900 transition-colors group-hover:text-[#2563EB]">
                            {patient.name}
                          </p>

                          <p className="text-[11px] font-medium text-slate-400">
                            PAT-
                            {String(patient.id).padStart(4, "0")}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ================= AGE ================= */}
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-slate-700">
                      {patient.age}
                    </td>

                    {/* ================= PREDICTION ================= */}
                    <td className="px-4 py-3.5">

                      <span
                        className={`text-[13px] ${predictionClass}`}
                      >
                        {patient.prediction || "Pending"}
                      </span>

                    </td>

                    {/* ================= RISK ================= */}
                    <td className="px-4 py-3.5">

                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${riskClass}`}
                      >
                        {patient.risk_level || "Unknown"}
                      </span>

                    </td>

                    {/* ================= CONFIDENCE ================= */}
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-slate-600 tabular-nums">

                      {patient.confidence != null
                        ? `${patient.confidence}%`
                        : "—"}

                    </td>

                    {/* ================= DATE ================= */}
                    <td className="px-4 py-3.5 text-[12px] font-medium text-slate-500">

                      {patient.created_at
                        ? new Date(
                            patient.created_at
                          ).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}

                    </td>

                    {/* ================= ACTION ================= */}
                    <td className="px-6 py-3.5 text-center sm:px-7">

                      <button
                        type="button"
                        aria-label={`View ${patient.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-[#2563EB]"
                      >
                        <Eye size={15} />
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default RecentPatients;