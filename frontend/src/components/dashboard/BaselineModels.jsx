import { useEffect, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Loader2, RefreshCw } from "lucide-react";
import {
  getFederatedStatus,
  getGlobalModelEvaluation,
  getLogisticRegressionBaseline,
  getRandomForestBaseline,
} from "../../services/api";

const metrics = [["accuracy", "Accuracy"], ["precision", "Precision"], ["recall", "Recall"], ["f1_score", "F1-Score"], ["roc_auc", "ROC-AUC"]];
const asPercent = (value) => (value == null ? "Unavailable" : `${(value * 100).toFixed(2)}%`);
const trainingTime = (value) => (typeof value === "number" ? `${value.toFixed(4)}s` : "Unavailable");

function ConfusionMatrix({ baseline }) {
  return <div className="overflow-hidden rounded-xl border border-slate-200">
    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">Confusion Matrix</div>
    <table className="w-full text-sm">
      <thead><tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500"><th className="p-3 text-left">Actual / Predicted</th><th className="p-3 text-center">Negative</th><th className="p-3 text-center">Positive</th></tr></thead>
      <tbody>
        <tr className="border-b border-slate-100"><th className="p-3 text-left text-slate-700">Negative</th><td className="p-3 text-center font-bold text-emerald-700">{baseline.true_negative}</td><td className="p-3 text-center font-bold text-red-600">{baseline.false_positive}</td></tr>
        <tr><th className="p-3 text-left text-slate-700">Positive</th><td className="p-3 text-center font-bold text-red-600">{baseline.false_negative}</td><td className="p-3 text-center font-bold text-emerald-700">{baseline.true_positive}</td></tr>
      </tbody>
    </table>
  </div>;
}

function BaselineCard({ baseline }) {
  return <article className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
    <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div><p className="text-[11px] font-bold uppercase tracking-wide text-violet-600">Centralized baseline</p><h3 className="mt-1 font-bold text-slate-900">{baseline.model_name}</h3><p className="mt-1 text-xs text-slate-500">Comparison only — does not participate in FedAvg.</p></div>
      <p className="text-xs font-medium text-slate-500">Evaluated {new Date(baseline.timestamp).toLocaleString()}</p>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{metrics.map(([key, label]) => <div key={key} className="rounded-xl border border-violet-100 bg-violet-50/50 p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-lg font-bold text-slate-900">{asPercent(baseline[key])}</p></div>)}</div>
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_210px]"><ConfusionMatrix baseline={baseline} /><dl className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm"><div><dt className="text-slate-500">Training time</dt><dd className="mt-1 font-bold text-slate-900">{trainingTime(baseline.training_time)}</dd></div><div className="mt-4"><dt className="text-slate-500">Evaluation samples</dt><dd className="mt-1 font-bold text-slate-900">{baseline.evaluation_sample_count}</dd></div><div className="mt-4"><dt className="text-slate-500">Evaluation timestamp</dt><dd className="mt-1 break-words text-xs font-semibold text-slate-700">{new Date(baseline.timestamp).toLocaleString()}</dd></div></dl></div>
  </article>;
}

function ComparisonTable({ federated, logisticRegression, randomForest }) {
  const models = [
    ["Global Federated Model", federated, "text-blue-700"],
    ["Centralized Logistic Regression", logisticRegression, "text-violet-700"],
    ["Centralized Random Forest", randomForest, "text-emerald-700"],
  ];
  return <div className="mt-6 overflow-x-auto rounded-xl border border-blue-100"><table className="min-w-[720px] w-full text-sm"><thead className="bg-blue-50/60 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500"><tr><th className="p-3">Model</th>{metrics.map(([, label]) => <th key={label} className="p-3 text-right">{label}</th>)}</tr></thead><tbody>{models.map(([name, result, color]) => <tr key={name} className="border-t border-blue-100"><th className="p-3 text-left font-semibold text-slate-700">{name}</th>{metrics.map(([key]) => <td key={key} className={`p-3 text-right font-bold ${color}`}>{asPercent(result[key])}</td>)}</tr>)}</tbody></table></div>;
}

export default function BaselineModels() {
  const [logisticRegression, setLogisticRegression] = useState(null);
  const [randomForest, setRandomForest] = useState(null);
  const [federated, setFederated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const modelVersion = useRef(null);

  const loadComparison = async () => {
    setLoading(true); setError("");
    try {
      const [globalEvaluation, logisticEvaluation, randomForestEvaluation] = await Promise.all([getGlobalModelEvaluation(), getLogisticRegressionBaseline(), getRandomForestBaseline()]);
      setFederated(globalEvaluation); setLogisticRegression(logisticEvaluation); setRandomForest(randomForestEvaluation);
    } catch (err) {
      setFederated(null); setLogisticRegression(null); setRandomForest(null); setError(err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const initialLoad = setTimeout(loadComparison, 0);
    const watcher = setInterval(async () => {
      try {
        const status = await getFederatedStatus();
        if (status.state === "completed" && status.model_version !== modelVersion.current) {
          modelVersion.current = status.model_version;
          await loadComparison();
        }
      } catch { /* The visible request state handles errors. */ }
    }, 2000);
    return () => { clearTimeout(initialLoad); clearInterval(watcher); };
  }, []);

  const ready = federated && logisticRegression && randomForest;
  return <section className="dashboard-card overflow-hidden p-6 sm:p-7">
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><BarChart3 size={18} className="text-violet-600" /><h2 className="text-[16px] font-bold text-slate-900">Baseline Models</h2></div><p className="mt-1 text-[13px] text-slate-500">Centralized comparison experiment using the same held-out cohort</p></div><button type="button" onClick={loadComparison} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">{loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />} Refresh comparison</button></div>
    {loading && !ready && <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 size={18} className="animate-spin text-violet-600" />Training and evaluating centralized baselines…</div>}
    {error && !loading && <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertTriangle size={18} className="shrink-0" /><div><p className="font-bold">Baseline comparison unavailable</p><p className="mt-1">{error}</p></div></div>}
    {ready && <div className="space-y-5 pt-5"><BaselineCard baseline={logisticRegression} /><BaselineCard baseline={randomForest} /><div><p className="text-sm font-bold text-slate-900">Model Comparison</p><p className="mt-1 text-xs text-slate-500">Centralized baselines are comparison-only and do not participate in FedAvg.</p><ComparisonTable federated={federated} logisticRegression={logisticRegression} randomForest={randomForest} /></div></div>}
  </section>;
}
