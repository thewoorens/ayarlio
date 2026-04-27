"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarFold,
  Album,
  Users2,
  User2,
  WalletCards,
  Settings,
  LogOut,
  UserCog2,
  SquareArrowOutUpRight,
  ChevronRight,
  Layers,
  X,
  MenuIcon,
} from "lucide-react";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { Avatar } from "@heroui/react";

// ─── Navigation data (mirrors desktop sidebar) ───────────────────────────────
const navigation = [
  {
    group: "Genel",
    items: [
      { label: "Pano", href: "/pano", icon: LayoutDashboard, color: "#6366f1" },
    ],
  },
  {
    group: "Randevular",
    items: [
      {
        label: "Takvim",
        href: "/pano/takvim",
        icon: CalendarFold,
        color: "#3b82f6",
        badge: "appointments_count",
      },
      {
        label: "Randevular",
        href: "/pano/randevular",
        icon: Album,
        color: "#0ea5e9",
      },
    ],
  },
  {
    group: "İşletme",
    items: [
      {
        label: "Müşteriler",
        href: "/pano/musteriler",
        icon: Users2,
        color: "#22c55e",
      },
      {
        label: "Personel",
        href: "/pano/personel",
        icon: User2,
        color: "#f59e0b",
      },
      {
        label: "Hizmetler",
        href: "/pano/hizmetler",
        icon: WalletCards,
        color: "#ec4899",
      },
    ],
  },
  {
    group: "Sistem",
    items: [
      {
        label: "Ayarlar",
        href: "/pano/ayarlar",
        icon: Settings,
        color: "#8b5cf6",
      },
    ],
  },
];

