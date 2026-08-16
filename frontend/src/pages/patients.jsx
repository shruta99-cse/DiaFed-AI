import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Search,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";

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


const Patients = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");


  // =========================================================
  // FETCH PATIENTS
  // =========================================================

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/patients`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch patients"
        );
      }

      setPatients(data);

    } catch (err) {
      console.error("Patients error:", err);

      setError(
        err.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // LOAD PATIENTS
  // =========================================================

  useEffect(() => {
    fetchPatients();
  }, []);


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredPatients = patients.filter((patient) =>
    patient.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="app-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <PageHeader
        title="Patients"
        description="Your registered patients and prediction records."
        backAction={<button type="button" onClick={() => navigate("/dashboard")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600" aria-label="Back to dashboard"><ArrowLeft size={18} /></button>}
        action={<button type="button" onClick={() => navigate("/new-prediction")} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">+ New Prediction</button>}
      />


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="page-content">

        {/* Search Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              All Patients
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {patients.length} patient
              {patients.length !== 1 ? "s" : ""} found
            </p>

          </div>


          <div className="relative w-full sm:w-[280px]">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-blue-500"
            />

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            <p className="mt-4 text-sm text-slate-500">
              Loading patients...
            </p>

          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchPatients}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredPatients.length === 0 && (

            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">

              <p className="text-lg font-bold text-slate-700">
                No patients found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                This doctor does not have any patients yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/new-prediction")
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Patient
              </button>

            </div>
          )}


        {/* =================================================
            PATIENT TABLE
        ================================================= */}

        {!loading &&
          !error &&
          filteredPatients.length > 0 && (

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px] text-left">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50">

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Patient
                      </th>

                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Age
                      </th>

                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Gender
                      </th>

                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Glucose
                      </th>

                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Prediction
                      </th>

                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Risk
                      </th>

                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Confidence
                      </th>

                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Date
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {filteredPatients.map((patient) => {

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
                        predictionStyles[
                          patient.prediction
                        ] ||
                        "text-slate-600 font-semibold";


                      return (

                        <tr
                          key={patient.id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* Patient */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                                {initials}
                              </div>

                              <div>

                                <p className="text-sm font-bold text-slate-900">
                                  {patient.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  PAT-
                                  {String(patient.id).padStart(
                                    4,
                                    "0"
                                  )}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* Age */}

                          <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                            {patient.age}
                          </td>


                          {/* Gender */}

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {patient.gender}
                          </td>


                          {/* Glucose */}

                          <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                            {patient.glucose}
                          </td>


                          {/* Prediction */}

                          <td className="px-4 py-4">

                            <span
                              className={`text-sm ${predictionClass}`}
                            >
                              {patient.prediction}
                            </span>

                          </td>


                          {/* Risk */}

                          <td className="px-4 py-4">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${riskClass}`}
                            >
                              {patient.risk_level}
                            </span>

                          </td>


                          {/* Confidence */}

                          <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                            {patient.confidence != null
                              ? `${patient.confidence}%`
                              : "—"}
                          </td>


                          {/* Date */}

                          <td className="px-4 py-4 text-xs text-slate-500">

                            {patient.created_at
                              ? new Date(
                                  patient.created_at
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "—"}

                          </td>


                          {/* =================================================
                              VIEW PATIENT
                          ================================================= */}

                          <td className="px-6 py-4 text-center">

                            <button
                              type="button"
                              onClick={() => {
                                console.log(
                                  "Opening patient:",
                                  patient.id
                                );

                                navigate(
                                  `/patients/${patient.id}`
                                );
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                              title="View patient"
                            >
                              <Eye size={16} />
                            </button>

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>

            </div>
          )}

      </main>

    </div>
  );
};

export default Patients;
