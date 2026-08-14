import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Database, RefreshCw, Server, Upload, Play, Loader2, AlertTriangle } from "lucide-react";
import { getFederatedStatus, startFederatedTraining, uploadHospitalCSVs } from "../../services/api";

const labels = { hospital_a: "Hospital A", hospital_b: "Hospital B", hospital_c: "Hospital C" };
const activeStates = new Set(["queued", "preprocessing", "training", "aggregating"]);

export default function FederatedStatus() {
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState({ state: "idle", progress: 0, hospitals: {} });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRefs = useRef({});

  const refresh = async () => {
    try { setStatus(await getFederatedStatus()); } catch (err) { setError(err.message); }
  };
  useEffect(() => {
    const timer = setTimeout(refresh, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!activeStates.has(status.state)) return undefined;
    const timer = setInterval(refresh, 900);
    return () => clearInterval(timer);
  }, [status.state]);

  const chooseFile = (key, event) => setFiles((current) => ({ ...current, [key]: event.target.files?.[0] }));
  const uploadAndTrain = async () => {
    if (Object.keys(files).length !== 3) { setError("Choose one CSV for each hospital."); return; }
    setBusy(true); setError("");
    try {
      await uploadHospitalCSVs(files);
      await startFederatedTraining(3);
      await refresh();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const isRunning = busy || activeStates.has(status.state);
  const accuracy = status.accuracy == null ? "Not trained" : `${(status.accuracy * 100).toFixed(1)}% accuracy`;

  return <div className="dashboard-card flex h-full min-h-[440px] flex-col p-6 sm:p-7">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div><h2 className="text-[16px] font-bold text-slate-900">Federated Learning</h2><p className="mt-0.5 text-[13px] text-slate-500">Three isolated hospital clients → FedAvg global model</p></div>
      <button type="button" onClick={refresh} className="rounded-xl border border-slate-200 p-2 text-slate-500"><RefreshCw size={15} /></button>
    </div>
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600"><span>Local models <span className="mx-2 text-slate-300">→</span> FedAvg <span className="mx-2 text-slate-300">→</span> Global model</span><span>{accuracy}</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded bg-slate-200"><div className="h-full bg-blue-600 transition-all" style={{ width: `${status.progress || 0}%` }} /></div>
      <p className="mt-2 text-xs text-slate-500">{status.message || "Waiting for hospital files."}</p>
    </div>
    <div className="flex-1 space-y-2">
      {Object.entries(labels).map(([key, label]) => {
        const hospital = status.hospitals?.[key];
        return <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3">
          <div className="flex min-w-0 items-center gap-2"><Database size={16} className="shrink-0 text-blue-600" /><div><p className="text-sm font-bold text-slate-900">{label}</p><p className="text-[11px] text-slate-500">{hospital ? `${hospital.rows} rows · ${hospital.status}` : files[key]?.name || "CSV not selected"}</p></div></div>
          <input ref={(node) => { inputRefs.current[key] = node; }} onChange={(event) => chooseFile(key, event)} type="file" accept=".csv,text/csv" className="hidden" />
          <button type="button" disabled={isRunning} onClick={() => inputRefs.current[key]?.click()} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50">{files[key] ? "Change" : "Choose"}</button>
        </div>;
      })}
    </div>
    {error && <div className="mt-3 flex gap-2 rounded-lg bg-red-50 p-2 text-xs text-red-700"><AlertTriangle size={15} />{error}</div>}
    <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
      <span className="font-bold">Secure Aggregation: {status.secure_aggregation?.enabled ? "Enabled" : "Unavailable"}</span>
      <span className="mx-2 text-emerald-300">·</span>
      <span>Raw Data Used by Aggregator: {status.secure_aggregation?.raw_data_used_by_aggregator === false ? "No" : "Not verified"}</span>
      {status.secure_aggregation?.last_round_verified === true && <span className="ml-2">· Masks verified</span>}
    </div>
    {status.secure_aggregation?.scope && <p className="mt-1 text-[10px] text-slate-500">{status.secure_aggregation.scope}</p>}
    <button type="button" disabled={isRunning} onClick={uploadAndTrain} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
      {isRunning ? <><Loader2 className="animate-spin" size={16} /> {status.progress || 0}% training</> : status.state === "completed" ? <><Play size={16} /> Train new global model</> : <><Upload size={16} /> Upload & train FedAvg model</>}
    </button>
    {status.state === "completed" && <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} />Global model v{status.model_version} ready for prediction <Server size={14} /></div>}
  </div>;
}