export default function MobileBottomNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const dashData = useDashboard();
  const user = dashData?.data?.user;
  const tenant = dashData?.data?.tenant;
  const appointmentsCount = dashData?.data?.stats?.totalAppointments ?? 0;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const protocol = rootDomain.includes("localhost") ? "http" : "https";
  const previewUrl = tenant?.slug
    ? `${protocol}://${tenant.slug}.${rootDomain}`
    : "#";

  // Hide FAB on scroll-down
  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY;
      if (cur > lastScrollY && cur > 80) {
        setIsHiding(true);
        setIsOpen(false);
      } else setIsHiding(false);
      setLastScrollY(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const go = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsOpen(false);
        router.push("/giris-yap");
        router.refresh();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* ── BACKDROP ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── BOTTOM SHEET ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 34,
              mass: 0.9,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden shadow-2xl"
            style={{ maxHeight: "88vh" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-4 pb-2 shrink-0">
              <motion.div 
                className="w-12 h-1 rounded-full bg-gradient-to-r from-white/10 via-white/30 to-white/10"
                animate={{ width: [48, 56, 48] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* User Profile Section */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-5 pt-4 pb-5 shrink-0 border-b border-white/6 bg-white/3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 px-3 py-2 rounded-2xl transition-colors group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                  <Avatar size="lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold leading-tight truncate">
                    {user?.name || ""}
                  </p>
                  <p className="text-[12px] text-white/50 truncate font-medium">
                    {tenant?.name} {user?.role === "admin" ? "· Yönetici" : ""}
                  </p>
                </div>
                <ChevronRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.div>

            {/* ── Scrollable nav area ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
              {navigation.map((section, si) => (
                <motion.div 
                  key={section.group}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.05 }}
                >
                  {/* Group label */}
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-white/40 px-2 mb-3">
                    {section.group}
                  </p>

                  {/* Items */}
                  <div className="space-y-2">
                    {section.items.map((item, ii) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/pano" &&
                          pathname.startsWith(item.href));
                      const Icon = item.icon;
                      const isBadge =
                        "badge" in item && item.badge === "appointments_count";

                      return (
                        <motion.button
                          key={item.href}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: si * 0.08 + ii * 0.04,
                            duration: 0.3,
                          }}
                          onClick={() => go(item.href)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.96 }}
                          className="w-full relative group"
                        >
                          <div className={`
                            flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200
                            ${
                              isActive
                                ? "bg-gradient-to-r from-white/15 to-white/8 border border-white/15 shadow-lg shadow-white/5"
                                : "hover:bg-white/6 active:bg-white/8 border border-transparent group-hover:border-white/10"
                            }
                          `}>
                            {/* Active indicator line */}
                            {isActive && (
                              <motion.div 
                                layoutId="activeIndicator"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-lg bg-gradient-to-b from-blue-400 to-blue-500 shadow-lg shadow-blue-500/30"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}

                            {/* Coloured icon box */}
                            <motion.div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                              style={{
                                background: isActive
                                  ? item.color
                                  : item.color + "1f",
                              }}
                              animate={{
                                scale: isActive ? 1.1 : 1,
                              }}
                            >
                              <Icon
                                size={19}
                                style={{ color: isActive ? "#fff" : item.color }}
                              />
                            </motion.div>

                            <span
                              className={`flex-1 text-left text-[14.5px] transition-all ${
                                isActive
                                  ? "font-bold text-white"
                                  : "font-medium text-white/70 group-hover:text-white/85"
                              }`}
                            >
                              {item.label}
                            </span>

                            {isBadge && appointmentsCount > 0 && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500/30 to-red-600/20 text-red-300 border border-red-500/40 shadow-lg shadow-red-500/20"
                              >
                                {appointmentsCount}
                              </motion.span>
                            )}

                            <motion.span 
                              animate={{ opacity: isActive ? 1 : 0.3 }}
                              className={`transition-colors ${isActive ? "text-white/60" : "text-white/20"}`}
                            >
                              <ChevronRight size={16} />
                            </motion.span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              {/* ── Extra actions ────────────────────────────────────────── */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 pt-5 space-y-2 border-t border-white/6"
              >
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => go("/pano/hesap-yonetimi")}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-transparent hover:bg-white/6 active:bg-white/8 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/15 group-hover:bg-purple-500/25 transition-colors">
                    <UserCog2 size={19} className="text-purple-400" />
                  </div>
                  <span className="flex-1 text-left text-[14.5px] font-medium text-white/70 group-hover:text-white">
                    Hesap Yönetimi
                  </span>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </motion.button>

                <motion.a
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.96 }}
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-transparent hover:bg-white/6 active:bg-white/8 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/15 group-hover:bg-emerald-500/25 transition-colors">
                    <SquareArrowOutUpRight
                      size={19}
                      className="text-emerald-400"
                    />
                  </div>
                  <span className="flex-1 text-left text-[14.5px] font-medium text-white/70 group-hover:text-white">
                    Sayfanızı Önizleyin
                  </span>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </motion.a>

                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-transparent hover:bg-red-500/10 active:bg-red-500/15 transition-all disabled:opacity-50 group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/15 group-hover:bg-red-500/25 transition-colors">
                    <LogOut size={19} className="text-red-400" />
                  </div>
                  <span className="flex-1 text-left text-[14.5px] font-medium text-red-400 group-hover:text-red-300">
                    {isLoggingOut ? "Çıkılıyor..." : "Çıkış Yap"}
                  </span>
                </motion.button>
              </motion.div>
            </div>

            {/* Version bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="shrink-0 px-5 py-4 border-t border-white/6 bg-white/3 backdrop-blur-sm"
            >
              <p className="text-center text-[10px] text-white/40 tracking-wider font-medium">
                Ayarlio v0.1.5 · BETA
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ─ bottom-left ────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isHiding && (
          <motion.div
            key="fab"
            initial={{ scale: 0, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-4 left-4 z-50"
          >
            {/* FAB Background glow effect */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.4)",
                  "0 0 30px rgba(59, 130, 246, 0.6)",
                  "0 0 20px rgba(59, 130, 246, 0.4)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl"
            />

            <motion.button
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Menüyü aç/kapat"
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center 
        focus:outline-none overflow-hidden shadow-2xl group"
            >
              {/* Gradient background */}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 opacity-95" />
              
              {/* Shimmer effect */}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
                    className="relative z-10"
                  >
                    <X size={28} className="text-white" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="m"
                    initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
                    className="relative z-10"
                  >
                    <MenuIcon size={28} className="text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
