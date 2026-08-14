import { useEffect, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Loader2, RefreshCw } from "lucide-react";
import { getFederatedStatus, getGlobalModelEvaluation } from "../../services/api";

const metricLabels = [
  ["accuracy", "Accuracy"], ["precision", "Precision"], ["recall", "Recall"],
  ["f1_score", "F1-Score"], ["roc_auc", "ROC-AUC"],
];

const formatMetric = (value) => (value == null ? "Unavailable" : `${(value * 100).toFixed(1)}%`);

export default function ClassificationEvaluation() {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const modelVersion = useRef(null);

  const loadEvaluation = async () => {
    setLoading(true);
    setError("");
    try {
      setEvaluation(await getGlobalModelEvaluation());
    } catch (err) {
      setEvaluation(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = setTimeout(loadEvaluation, 0);
    const trainingWatcher = setInterval(async () => {
      try {
        const status = await getFederatedStatus();
        if (status.state === "completed" && status.model_version !== modelVersion.current) {
          modelVersion.current = status.model_version;
          await loadEvaluation();
        }
      } catch {
        // The explicit evaluation request displays useful errors to the user.
      }
    }, 2000);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(trainingWatcher);
    };
  }, []);

  return <section className="dashboard-card overflow-hidden p-6 sm:p-7">
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2"><BarChart3 size={18} className="text-[#2563EB]" /><h2 className="text-[16px] font-bold text-slate-900">Classification Evaluation</h2></div>
        <p className="mt-1 text-[13px] text-slate-500">Held-out hospital test data · Global Federated Model</p>
      </div>
      <button type="button" onClick={loadEvaluation} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />} Evaluate Global Model
      </button>
    </div>

    {loading && !evaluation && <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 size={18} className="animate-spin text-blue-600" />Calculating classification metrics…</div>}
    {error && !loading && <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><div><p className="font-bold">Evaluation unavailable</p><p className="mt-1">{error}</p></div></div>}

    {evaluation && <div className="pt-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {metricLabels.map(([key, label]) => <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-slate-900">{formatMetric(evaluation[key])}</p></div>)}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">Confusion Matrix</div>
          <div className="overflow-x-auto"><table className="w-full min-w-[440px] text-sm"><thead><tr className="text-slate-500"><th className="p-3 text-left" /><th className="p-3 text-center" colSpan="2">Predicted</th></tr><tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500"><th className="p-3 text-left">Actual</th><th className="p-3 text-center">Negative</th><th className="p-3 text-center">Positive</th></tr></thead><tbody><tr className="border-b border-slate-100"><th className="p-3 text-left font-semibold text-slate-700">Negative</th><td className="p-3 text-center font-bold text-emerald-700">{evaluation.true_negative}</td><td className="p-3 text-center font-bold text-red-600">{evaluation.false_positive}</td></tr><tr><th className="p-3 text-left font-semibold text-slate-700">Positive</th><td className="p-3 text-center font-bold text-red-600">{evaluation.false_negative}</td><td className="p-3 text-center font-bold text-emerald-700">{evaluation.true_positive}</td></tr></tbody></table></div>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm"><p className="font-bold text-slate-900">Evaluation details</p><dl className="mt-3 space-y-2 text-slate-600"><div className="flex justify-between gap-3"><dt>Samples</dt><dd className="font-bold text-slate-900">{evaluation.evaluation_sample_count}</dd></div><div><dt>Model</dt><dd className="mt-1 font-bold text-slate-900">{evaluation.model}</dd></div><div><dt>Last evaluated</dt><dd className="mt-1 text-xs font-semibold text-slate-700">{new Date(evaluation.evaluation_timestamp).toLocaleString()}</dd></div></dl></div>
      </div>
    </div>}
  </section>;
}
