"use client";

import MobileBottomNavbar from "@/components/MobileBottomNavbar";
import SuspendGuard from "@/components/SuspendGuard";

export default function DashboardMobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-24">
      <SuspendGuard>
        {children}
        <MobileBottomNavbar />
      </SuspendGuard>
    </div>
  );
}
