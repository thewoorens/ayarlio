"use client";

import { Spinner } from "@heroui/react";
import { useDashboard } from "./hooks/useDashboard";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import AppointmentsChart from "./components/AppointmentsChart";
import ServicesList from "./components/ServicesList";
import AppointmentsTable from "./components/AppointmentsTable";

import {
  BadgeTurkishLira,
  CircleX,
  CalendarClock,
  UserRoundCheck,
} from "lucide-react";

export default function DashboardView() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" label="Pano verileri yükleniyor..." />
      </div>
    );
  }

  const { stats, charts, topServices, today } = data;

  const statsCards = [
    {
      label: "Toplam Randevu",
      value: stats.totalAppointments.toString(),
      accent: "#3b82f6",
      icon: <CalendarClock size={18} />,
      url: "/pano/randevular"
    },
    {
      label: "Aktif Müşteri",
      value: stats.activeCustomers.toString(),
      accent: "#8b5cf6",
      icon: <UserRoundCheck size={18} />,
      url: "/pano/musteriler"
    },
    {
      label: "Gelir",
      value: `${stats.totalRevenue.toLocaleString("tr-TR")} ₺`,
      accent: "#22c55e",
      icon: <BadgeTurkishLira size={18} />,
    },
    {
      label: "İptal Oranı",
      value: `%${stats.cancelRate}`,
      accent: "#EC4899",
      icon: <CircleX size={18} />,
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card, i) => (
          <StatsCard key={i} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <AppointmentsChart charts={charts} />
        <ServicesList services={topServices} />
      </div>

      <AppointmentsTable today={today} />
    </div>
  );
}
