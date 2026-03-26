"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Album,
  CalendarFold,
  ChartLine,
  LayoutDashboard,
  Settings,
  User2,
  Users2,
  WalletCards,
  Ellipsis,
  SquareArrowOutUpRight,
  LogOut,
  GitCommitVerticalIcon,
  HelpCircleIcon,
  CreditCardIcon,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Divider,
  Button,
  Avatar,
  Spinner,
} from "@heroui/react";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const navigation = [
  {
    group: "Genel Bakış",
    items: [
      { label: "Pano", href: "/pano", icon: LayoutDashboard }
    ],
  },
  {
    group: "Randevular",
    items: [
      {
        label: "Takvim",
        href: "/pano/takvim",
        icon: CalendarFold,
        badge: "appointments_count",
      },
      { label: "Randevular", href: "/pano/randevular", icon: Album },
    ],
  },
  {
    group: "İşletme",
    items: [
      { label: "Müşteriler", href: "/pano/musteriler", icon: Users2 },
      { label: "Personel", href: "/pano/personel", icon: User2 },
      { label: "Hizmetler", href: "/pano/hizmetler", icon: WalletCards },
    ],
  },
  {
    group: "Sistem",
    items: [{ label: "Ayarlar", href: "/pano/ayarlar", icon: Settings }],
  },
];

interface SidebarProps {
  user?: any;
  tenant?: any;
  appointmentsCount?: number;
}

export default function Sidebar({
  user,
  tenant,
  appointmentsCount,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/giris-yap");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2) || "U";

  const previewUrl =
    tenant?.slug && process.env.NEXT_PUBLIC_ROOT_DOMAIN
      ? `https://${tenant.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      : "#";

  return (
    <aside className="fixed top-4 left-4 bottom-4 w-64 z-40 flex flex-col rounded-2xl select-none bg-white border border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-1 px-5 py-3.5 border-b border-gray-100">
        <Image
          src="/ayarlio-logo.png"
          alt="Ayarlio Logo"
          width={45}
          height={45}
          className="object-contain shrink-0"
          priority
        />

        <GitCommitVerticalIcon size={20} className="text-gray-400" />

        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 text-[13px] truncate">
            {tenant?.name}
          </span>
          <span className="text-[11px] text-gray-400 truncate">
            {tenant?.industry}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navigation.map((section) => (
          <div key={section.group}>
            <p className="px-3 mb-1.5 text-[10.5px] font-bold uppercase tracking-widest text-gray-400">
              {section.group}
            </p>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/pano" && pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                      ${isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                    >
                      <Icon
                        size={17}
                        className={
                          isActive
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }
                      />

                      <span
                        className={`flex-1 text-[13px] ${isActive ? "font-semibold" : "font-medium"
                          }`}
                      >
                        {item.label}
                      </span>

                      {item.badge === "appointments_count" &&
                        appointmentsCount &&
                        appointmentsCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-500">
                            {appointmentsCount}
                          </span>
                        )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Preview */}
      <div className="px-3 pb-2">
        <Link
          href={previewUrl}
          target="_blank"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all group"
        >
          <SquareArrowOutUpRight size={16} />
          Sayfanızı Önizleyin
        </Link>
      </div>

      {/* User */}
      <div className="px-3 pb-3 border-t border-gray-100 pt-2.5">
        <Popover
          isOpen={isUserPopoverOpen}
          onOpenChange={setIsUserPopoverOpen}
          placement="top"
        >
          <PopoverTrigger>
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-gray-50">
              <Avatar
                className="text-white text-[11px] font-bold"
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                }}
              >
                {initials}
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 truncate">
                  {user?.name || ""}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {user?.role === "admin" ? "Yönetici" : ""}
                </p>
              </div>

              <Ellipsis size={16} className="text-gray-400" />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-56 rounded-2xl shadow-xl border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <Avatar
                className="text-white text-[11px] font-bold"
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                }}
              >
                {initials}
              </Avatar>

              <div>
                <p className="text-[13px] font-semibold text-gray-900">
                  {user?.name || ""}
                </p>
                <p className="text-[11px] text-gray-400">{user?.role}</p>
              </div>
            </div>

            <div className="px-2 py-1 flex flex-col gap-1">
              <Button variant="light" className="w-full flex">
                <CreditCardIcon size={15} />
                Paketler
              </Button>

              <Button
                variant="light"
                color="danger"
                className="w-full flex"
                isLoading={isLoggingOut}
                onPress={handleLogout}
              >
                {!isLoggingOut && <LogOut size={15} />}
                Çıkış Yap
              </Button>

              <Divider className="my-1" />

              <Button variant="light" className="w-full flex">
                <HelpCircleIcon size={15} />
                Yardım Merkezi
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="text-xs text-center text-gray-400 mt-1">
          Ayarlio v0.1.0 [BETA]
        </div>
      </div>
    </aside>
  );
}
