"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ChevronRight, Globe, Info, X, Bell } from "lucide-react";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import { useDevice } from "../providers/device-provider";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import DashboardMobileLayout from "./layout-mobile";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatPathname(pathname: string) {
  const parts = pathname.replace(/^\//, "").split("/");

  return parts.map((part, idx) => (
    <span key={idx} className="inline-flex items-center gap-1">
      {part.charAt(0).toUpperCase() + part.slice(1)}
      {idx < parts.length - 1 && <ChevronRight size={16} className="mr-1" />}
    </span>
  ));
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const formattedPathname = formatPathname(pathname);
  const { isMobile } = useDevice();

  const [user, setUser] = useState<any>(null);

  const data = useDashboard();
  const tenantInfo = data?.data?.tenant;

  useEffect(() => {
    if (data?.data?.user) {
      setUser(data.data.user);
    }
  }, [data]);

  if (isMobile) {
    return (
      <DashboardMobileLayout>
        {children}
      </DashboardMobileLayout>
    );
  }

  return (
    <div
      style={{ background: "#f4f6fb", minHeight: "100vh" }}
      className="relative"
    >
      <Sidebar
        user={user}
        tenant={tenantInfo}
        appointmentsCount={data.data?.stats.totalAppointments}
      />

      <Header breadcrumb={formattedPathname} />

      <main className="pt-21 pl-68 pr-6">{children}</main>
    </div>
  );
}
