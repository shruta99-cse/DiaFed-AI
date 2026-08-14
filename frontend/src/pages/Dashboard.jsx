import { useState } from "react";
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

const Dashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();


  const handleLogout = () => {
    logout();
    navigate("/");
  };


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


  return (

    <div className="min-h-screen bg-[#202651] p-0 antialiased lg:p-0">

      {/* Mobile overlay */}

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


      {/* Main */}

      <div className="layout-main flex flex-col">

        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />


        <main className="flex-1">

          <div className="mx-auto w-full max-w-[1400px] space-y-6 px-6 py-6 sm:px-8 sm:py-8 lg:space-y-8">

            {/* Welcome */}

            <WelcomeHero
              user={user}
              onNewPrediction={() =>
                navigate("/new-prediction")
              }
            />


            {/* Statistics */}

            <StatsOverview />


            {/* Analytics */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

              <div className="lg:col-span-7">
                <RiskChart />
              </div>

              <div className="lg:col-span-5">
                <PredictionDistribution />
              </div>

            </div>

            <ClassificationEvaluation />

            <BaselineModels />


            {/* Federated Learning + Activity */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

              <FederatedStatus />

              <ActivityTimeline />

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;
