"use client";
import { Button } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Staff, DAYS_ALL, PERF_DATA, ini } from "../types";

interface StaffDetailProps {
  staff: Staff;
  onEdit: (s: Staff) => void;
  onDelete: (id: string) => void;
}

export function StaffDetail({ staff: sel, onEdit, onDelete }: StaffDetailProps) {
  const displayAvatar = sel.avatar || ini(sel.name);

  return (
    <div className="flex-1 rounded-2xl overflow-hidden flex flex-col bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="p-5 flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="w-[60px] h-[60px] shrink-0 rounded-full flex items-center justify-center text-xl font-bold bg-zinc-100 text-zinc-600 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
          {displayAvatar}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 m-0">
            {sel.name}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {sel.role}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {sel.email} · {sel.phone}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            startContent={<Pencil size={13} />}
            variant="flat"
            onPress={() => onEdit(sel)}
          >
            Düzenle
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            startContent={<Trash2 size={13} />}
            onPress={() => onDelete(sel._id)}
          >
            Sil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 border-b border-zinc-100 dark:border-zinc-800">
        {[
          ["Randevu", (sel.appointments || 0).toString()],
          ["Puan", `${sel.rating || "5.0"}/5`],
        ].map(([l, v]) => (
          <div
            key={l}
            className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800"
          >
            <p className="text-[11px] text-zinc-500">{l}</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
              {v}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-xs font-bold text-zinc-400 mb-3">
            Son 6 Ay Performansı
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={PERF_DATA}
              barCategoryGap="35%"
              margin={{ top: 4, right: 4, left: -20, bottom: -10 }}
            >
              <CartesianGrid vertical={false} stroke="#f4f4f5" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#d4d4d8" }}
                tickCount={4}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e4e4e7",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v) => [`${v ?? 0} randevu`]}
              />
              <Bar dataKey="appt" radius={[5, 5, 0, 0]} maxBarSize={36}>
                {PERF_DATA.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === PERF_DATA.length - 1 ? "#3b82f6" : "#e4e4e7"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5">
              Çalışma Saatleri
            </p>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800 mb-2.5">
              <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                {sel.startTime} – {sel.endTime}
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {DAYS_ALL.map((d) => {
                const w = sel.workDays.includes(d);
                return (
                  <div
                    key={d}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold transition-colors ${w
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      : "bg-zinc-50 text-zinc-400 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                      }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}