"use client";

import { BreadcrumbItem, Breadcrumbs, Button, Tooltip } from "@heroui/react";
import {
  Calendar,
  ChevronRight,
  HomeIcon,
  Plus,
  SearchIcon,
  LayoutDashboard,
  BarChart2,
  CalendarDays,
  CalendarCheck,
  Users,
  UserCheck,
  Inbox,
  Settings,
  ArrowUpDown,
  CornerDownLeft,
  CircleX,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import ShareQRCodeButton from "./ShareQRCodeButton";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GROUPS = [
  {
    group: "GENEL BAKIŞ",
    items: [
      { label: "Pano", sub: "Ana ekran", href: "/pano", icon: LayoutDashboard },
    ],
  },
  {
    group: "RANDEVULAR",
    items: [
      {
        label: "Takvim",
        sub: "Takvim görünümü",
        href: "/pano/takvim",
        icon: CalendarDays,
      },
      {
        label: "Randevular",
        sub: "Liste görünümü",
        href: "/pano/randevular",
        icon: CalendarCheck,
      },
    ],
  },
  {
    group: "İŞLETME",
    items: [
      {
        label: "Müşteriler",
        sub: "Müşteri yönetimi",
        href: "/pano/musteriler",
        icon: Users,
      },
      {
        label: "Personel",
        sub: "Ekip yönetimi",
        href: "/pano/personel",
        icon: UserCheck,
      },
      {
        label: "Hizmetler",
        sub: "Hizmet kataloğu",
        href: "/pano/hizmetler",
        icon: Inbox,
      },
    ],
  },
  {
    group: "SİSTEM",
    items: [
      {
        label: "Ayarlar",
        sub: "Sistem ayarları",
        href: "/pano/ayarlar",
        icon: Settings,
      },
      {
        label: "Hesap Yönetimi",
        sub: "Kullanıcı ve izinler",
        href: "/pano/hesap-yonetimi",
        icon: UserCheck,
      }
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

export default function Header({
  breadcrumb,
}: {
  breadcrumb: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [todayCount, setTodayCount] = useState<number | null>(null);

  const dashData = useDashboard();
  const tenant = dashData?.data?.tenant;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const protocol = rootDomain.includes("localhost") ? "http" : "https";
  const previewUrl = tenant?.slug
    ? `${protocol}://${tenant.slug}.${rootDomain}`
    : "#";

  const { data: appointmentsRes } = useSWR(
    "/api/tenant/appointments",
    fetcher,
    {
      refreshInterval: 60000,
    },
  );

  useEffect(() => {
    if (appointmentsRes?.data) {
      const todayList = appointmentsRes.data.filter((appt: any) => {
        const st = new Date(appt.startTime);
        const now = new Date();
        return (
          st.getDate() === now.getDate() &&
          st.getMonth() === now.getMonth() &&
          st.getFullYear() === now.getFullYear()
        );
      });
      setTodayCount(todayList.length);
    } else {
      setTodayCount(0);
    }
  }, [appointmentsRes]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setQuery("");
            setCursor(0);
          }
          return !o;
        });
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = query.trim()
    ? ALL_ITEMS.filter(
        (i) =>
          i.label.toLowerCase().includes(query.toLowerCase()) ||
          i.sub.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const showGroups = !query.trim();

  const flatList = showGroups ? ALL_ITEMS : filtered;

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const active = itemRefs.current[cursor];
    if (!active) return;
    active.scrollIntoView({ block: "nearest" });
  }, [cursor, open, query]);

  // Keyboard nav inside modal
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, flatList.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter" && flatList[cursor]) {
        router.push(flatList[cursor].href);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, flatList, cursor, router]);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  return (
    <>
      <header className="fixed top-5 right-4 z-30 flex items-center gap-3 px-5 justify-between h-15 left-72 bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-sm transition-[left] duration-300">
        <div className="flex-1 min-w-0 flex items-center">
          <Breadcrumbs>
            <BreadcrumbItem
              startContent={<HomeIcon className="size-5 mr-2" />}
              href="/pano"
            >
              Ayarlio [BETA]
            </BreadcrumbItem>
            <BreadcrumbItem>{breadcrumb}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <ShareQRCodeButton previewUrl={previewUrl} slug={tenant?.slug} />

        <Button
          onPress={() => {
            setOpen(true);
            setQuery("");
            setCursor(0);
          }}
          disableRipple
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 10,
            background: "#f8f9fc",
            border: "1px solid #e8eaf0",
            color: "#9ca3af",
            fontSize: 13,
            cursor: "pointer",
            width: 195,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <SearchIcon size={13} color="#9ca3af" />
            <span>Ara...</span>
          </div>
          <kbd
            style={{
              fontSize: 10,
              padding: "2px 5px",
              borderRadius: 5,
              background: "#e8eaf0",
              color: "#6b7280",
              border: "1px solid #d1d5db",
              lineHeight: 1.4,
            }}
          >
            ⌘K
          </kbd>
        </Button>

        <Tooltip
          content={
            todayCount !== null
              ? `Bugün ${todayCount} aktif randevu`
              : "Yükleniyor..."
          }
          closeDelay={0}
          placement="bottom"
        >
          <Button
            onPress={() => router.push("/pano/takvim")}
            variant="flat"
            size="sm"
            disableRipple
            startContent={<Calendar size={16} />}
            className="hidden lg:flex gap-1 text-[13px] text-gray-500 bg-gray-50 border border-gray-200 h-9 px-3"
          >
            {new Date().toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Button>
        </Tooltip>

        <Button
          radius="lg"
          size="sm"
          startContent={<Plus size={15} strokeWidth={2.5} />}
          className="gap-1.5 text-[13px] font-semibold text-white bg-linear-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200 h-9 px-4"
          onPress={() => {
            if (pathname === "/pano/takvim") {
              window.dispatchEvent(new CustomEvent("open-new-appointment"));
              return;
            }
            router.push("/pano/takvim?openNew=1");
          }}
        >
          <span className="hidden sm:block">Yeni Randevu</span>
        </Button>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "14vh",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 560,
              borderRadius: 16,
              background: "#ffffff",
              border: "1px solid #e8eaf0",
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              overflow: "hidden",
              margin: "0 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                borderBottom: "1px solid #f0f2f7",
              }}
            >
              <SearchIcon size={16} color="#9ca3af" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sayfa veya özellik ara..."
                autoComplete="off"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 15,
                  color: "#111827",
                  background: "none",
                }}
              />
              <Button
                isIconOnly
                variant="light"
                onPress={() => setOpen(false)}
                style={{
                  width: 64,
                  height: 32,
                  borderRadius: 6,
                  background: "#f4f6fb",
                  border: "1px solid #e8eaf0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <span className="ml-2">ESC</span>
                <CircleX size={14} className="mx-2" />
              </Button>
            </div>

            <div
              ref={listRef}
              style={{ maxHeight: 360, overflowY: "auto", padding: "8px 0" }}
            >
              {showGroups ? (
                GROUPS.map((g) => (
                  <div key={g.group}>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#9ca3af",
                        padding: "10px 18px 6px",
                      }}
                    >
                      {g.group}
                    </p>
                    {g.items.map((item) => {
                      const Icon = item.icon;
                      const idx = ALL_ITEMS.indexOf(item);
                      const active = cursor === idx;
                      return (
                        <button
                          key={item.href}
                          onClick={() => go(item.href)}
                          onMouseEnter={() => setCursor(idx)}
                          ref={(el) => {
                            itemRefs.current[idx] = el;
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "9px 18px",
                            border: "none",
                            background: active ? "#eff6ff" : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 9,
                              background: active ? "#dbeafe" : "#f4f6fb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icon
                              size={15}
                              color={active ? "#2563eb" : "#6b7280"}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: active ? "#2563eb" : "#111827",
                                margin: 0,
                              }}
                            >
                              {item.label}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#9ca3af",
                                margin: 0,
                              }}
                            >
                              {item.sub}
                            </p>
                          </div>
                          <ChevronRight
                            size={14}
                            color={active ? "#2563eb" : "#d1d5db"}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 20px",
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  "<strong style={{ color: "#374151" }}>{query}</strong>" için
                  sonuç bulunamadı
                </div>
              ) : (
                <>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      padding: "10px 18px 6px",
                    }}
                  >
                    SONUÇLAR
                  </p>
                  {filtered.map((item, i) => {
                    const Icon = item.icon;
                    const active = cursor === i;
                    return (
                      <button
                        key={item.href}
                        onClick={() => go(item.href)}
                        onMouseEnter={() => setCursor(i)}
                        ref={(el) => {
                          itemRefs.current[i] = el;
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "9px 18px",
                          border: "none",
                          background: active ? "#eff6ff" : "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: active ? "#dbeafe" : "#f4f6fb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon
                            size={15}
                            color={active ? "#2563eb" : "#6b7280"}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: active ? "#2563eb" : "#111827",
                              margin: 0,
                            }}
                          >
                            {item.label}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#9ca3af",
                              margin: 0,
                            }}
                          >
                            {item.sub}
                          </p>
                        </div>
                        <ChevronRight
                          size={14}
                          color={active ? "#2563eb" : "#d1d5db"}
                        />
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                padding: "10px 18px",
                borderTop: "1px solid #f0f2f7",
                background: "#fafafa",
              }}
            >
              {[
                { label: "Gezin", Icon: ArrowUpDown },
                { label: "Git", Icon: CornerDownLeft },
              ].map(({ label, Icon }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  >
                    <Icon size={12} />
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
