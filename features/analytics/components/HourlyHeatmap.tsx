import type { HourlyDataItem } from "../types";

interface HourlyHeatmapProps {
  hourlyData: HourlyDataItem[];
}

const LEGEND_ITEMS = [
  { label: "Düşük", color: "#e8eaf0" },
  { label: "Orta", color: "rgba(59,130,246,0.35)" },
  { label: "Yüksek", color: "#3b82f6" },
];

export default function HourlyHeatmap({ hourlyData }: HourlyHeatmapProps) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e8eaf0" }}>
      <h2 className="text-[15px] font-semibold text-gray-900 mb-1" style={{ letterSpacing: "-0.01em" }}>
        Saatlik Yoğunluk
      </h2>
      <p className="text-[12px] mb-5" style={{ color: "#9ca3af" }}>
        Hangi saatler en kalabalık?
      </p>
      <div className="flex items-end gap-1.5 h-28">
        {hourlyData.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(h.pct / 100) * 90}px`,
                background:
                  h.pct > 80
                    ? "linear-gradient(180deg, #3b82f6, #2563eb)"
                    : h.pct > 50
                    ? "rgba(59,130,246,0.35)"
                    : "#e8eaf0",
              }}
            />
            <span className="text-[9px]" style={{ color: "#d1d5db" }}>
              {h.hour}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4">
        {LEGEND_ITEMS.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
            <span className="text-[11px]" style={{ color: "#9ca3af" }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}