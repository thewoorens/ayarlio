import { ArrowLeft, ArrowRight } from "lucide-react";
import { MONTHS } from "../constants";

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onAddAppointment: () => void;
}

export default function CalendarHeader({
  month,
  year,
  onPrev,
  onNext,
  onAddAppointment
}: CalendarHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.03em" }}>
          {MONTHS[month]} {year}
        </h1>
        <button
          onClick={onPrev}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: "1px solid #e8eaf0",
            background: "#f8f9fc",
            cursor: "pointer",
            fontSize: 17,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ArrowLeft size={14} color="#334155" />
        </button>
        <button
          onClick={onNext}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: "1px solid #e8eaf0",
            background: "#f8f9fc",
            cursor: "pointer",
            fontSize: 17,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ArrowRight size={14} color="#334155" />
        </button>
      </div>
      <button
        onClick={onAddAppointment}
        style={{
          padding: "8px 18px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#3b82f6,#2563eb)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 13,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(59,130,246,0.3)"
        }}
      >
        Randevu Ekle
      </button>
    </div>
  );
}