import type { KpiItem } from "../types";

interface KpiCardsProps {
  kpis: KpiItem[];
}

export default function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((k, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #e8eaf0" }}
        >
          <div
            className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
            style={{
              background: k.accent,
              opacity: 0.07,
              filter: "blur(25px)",
              transform: "translate(30%,-30%)",
            }}
          />
          <p className="text-[12px] mb-3" style={{ color: "#9ca3af" }}>
            {k.label}
          </p>
          <p className="text-[28px] font-bold text-gray-900" style={{ letterSpacing: "-0.04em" }}>
            {k.value}
          </p>
          <span
            className="text-[11px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full"
            style={{
              color: k.positive ? "#22c55e" : "#ef4444",
              background: k.positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            }}
          >
            {k.delta} bu ay
          </span>
        </div>
      ))}
    </div>
  );
}