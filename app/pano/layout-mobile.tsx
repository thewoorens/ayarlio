"use client";

import MobileBottomNavbar from "@/components/MobileBottomNavbar";

export default function DashboardMobileLayout({ children }: { children: React.ReactNode }) {
  return (
   <div className="pb-24">
    {children}
    <MobileBottomNavbar />
   </div>
  );
}
