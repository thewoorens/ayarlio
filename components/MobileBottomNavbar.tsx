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
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-gray-800 text-white overflow-hidden"
            style={{ maxHeight: "88vh" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center gap-3 px-5 pt-3 pb-4 shrink-0">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0">
                <Avatar />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold leading-tight truncate">
                  {user?.name || ""}
                </p>
                <p className="text-[12px] text-white/40 truncate">
                  {tenant?.name} · {user?.role === "admin" ? "Yönetici" : ""}
                </p>
              </div>
            </div>

            {/* ── Scrollable nav area ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {navigation.map((section, si) => (
                <div key={section.group} className={si > 0 ? "mt-5" : ""}>
                  {/* Group label */}
                  <p className="text-[10.5px] font-bold uppercase tracking-widest text-white/30 px-1 mb-2">
                    {section.group}
                  </p>

                  {/* Items */}
                  <div className="space-y-1">
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
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: si * 0.04 + ii * 0.03,
                            duration: 0.22,
                          }}
                          onClick={() => go(item.href)}
                          className={`
                            w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-colors
                            ${
                              isActive
                                ? "bg-white/12 border border-white/10"
                                : "hover:bg-white/6 active:bg-white/10 border border-transparent"
                            }
                          `}
                        >
                          {/* Coloured icon box */}
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: isActive
                                ? item.color
                                : item.color + "22",
                            }}
                          >
                            <Icon
                              size={18}
                              style={{ color: isActive ? "#fff" : item.color }}
                            />
                          </div>

                          <span
                            className={`flex-1 text-left text-[14.5px] ${
                              isActive
                                ? "font-bold text-white"
                                : "font-medium text-white/70"
                            }`}
                          >
                            {item.label}
                          </span>

                          {isBadge && appointmentsCount > 0 && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                              {appointmentsCount}
                            </span>
                          )}

                          <ChevronRight
                            size={15}
                            className={
                              isActive ? "text-white/60" : "text-white/20"
                            }
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* ── Extra actions ────────────────────────────────────────── */}
              <div className="mt-5 space-y-1">
                <div className="h-px bg-white/8 mb-3" />

                <button
                  onClick={() => go("/pano/hesap-yonetimi")}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border border-transparent hover:bg-white/6 active:bg-white/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/8">
                    <UserCog2 size={18} className="text-white/60" />
                  </div>
                  <span className="flex-1 text-left text-[14.5px] font-medium text-white/70">
                    Hesap Yönetimi
                  </span>
                  <ChevronRight size={15} className="text-white/20" />
                </button>

                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border border-transparent hover:bg-white/6 active:bg-white/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/8">
                    <SquareArrowOutUpRight
                      size={18}
                      className="text-white/60"
                    />
                  </div>
                  <span className="flex-1 text-left text-[14.5px] font-medium text-white/70">
                    Sayfanızı Önizleyin
                  </span>
                  <ChevronRight size={15} className="text-white/20" />
                </a>

                <button
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border border-white/5 hover:bg-red-500/10 active:bg-red-500/15 transition-colors disabled:opacity-40"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/15">
                    <LogOut size={18} className="text-red-400" />
                  </div>
                  <span className="flex-1 text-left text-[14.5px] font-medium text-red-400">
                    {isLoggingOut ? "Çıkılıyor..." : "Çıkış Yap"}
                  </span>
                </button>
              </div>
            </div>

            {/* Version bar */}
            <div className="shrink-0 px-5 py-3 border-t border-white/6">
              <p className="text-center text-[11px] text-white/25 tracking-wide">
                Ayarlio v0.1.5 · BETA
              </p>
            </div>
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
            className="fixed bottom-3 left-3 z-50"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Menüyü aç/kapat"
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center 
        focus:outline-none overflow-hidden shadow-2xl"
            >
              <span className="absolute inset-0 rounded-2xl bg-blue-500 opacity-90 blur-[2px]" />

              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <X size={24} className="text-white" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="m"
                    initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <MenuIcon size={26} className="text-white" />
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
