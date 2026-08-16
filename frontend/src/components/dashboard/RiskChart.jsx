import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const risk = payload.find(
    (item) => item.dataKey === "risk"
  );

  const avg = payload.find(
    (item) => item.dataKey === "avg"
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">

      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 space-y-1.5">

        {risk && (
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">

            <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />

            <span>
              {risk.value} High-Risk Cases
            </span>

          </div>
        )}

        {avg && (
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">

            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

            <span>
              {avg.value} Historical Avg
            </span>

          </div>
        )}

      </div>
    </div>
  );
};


const RiskChart = ({ dashboardData }) => {

  const [timeframe, setTimeframe] =
    useState("Weekly");


  // =====================================================
  // REAL BACKEND DATA
  // =====================================================

  const chartData = useMemo(() => {

    const trend =
      dashboardData?.risk_trend;

    if (!trend) {
      return [];
    }


    const source =
      timeframe === "Weekly"
        ? trend.weekly
        : trend.daily;


    if (!Array.isArray(source)) {
      return [];
    }


    return source.map((item) => ({
      day:
        item.label ??
        item.day ??
        item.date ??
        item.time ??
        "-",

      risk: Number(
        item.risk ??
        item.high_risk ??
        0
      ),

      avg: Number(
        item.avg ??
        item.average ??
        item.historical_avg ??
        0
      ),
    }));

  }, [
    dashboardData,
    timeframe
  ]);


  // =====================================================
  // TREND CALCULATION
  // =====================================================

  const trendPercentage = useMemo(() => {

    if (!chartData.length) {
      return null;
    }


    const currentTotal =
      chartData.reduce(
        (sum, item) =>
          sum + Number(item.risk || 0),
        0
      );


    const averageTotal =
      chartData.reduce(
        (sum, item) =>
          sum + Number(item.avg || 0),
        0
      );


    if (averageTotal === 0) {
      return null;
    }


    return (
      (
        (currentTotal - averageTotal) /
        averageTotal
      ) * 100
    );

  }, [chartData]);


  const formattedTrend =
    trendPercentage === null
      ? null
      : `${
          trendPercentage >= 0
            ? "+"
            : ""
        }${trendPercentage.toFixed(1)}%`;


  // =====================================================
  // EMPTY STATE
  // =====================================================

  const hasRiskData =
    chartData.some(
      (item) =>
        Number(item.risk) > 0
    );


  return (
    <div className="dashboard-card flex h-[400px] flex-col p-6 sm:p-7">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-3 flex shrink-0 flex-wrap items-start justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="text-[16px] font-bold text-slate-900">
              Diabetes Risk Trend
            </h2>

            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">
              AI Analytics
            </span>

          </div>


          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            High-risk patient predictions for your patients
          </p>

        </div>


        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="flex items-center gap-3">

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">

            <button
              type="button"
              onClick={() =>
                setTimeframe("Daily")
              }
              className={`rounded-lg px-3 py-1 text-[12px] font-semibold transition-all ${
                timeframe === "Daily"
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Daily
            </button>


            <button
              type="button"
              onClick={() =>
                setTimeframe("Weekly")
              }
              className={`rounded-lg px-3 py-1 text-[12px] font-semibold transition-all ${
                timeframe === "Weekly"
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Weekly
            </button>

          </div>


          {/* =================================================
              LEGEND
          ================================================= */}

          <div className="hidden items-center gap-3 sm:flex">

            <div className="flex items-center gap-1.5">

              <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />

              <span className="text-[12px] font-medium text-slate-600">
                High Risk
              </span>

            </div>


            <div className="flex items-center gap-1.5">

              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

              <span className="text-[12px] font-medium text-slate-500">
                Average
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mb-3 flex shrink-0 items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">

        <div className="flex items-center gap-2 text-[12px]">

          <TrendingUp
            size={15}
            className={
              trendPercentage !== null &&
              trendPercentage > 0
                ? "text-blue-600"
                : "text-emerald-600"
            }
          />


          {formattedTrend ? (

            <>

              <span
                className={`font-bold ${
                  trendPercentage > 0
                    ? "text-blue-600"
                    : "text-emerald-600"
                }`}
              >
                {formattedTrend}
              </span>

              <span className="text-slate-500">
                vs historical baseline average
              </span>

            </>

          ) : (

            <span className="text-slate-500">
              Doctor-specific risk activity
            </span>

          )}

        </div>


        <span className="hidden text-[11px] font-semibold text-slate-400 sm:inline-block">
          Sync: Realtime
        </span>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div className="relative min-h-0 flex-1 w-full overflow-hidden">

        {chartData.length > 0 ? (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={chartData}
              margin={{
                top: 8,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >

              {/* =================================================
                  GRADIENT
              ================================================= */}

              <defs>

                <linearGradient
                  id="riskColor"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#2563EB"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="95%"
                    stopColor="#2563EB"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>


              {/* =================================================
                  GRID
              ================================================= */}

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#E2E8F0"
                vertical={false}
              />


              {/* =================================================
                  X AXIS
              ================================================= */}

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                  fontWeight: 500,
                }}
                dy={6}
              />


              {/* =================================================
                  Y AXIS
              ================================================= */}

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                  fontWeight: 500,
                }}
                width={34}
                allowDecimals={false}
              />


              {/* =================================================
                  TOOLTIP
              ================================================= */}

              <Tooltip
                content={
                  <CustomTooltip />
                }
                cursor={{
                  stroke: "#94A3B8",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
              />


              {/* =================================================
                  HISTORICAL AVERAGE
              ================================================= */}

              <Area
                type="monotone"
                dataKey="avg"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="transparent"
                isAnimationActive
              />


              {/* =================================================
                  REAL HIGH-RISK PREDICTIONS
              ================================================= */}

              <Area
                type="monotone"
                dataKey="risk"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#riskColor)"
                activeDot={{
                  r: 5,
                  fill: "#2563EB",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                isAnimationActive
              />

            </AreaChart>

          </ResponsiveContainer>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">

                <TrendingUp
                  size={22}
                  className="text-[#2563EB]"
                />

              </div>


              <p className="mt-3 text-sm font-semibold text-slate-700">
                No risk trend data yet
              </p>


              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">

                Risk activity will appear here once
                high-risk predictions are recorded
                for this doctor.

              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};


export default RiskChart;