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

  interface Toast {
    id: string;
    type: "visitor" | "appointment";
    title: string;
    desc1: string;
    desc2: string;
  }

  const [toasts, setToasts] = useState<Toast[]>([]);

  const { data: pollRes } = useSWR("/api/tenant/visitors/poll", fetcher, {
    refreshInterval: 5000,
  });

  const data = useDashboard();
  const tenantInfo = data?.data?.tenant;

  useEffect(() => {
    if (data?.data?.user) {
      setUser(data.data.user);
    }
  }, [data]);

  useEffect(() => {
    if (
      pollRes?.success &&
      pollRes.newVisitorsCount > 0 &&
      pollRes.newVisitors
    ) {
      const audio = new Audio("/new-visitor.mp3");
      audio.play().catch(() => {});

      const newToasts: Toast[] = pollRes.newVisitors.map((v: any) => {
        let browserInfo = "Bilinmeyen Tarayıcı";
        const ua = v.userAgent || "";

        if (ua.includes("Chrome")) browserInfo = "Google Chrome";
        if (ua.includes("Safari") && !ua.includes("Chrome"))
          browserInfo = "Safari";
        if (ua.includes("Firefox")) browserInfo = "Firefox";
        if (ua.includes("Edge")) browserInfo = "Microsoft Edge";

        const isUaMobile =
          ua.includes("Mobile") ||
          ua.includes("Android") ||
          ua.includes("iPhone");

        const deviceType = isUaMobile ? "Mobil Cihaz" : "Masaüstü Cihaz";

        return {
          id: v._id,
          type: "visitor",
          title: "Yeni bir ziyaretçi geldi",
          desc1: `${deviceType} (${browserInfo})`,
          desc2: (v.referer || "Doğrudan").substring(0, 40),
        };
      });

      setToasts((prev) => [...prev, ...newToasts]);

      newToasts.forEach((t) => {
        setTimeout(() => {
          setToasts((prev) => prev.filter((x) => x.id !== t.id));
        }, 6000);
      });
    }
  }, [pollRes]);

  useEffect(() => {
    const handleNewAppointment = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newNotifs = customEvent.detail;

      if (newNotifs && Array.isArray(newNotifs)) {
        const newToasts: Toast[] = newNotifs.map((n: any) => ({
          id: n._id,
          type: "appointment",
          title: n.subject || "Yeni Randevu Talebi",
          desc1: n.content || "Randevu detayları mevcut değil.",
          desc2: new Date(n.createdAt).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setToasts((prev) => [...prev, ...newToasts]);

        newToasts.forEach((t) => {
          setTimeout(() => {
            setToasts((prev) => prev.filter((x) => x.id !== t.id));
          }, 8000);
        });
      }
    };

    window.addEventListener("new-appointment-alert", handleNewAppointment);

    return () =>
      window.removeEventListener("new-appointment-alert", handleNewAppointment);
  }, []);

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  if (isMobile) {
    return <div>Ayarlio Mobile</div>;
  }

  return (
    <div
      style={{ background: "#f4f6fb", minHeight: "100vh" }}
      className="relative"
    >
      <Sidebar user={user} tenant={tenantInfo} appointmentsCount={data.data?.stats.totalAppointments} />

      <Header breadcrumb={formattedPathname} />

      <main className="pt-21 pl-68 pr-6">{children}</main>

      <div className="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 w-80 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isVisitor = toast.type === "visitor";

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-white border border-gray-200 shadow-xl rounded-xl p-3 pr-8 pointer-events-auto relative"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isVisitor ? "bg-green-500" : "bg-blue-500"
                  }`}
                />

                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>

                <div className="flex gap-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      isVisitor
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isVisitor ? <Globe size={16} /> : <Bell size={16} />}
                  </div>

                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-gray-800">
                      {toast.title}
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1 flex gap-1">
                      <Info size={11} className="mt-0.5" />
                      {toast.desc1}
                    </p>

                    <p className="text-[11px] text-gray-500 border-t mt-1 pt-1">
                      <b>{isVisitor ? "Kaynak:" : "Zaman:"}</b> {toast.desc2}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
