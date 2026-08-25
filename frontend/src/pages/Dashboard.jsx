import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import WelcomeHero from "../components/dashboard/WelcomeHero";
import StatsOverview from "../components/dashboard/StatsOverview";
import RiskChart from "../components/dashboard/RiskChart";
import PredictionDistribution from "../components/dashboard/PredictionDistribution";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import FederatedStatus from "../components/dashboard/FederatedStatus";
import ClassificationEvaluation from "../components/dashboard/ClassificationEvaluation";
import BaselineModels from "../components/dashboard/BaselineModels";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard API state
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();

  /*
   * Fetch dashboard summary for the currently
   * authenticated doctor.
   *
   * The JWT identifies the logged-in doctor.
   * The backend should use that identity to return
   * only that doctor's patients, predictions,
   * activity and federated information.
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setDashboardError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/dashboard/summary`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          `Dashboard API failed with status ${response.status}.`
        );
      }

      const data = await response.json();

      console.log("DASHBOARD API DATA:", data);

      setDashboardData(data);
    } catch (error) {
      console.error("Dashboard data error:", error);

      setDashboardData(null);

      setDashboardError(
        error?.message || "Failed to load dashboard data."
      );
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  /*
   * Fetch dashboard only after authentication
   * has finished loading and a user is available.
   */
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setDashboardLoading(false);
      setDashboardError("User authentication is required.");
      return;
    }

    fetchDashboardData();
  }, [loading, user, fetchDashboardData]);

  /*
   * Logout
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /*
   * Authentication loading screen
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading workspace…
          </p>
        </div>
      </div>
    );
  }

  /*
   * Dashboard API loading screen
   */
  if (dashboardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your dashboard…
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching your clinical workspace
          </p>
        </div>
      </div>
    );
  }

  /*
   * Dashboard API error
   */
  if (dashboardError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <span className="text-xl text-red-600">!</span>
          </div>

          <h2 className="mt-4 text-lg font-bold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {dashboardError}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={fetchDashboardData}
              className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Retry
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Main Dashboard
   */
  return (
    <div className="min-h-screen bg-[#202651] p-0 antialiased lg:p-0">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#0F172A]/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main application area */}
      <div className="layout-main flex flex-col">

        {/* Top navigation */}
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />

        <main className="flex-1">

          <div className="mx-auto w-full max-w-[1400px] space-y-6 px-6 py-6 sm:px-8 sm:py-8 lg:space-y-8">

            {/* =========================================================
                WELCOME HERO
               ========================================================= */}

            <WelcomeHero
              user={user}
              dashboardData={dashboardData}
              onNewPrediction={() => navigate("/new-prediction")}
            />

            {/* =========================================================
                DYNAMIC STATISTICS
               ========================================================= */}

            <StatsOverview
              dashboardData={dashboardData}
            />

            {/* =========================================================
                ANALYTICS
               ========================================================= */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

              {/* Risk Trend */}
              <div className="lg:col-span-7">
                <RiskChart
                  dashboardData={dashboardData}
                />
              </div>

              {/* Prediction Distribution */}
              <div className="lg:col-span-5">
                <PredictionDistribution
                  dashboardData={dashboardData}
                />
              </div>

            </div>

            {/* =========================================================
                GLOBAL MODEL EVALUATION
               ========================================================= */}

            <ClassificationEvaluation />

            {/* =========================================================
                CENTRALIZED BASELINE MODELS
               ========================================================= */}

            <BaselineModels />

            {/* =========================================================
                FEDERATED LEARNING + ACTIVITY
               ========================================================= */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

              {/* Federated hospitals / nodes */}
              <FederatedStatus
                dashboardData={dashboardData}
              />

              {/* Doctor-specific activity */}
              <ActivityTimeline
                dashboardData={dashboardData}
              />

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;