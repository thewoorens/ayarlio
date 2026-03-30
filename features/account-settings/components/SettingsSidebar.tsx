"use client";
import { User, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsSidebarProps {
  activeTab: "profile" | "security" | "danger";
  onTabChange: (tab: "profile" | "security" | "danger") => void;
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const tabs = [
    { id: "profile", label: "Profil Bilgileri", icon: User },
    { id: "security", label: "Şifre Değiştir", icon: ShieldCheck },
    { id: "danger", label: "Hesap Güvenliği", icon: ShieldAlert },
  ];

  return (
    <div className="w-full lg:w-72 flex flex-col gap-2 shrink-0">
      <div className="p-1 bg-zinc-100/50 rounded-2xl flex flex-row lg:flex-col gap-1 backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`cursor-pointer relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 w-full group ${isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-800"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-zinc-200/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={`relative z-10 p-2 rounded-lg transition-colors duration-300 ${isActive ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                }`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <span className="relative z-10">{tab.label}</span>

              {!isActive && (
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
