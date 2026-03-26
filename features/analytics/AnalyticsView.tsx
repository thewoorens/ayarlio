"use client";

import { useState } from "react";
import type { MetricType, DateRange, MonthlyDataItem, StaffMember, HourlyDataItem, KpiItem } from "./types";
import KpiCards from "./components/KpiCards";
import MonthlyChart from "./components/MonthlyChart";
import HourlyHeatmap from "./components/HourlyHeatmap";
import StaffPerformance from "./components/StaffPerformance";

const DATE_RANGES: DateRange[] = ["Son 7 Gün", "Son 30 Gün", "Bu Yıl"];

const MONTHLY_DATA: MonthlyDataItem[] = [
  { month: "Ağu", appointments: 210, revenue: 31200, newCustomers: 28 },
  { month: "Eyl", appointments: 248, revenue: 36800, newCustomers: 34 },
  { month: "Eki", appointments: 290, revenue: 42100, newCustomers: 41 },
  { month: "Kas", appointments: 265, revenue: 38900, newCustomers: 37 },
  { month: "Ara", appointments: 310, revenue: 45600, newCustomers: 48 },
  { month: "Oca", appointments: 347, revenue: 48230, newCustomers: 52 },
];

const STAFF_PERF: StaffMember[] = [
  { name: "Ayşe Hanım", role: "Stilist", appointments: 98, rating: 4.9, revenue: "₺14,200", avatar: "AH", color: "#3b82f6" },
  { name: "Fatma Yıldız", role: "Manikür Uzmanı", appointments: 82, rating: 4.8, revenue: "₺10,800", avatar: "FY", color: "#8b5cf6" },
  { name: "Emre Demir", role: "Berber", appointments: 74, rating: 4.7, revenue: "₺9,100", avatar: "ED", color: "#22c55e" },
  { name: "Kemal Acar", role: "Masör", appointments: 61, rating: 4.6, revenue: "₺7,900", avatar: "KA", color: "#f59e0b" },
];

const HOURLY_DATA: HourlyDataItem[] = [
  { hour: "08", pct: 20 }, { hour: "09", pct: 45 }, { hour: "10", pct: 75 },
  { hour: "11", pct: 90 }, { hour: "12", pct: 60 }, { hour: "13", pct: 40 },
  { hour: "14", pct: 85 }, { hour: "15", pct: 95 }, { hour: "16", pct: 70 },
  { hour: "17", pct: 55 }, { hour: "18", pct: 30 }, { hour: "19", pct: 15 },
];

const KPIS: KpiItem[] = [
  { label: "Ortalama Randevu Süresi", value: "52 dk", delta: "-3 dk", positive: true, accent: "#3b82f6" },
  { label: "Müşteri Memnuniyeti", value: "4.8/5", delta: "+0.2", positive: true, accent: "#22c55e" },
  { label: "Tekrar Ziyaret Oranı", value: "%68", delta: "+5%", positive: true, accent: "#8b5cf6" },
  { label: "Ortalama Sepet", value: "₺139", delta: "+₺12", positive: true, accent: "#f59e0b" },
];

const MAX_REVENUE = Math.max(...MONTHLY_DATA.map((d) => d.revenue));
const MAX_APPT = Math.max(...MONTHLY_DATA.map((d) => d.appointments));

export default function AnalyticsView() {
  const [activeMetric, setActiveMetric] = useState<MetricType>("revenue");
  const [activeRange, setActiveRange] = useState<DateRange>("Son 30 Gün");

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900" style={{ letterSpacing: "-0.03em" }}>
            Analitik
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "#9ca3af" }}>
            İşletme performans metrikleri
          </p>
        </div>
        <div className="flex gap-2">
          {DATE_RANGES.map((t) => {
            const isActive = activeRange === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveRange(t)}
                className="text-[12px] px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: isActive ? "#eff6ff" : "#f4f6fb",
                  color: isActive ? "#2563eb" : "#9ca3af",
                  border: isActive
                    ? "1px solid rgba(59,130,246,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <KpiCards kpis={KPIS} />

      <MonthlyChart
        monthlyData={MONTHLY_DATA}
        activeMetric={activeMetric}
        setActiveMetric={setActiveMetric}
        maxRevenue={MAX_REVENUE}
        maxAppt={MAX_APPT}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <HourlyHeatmap hourlyData={HOURLY_DATA} />
        <StaffPerformance staffPerf={STAFF_PERF} />
      </div>
    </div>
  );
}