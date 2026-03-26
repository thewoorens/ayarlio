import type { StaffMember } from "../types";

interface StaffPerformanceProps {
  staffPerf: StaffMember[];
}

export default function StaffPerformance({ staffPerf }: StaffPerformanceProps) {
  const maxAppointments = Math.max(...staffPerf.map((s) => s.appointments));

  return (
    <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e8eaf0" }}>
      <h2 className="text-[15px] font-semibold text-gray-900 mb-1" style={{ letterSpacing: "-0.01em" }}>
        Personel Performansı
      </h2>
      <p className="text-[12px] mb-4" style={{ color: "#9ca3af" }}>
        Bu ayki randevu ve gelir dağılımı
      </p>
      <div className="space-y-3">
        {staffPerf.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full text-[11px] font-bold shrink-0"
              style={{
                width: 34,
                height: 34,
                background: s.color + "22",
                color: s.color,
                border: `1px solid ${s.color}`,
              }}
            >
              {s.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-medium" style={{ color: "#111827" }}>
                  {s.name}
                </span>
                <span className="text-[12px] font-semibold" style={{ color: s.color }}>
                  {s.revenue}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "#f4f6fb" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(s.appointments / maxAppointments) * 100}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-[11px] font-medium" style={{ color: "#6b7280" }}>
                {s.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}