import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Activity,
  HeartPulse,
  ShieldCheck,
  CalendarDays,
  Droplets,
  Weight,
  Syringe,
  Baby,
  Gauge,
  AlertCircle,
  BrainCircuit,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";

const BASE_URL = "http://127.0.0.1:8000";

const riskStyles = {
  High: {
    badge: "border-red-200 bg-red-50 text-red-700",
    icon: "text-red-600",
    bg: "bg-red-50",
  },

  Moderate: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: "text-amber-600",
    bg: "bg-amber-50",
  },

  Low: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

const predictionStyles = {
  Positive: "text-red-600",
  Negative: "text-emerald-600",
  Monitor: "text-amber-600",
};

const PatientDetails = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        console.log("Fetching patient:", patientId);

        const response = await fetch(
          `${BASE_URL}/api/patients/${patientId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Patient response:", data);

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch patient details"
          );
        }

        setPatient(data);
      } catch (err) {
        console.error("Patient details error:", err);

        setError(
          err.message || "Unable to load patient details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    } else {
      setError("Patient ID is missing.");
      setLoading(false);
    }
  }, [patientId, navigate]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading patient details...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">

        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[70px] max-w-[1400px] items-center px-6 sm:px-8">

            <button
              type="button"
              onClick={() => navigate("/patients")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="ml-4">
              <h1 className="text-xl font-bold text-slate-900">
                Patient Details
              </h1>

              <p className="text-xs text-slate-500">
                Clinical patient information
              </p>
            </div>

          </div>
        </header>

        {/* Error Card */}
        <main className="mx-auto max-w-[900px] px-6 py-10 sm:px-8">

          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle
                size={25}
                className="text-red-600"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Unable to load patient
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => navigate("/patients")}
              className="mt-6 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Patients
            </button>

          </div>

        </main>

      </div>
    );
  }

  if (!patient) {
    return null;
  }

  /* =====================================================
     PATIENT DATA
  ===================================================== */

  const initials =
    patient.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PT";

  const risk =
    riskStyles[patient.risk_level] || {
      badge: "border-slate-200 bg-slate-50 text-slate-600",
      icon: "text-slate-600",
      bg: "bg-slate-50",
    };

  const predictionClass =
    predictionStyles[patient.prediction] ||
    "text-slate-600";

  const formattedDate = patient.created_at
    ? new Date(patient.created_at).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "—";

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="app-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <PageHeader
        title="Patient Details"
        description="Clinical information and AI prediction record."
        backAction={<button type="button" onClick={() => navigate("/patients")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600" aria-label="Back to patients"><ArrowLeft size={18} /></button>}
        action={<button type="button" onClick={() => navigate("/new-prediction")} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">+ New Prediction</button>}
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="page-content max-w-[1200px]">

        {/* =================================================
            PATIENT HEADER
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-7">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Patient */}
            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-[#2563EB]">
                {initials}
              </div>

              <div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {patient.name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">

                  <span>
                    PAT-{String(patient.id).padStart(4, "0")}
                  </span>

                  <span className="text-slate-300">
                    •
                  </span>

                  <span>
                    {patient.age} years
                  </span>

                  <span className="text-slate-300">
                    •
                  </span>

                  <span>
                    {patient.gender}
                  </span>

                </div>

              </div>

            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

              <CalendarDays
                size={15}
                className="text-[#2563EB]"
              />

              <span>
                {formattedDate}
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            PREDICTION RESULT
        ================================================= */}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Prediction */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                <BrainCircuit
                  size={20}
                  className="text-[#2563EB]"
                />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Prediction
                </p>

                <p
                  className={`mt-0.5 text-lg font-bold ${predictionClass}`}
                >
                  {patient.prediction}
                </p>

              </div>

            </div>

          </div>

          {/* Risk */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

            <div className="flex items-center gap-3">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${risk.bg}`}
              >
                <ShieldCheck
                  size={20}
                  className={risk.icon}
                />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Risk Level
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${risk.badge}`}
                >
                  {patient.risk_level}
                </span>

              </div>

            </div>

          </div>

          {/* Confidence */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                <Gauge
                  size={20}
                  className="text-emerald-600"
                />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Confidence
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {patient.confidence != null
                    ? `${patient.confidence}%`
                    : "—"}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            CLINICAL INFORMATION
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

          {/* Section Header */}
          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">

                <Activity
                  size={18}
                  className="text-[#2563EB]"
                />

              </div>

              <div>

                <h3 className="text-base font-bold text-slate-900">
                  Clinical Information
                </h3>

                <p className="text-xs text-slate-500">
                  Patient measurements used for AI assessment
                </p>

              </div>

            </div>

          </div>

          {/* Clinical Cards */}
          <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">

            <ClinicalCard
              icon={Droplets}
              label="Glucose"
              value={patient.glucose}
              unit="mg/dL"
            />

            <ClinicalCard
              icon={HeartPulse}
              label="Blood Pressure"
              value={patient.blood_pressure}
              unit="mmHg"
            />

            <ClinicalCard
              icon={Weight}
              label="BMI"
              value={patient.bmi}
              unit="kg/m²"
            />

            <ClinicalCard
              icon={Syringe}
              label="Insulin"
              value={patient.insulin}
              unit="μU/mL"
            />

            <ClinicalCard
              icon={Activity}
              label="Skin Thickness"
              value={patient.skin_thickness}
              unit="mm"
            />

            <ClinicalCard
              icon={Gauge}
              label="Diabetes Pedigree"
              value={patient.dpf}
              unit=""
            />

            <ClinicalCard
              icon={Baby}
              label="Pregnancies"
              value={patient.pregnancies}
              unit=""
            />

          </div>

        </section>

        {/* =================================================
            AI ASSESSMENT
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">

              <ShieldCheck
                size={18}
                className="text-[#2563EB]"
              />

            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                AI Clinical Assessment
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                This prediction was generated using the DiaFed AI
                diabetes prediction model. The displayed risk level
                and confidence represent the model's assessment based
                on the clinical measurements provided.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <div className="mt-6">

          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Patients
          </button>

        </div>

      </main>

    </div>
  );
};


/* =========================================================
   CLINICAL CARD
========================================================= */

const ClinicalCard = ({
  icon: Icon,
  label,
  value,
  unit,
}) => {
  return (
    <div className="bg-white p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">

          <Icon
            size={17}
            className="text-slate-500"
          />

        </div>

        <div className="min-w-0">

          <p className="text-xs font-semibold text-slate-400">
            {label}
          </p>

          <div className="mt-0.5 flex items-baseline gap-1.5">

            <p className="text-base font-bold text-slate-900">
              {value ?? "—"}
            </p>

            {unit && (
              <span className="text-[10px] font-medium text-slate-400">
                {unit}
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default PatientDetails;
