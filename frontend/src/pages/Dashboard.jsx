import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import ModelStatus from "../components/dashboard/ModelStatus";
import RiskChart from "../components/dashboard/RiskChart";
import AssessmentTable from "../components/dashboard/AssessmentTable";


function Dashboard() {

    return (

        <div className="
            min-h-screen
            bg-slate-100
            p-6
        ">

            <div className="max-w-7xl mx-auto space-y-8">


                {/* Header */}
                <DashboardHeader />


                {/* Stats */}
                <StatsCards />


                {/* Analytics */}
                <div className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    gap-6
                ">

                    <div className="xl:col-span-2">
                        <RiskChart />
                    </div>


                    <div>
                        <ModelStatus />
                    </div>


                </div>



                {/* Table */}
                <AssessmentTable />


            </div>

        </div>

    );
}


export default Dashboard;