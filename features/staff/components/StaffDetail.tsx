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
  return (
    <div
      className="flex-1 rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#fff", border: "1px solid #e8eaf0" }}
    >
      {/* Profil başlık */}
      <div
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderBottom: "1px solid #f0f2f7",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: sel.color + "22",
            color: sel.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            border: `2px solid ${sel.color}44`,
          }}
        >
          {sel.avatar || ini(sel.name)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
            {sel.name}
          </h2>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            {sel.role} · {sel.joinDate || "Yeni Kayıt"}
          </p>
          <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 1 }}>
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

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid #f0f2f7",
        }}
      >
        {(
          [
            ["Randevu", (sel.appointments || 0).toString()],
            ["Puan", `${sel.rating || 5.0}/5`],
            ["Gelir", sel.revenue || "₺0"],
          ] as [string, string][]
        ).map(([l, v]) => (
          <div
            key={l}
            style={{
              padding: 12,
              borderRadius: 12,
              background: "#fafafa",
              border: "1px solid #e8eaf0",
            }}
          >
            <p style={{ fontSize: 11, color: "#9ca3af" }}>{l}</p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.03em",
                marginTop: 4,
              }}
            >
              {v}
            </p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Performans Grafiği */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f0f2f7",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9ca3af",
              marginBottom: 12,
            }}
          >
            Son 6 Ay Performansı
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={PERF_DATA}
              barCategoryGap="35%"
              margin={{ top: 4, right: 4, left: -20, bottom: -10 }}
            >
              <CartesianGrid vertical={false} stroke="#f0f2f7" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#d1d5db" }}
                tickCount={4}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e8eaf0",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v) => [`${v ?? 0} randevu`]}
              />
              <Bar dataKey="appt" radius={[5, 5, 0, 0]} maxBarSize={36}>
                {PERF_DATA.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === PERF_DATA.length - 1 ? sel.color : "#e8eaf0"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Çalışma Saatleri + Günler */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            padding: "16px 20px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#9ca3af",
                marginBottom: 10,
              }}
            >
              Çalışma Saatleri
            </p>
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: "#fafafa",
                border: "1px solid #e8eaf0",
                marginBottom: 10,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                {sel.startTime} – {sel.endTime}
              </p>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {DAYS_ALL.map((d) => {
                const w = sel.workDays.includes(d);
                return (
                  <div
                    key={d}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 600,
                      background: w ? "rgba(59,130,246,0.12)" : "#f4f6fb",
                      color: w ? "#3b82f6" : "#9ca3af",
                      border: w
                        ? "1px solid rgba(59,130,246,0.2)"
                        : "1px solid #e8eaf0",
                    }}
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