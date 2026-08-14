import { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

const AddPatient = ({ onPatientAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    glucose: "",
    blood_pressure: "",
    skin_thickness: "20",
    insulin: "80",
    bmi: "",
    dpf: "0.47",
    pregnancies: "0",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const patientData = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        glucose: Number(formData.glucose),
        blood_pressure: Number(formData.blood_pressure),
        skin_thickness: Number(formData.skin_thickness),
        insulin: Number(formData.insulin),
        bmi: Number(formData.bmi),
        dpf: Number(formData.dpf),
        pregnancies: Number(formData.pregnancies),
      };

      const response = await fetch(`${BASE_URL}/api/patients`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create patient");
      }

      console.log("Patient created:", data);

      setSuccess("Patient added successfully!");

      setFormData({
        name: "",
        age: "",
        gender: "Female",
        glucose: "",
        blood_pressure: "",
        skin_thickness: "20",
        insulin: "80",
        bmi: "",
        dpf: "0.47",
        pregnancies: "0",
      });

      if (onPatientAdded) {
        onPatientAdded(data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Add New Patient
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter patient information for clinical assessment.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Patient Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter patient name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Age */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Age
          </label>

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
            max="120"
            placeholder="Enter age"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        {/* Glucose */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Glucose
          </label>

          <input
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
            required
            placeholder="e.g. 155"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Blood Pressure
          </label>

          <input
            type="number"
            name="blood_pressure"
            value={formData.blood_pressure}
            onChange={handleChange}
            required
            placeholder="e.g. 82"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Skin Thickness */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Skin Thickness
          </label>

          <input
            type="number"
            name="skin_thickness"
            value={formData.skin_thickness}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Insulin */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Insulin
          </label>

          <input
            type="number"
            name="insulin"
            value={formData.insulin}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* BMI */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            BMI
          </label>

          <input
            type="number"
            step="0.1"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            required
            placeholder="e.g. 28.5"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* DPF */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Diabetes Pedigree Function
          </label>

          <input
            type="number"
            step="0.01"
            name="dpf"
            value={formData.dpf}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Pregnancies */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Pregnancies
          </label>

          <input
            type="number"
            name="pregnancies"
            value={formData.pregnancies}
            onChange={handleChange}
            min="0"
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-end md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Adding Patient..." : "Add Patient"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;