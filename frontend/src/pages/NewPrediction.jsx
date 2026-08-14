import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";

const NewPrediction = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    pregnancies: "",
    glucose: "",
    blood_pressure: "",
    skin_thickness: "",
    insulin: "",
    bmi: "",
    dpf: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            patient_name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            glucose: Number(formData.glucose),
            blood_pressure: Number(formData.blood_pressure),
            skin_thickness: Number(formData.skin_thickness),
            insulin: Number(formData.insulin),
            bmi: Number(formData.bmi),
            dpf: Number(formData.dpf),
            pregnancies: Number(formData.pregnancies),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Prediction request failed"
        );
      }

      setResult(data);

    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        err.message || "Something went wrong while generating prediction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="AI clinical prediction"
        title="New Diabetes Prediction"
        description="Enter clinical measurements to generate a risk assessment."
        backAction={<button type="button" onClick={() => navigate("/dashboard")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600" aria-label="Back to dashboard"><ArrowLeft size={18} /></button>}
      />

      {/* MAIN */}
      <main className="page-content max-w-[1200px]">

        {/* PAGE HEADER */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-5 sm:px-6">

          <div className="mb-3 flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

              <Activity
                size={21}
                className="text-[#2563EB]"
              />

            </div>

            <span className="text-sm font-semibold text-[#2563EB]">
              AI Clinical Prediction
            </span>

          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Patient assessment
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Enter patient clinical information to generate an
            AI-based diabetes risk prediction.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div>
              <p className="font-semibold text-red-700">
                Prediction failed
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* FORM CARD */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

          <form onSubmit={handleSubmit}>

            {/* FORM HEADER */}
            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-lg font-bold text-slate-900">
                Patient Clinical Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide the patient's clinical measurements below.
              </p>

            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

              {/* PATIENT NAME */}
              <InputField
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />

              {/* AGE */}
              <InputField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                required
              />

              {/* GENDER */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Female">
                    Female
                  </option>

                  <option value="Male">
                    Male
                  </option>
                </select>

              </div>

              {/* PREGNANCIES */}
              <InputField
                label="Pregnancies"
                name="pregnancies"
                type="number"
                value={formData.pregnancies}
                onChange={handleChange}
                placeholder="0"
                required
              />

              {/* GLUCOSE */}
              <InputField
                label="Glucose (mg/dL)"
                name="glucose"
                type="number"
                value={formData.glucose}
                onChange={handleChange}
                placeholder="e.g. 155"
                required
              />

              {/* BLOOD PRESSURE */}
              <InputField
                label="Blood Pressure"
                name="blood_pressure"
                type="number"
                value={formData.blood_pressure}
                onChange={handleChange}
                placeholder="e.g. 82"
                required
              />

              {/* SKIN THICKNESS */}
              <InputField
                label="Skin Thickness"
                name="skin_thickness"
                type="number"
                value={formData.skin_thickness}
                onChange={handleChange}
                placeholder="e.g. 20"
                required
              />

              {/* INSULIN */}
              <InputField
                label="Insulin"
                name="insulin"
                type="number"
                value={formData.insulin}
                onChange={handleChange}
                placeholder="e.g. 80"
                required
              />

              {/* BMI */}
              <InputField
                label="BMI"
                name="bmi"
                type="number"
                step="0.1"
                value={formData.bmi}
                onChange={handleChange}
                placeholder="e.g. 28.5"
                required
              />

              {/* DPF */}
              <InputField
                label="Diabetes Pedigree Function"
                name="dpf"
                type="number"
                step="0.01"
                value={formData.dpf}
                onChange={handleChange}
                placeholder="e.g. 0.47"
                required
              />

            </div>

            {/* SUBMIT */}
            <div className="flex justify-end border-t border-slate-200 px-6 py-5">

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Running Prediction...
                  </>
                ) : (
                  <>
                    <Activity size={18} />

                    Run Prediction
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

        {/* SUCCESS MESSAGE */}
        {result && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

            <div className="flex items-center gap-3">

              <CheckCircle
                size={22}
                className="text-emerald-600"
              />

              <div>

                <p className="font-bold text-emerald-800">
                  Prediction completed successfully.
                </p>

                <p className="text-sm text-emerald-700">
                  AI analysis has been generated for this patient.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* RESULT */}
        {result && (
          <section className="mt-8">

            <div className="mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                Prediction Result
              </h2>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* PATIENT */}
                <ResultCard
                  label="Patient"
                  value={result.patient_name}
                />

                {/* PREDICTION */}
                <ResultCard
                  label="Prediction"
                  value={result.prediction}
                  valueClass={
                    result.prediction === "Positive"
                      ? "text-red-600"
                      : result.prediction === "Monitor"
                      ? "text-orange-500"
                      : "text-emerald-600"
                  }
                />

                {/* RISK */}
                <ResultCard
                  label="Risk Level"
                  value={result.risk_level}
                  valueClass={
                    result.risk_level === "High"
                      ? "text-red-600"
                      : result.risk_level === "Moderate"
                      ? "text-orange-500"
                      : "text-emerald-600"
                  }
                />

                {/* CONFIDENCE */}
                <ResultCard
                  label="Confidence"
                  value={`${result.confidence}%`}
                  valueClass="text-[#2563EB]"
                />

              </div>

              {result.shap_explanation?.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-bold text-slate-900">Why this prediction?</h3>
                  <p className="mt-1 text-xs text-slate-500">Real SHAP contributions from the current global federated model.</p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {result.shap_explanation.slice(0, 6).map((item) => (
                      <div key={item.feature} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <span className="font-medium text-slate-700">{item.feature}: {item.value}</span>
                        <span className={item.shap_value >= 0 ? "font-bold text-red-600" : "font-bold text-emerald-600"}>{item.val} · {item.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BACK BUTTON */}
              <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Dashboard
                </button>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
};


/* INPUT COMPONENT */
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  step,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};


/* RESULT CARD */
const ResultCard = ({
  label,
  value,
  valueClass = "text-slate-900",
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
};

export default NewPrediction;
