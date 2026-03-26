import { Appointment } from "../types";
import { MONTHS } from "../constants";

interface AppointmentDetailModalProps {
  appointment: Appointment;
  day: number;
  month: number;
  year: number;
  onClose: () => void;
  onEdit: () => void;
}

export default function AppointmentDetailModal({
  appointment,
  day,
  month,
  year,
  onClose,
  onEdit
}: AppointmentDetailModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.28)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          border: "1px solid #e8eaf0",
          borderRadius: 20,
          padding: 24,
          width: 300,
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
            Randevu Detayı
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#9ca3af",
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "16px 0",
          borderBottom: "1px solid #f0f2f7",
          marginBottom: 16
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: appointment.color + "20",
            color: appointment.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700
          }}>
            {appointment.label.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
            {appointment.label}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            {day} {MONTHS[month]} {year}
          </div>
        </div>

        {[
          ["Hizmet", appointment.service?.name],
          ["Personel", appointment.staff?.name],
          ["Saat", appointment.time]
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
            <span style={{ color: "#9ca3af" }}>{k}</span>
            <span style={{ fontWeight: 600, color: "#374151" }}>{v}</span>
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 12,
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #bfdbfe",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13
            }}
          >
            Düzenle
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 12,
              background: "#f4f6fb",
              color: "#6b7280",
              border: "1px solid #e8eaf0",
              cursor: "pointer",
              fontSize: 13
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}