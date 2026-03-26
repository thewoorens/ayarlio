import type { MetricType, MonthlyDataItem } from "../types";

interface MonthlyChartProps {
  monthlyData: MonthlyDataItem[];
  activeMetric: MetricType;
  setActiveMetric: (metric: MetricType) => void;
  maxRevenue: number;
  maxAppt: number;
}

export default function MonthlyChart({
  monthlyData,
  activeMetric,
  setActiveMetric,
  maxRevenue,
  maxAppt,
}: MonthlyChartProps) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e8eaf0" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900" style={{ letterSpacing: "-0.01em" }}>
            Aylık Trend
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: "#9ca3af" }}>
            Ağustos 2024 – Ocak 2025
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#f8f9fc", border: "1px solid #e8eaf0" }}>
          {(["revenue", "appointments"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className="text-[12px] px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{
                background: activeMetric === m ? "rgba(59,130,246,0.2)" : "transparent",
                color: activeMetric === m ? "#2563eb" : "#9ca3af",
              }}
            >
              {m === "revenue" ? "Gelir" : "Randevu"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-4 h-52">
        {monthlyData.map((d, i) => {
          const val = activeMetric === "revenue" ? d.revenue : d.appointments;
          const max = activeMetric === "revenue" ? maxRevenue : maxAppt;
          const isLast = i === monthlyData.length - 1;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div
                className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "#3b82f6" }}
              >
                {activeMetric === "revenue" ? `₺${(val / 1000).toFixed(0)}K` : val}
              </div>
              <div
                className="w-full relative rounded-t-lg overflow-hidden"
                style={{ height: `${(val / max) * 180}px` }}
              >
                <div
                  className="absolute inset-0 rounded-t-lg transition-all duration-300"
                  style={{
                    background: isLast
                      ? "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)"
                      : "#e8eaf0",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "linear-gradient(180deg, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.25) 100%)",
                  }}
                />
              </div>
              <span className="text-[11px]" style={{ color: isLast ? "#374151" : "#9ca3af" }}>
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}