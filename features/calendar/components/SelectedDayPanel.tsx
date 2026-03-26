import { Appointment } from "../types";
import { MONTHS } from "../constants";

interface SelectedDayPanelProps {
  selectedDay: number;
  month: number;
  appointments: Appointment[];
  onAppointmentClick: (appt: Appointment, day: number) => void;
}

export default function SelectedDayPanel({
  selectedDay,
  month,
  appointments,
  onAppointmentClick
}: SelectedDayPanelProps) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8eaf0",
      borderRadius: 16,
      padding: 16
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10
      }}>
        {selectedDay} {MONTHS[month]}
      </div>
      {appointments.length > 0 ? (
        appointments.map(a => (
          <div
            key={a.id}
            onClick={() => onAppointmentClick(a, selectedDay)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 10px",
              borderRadius: 10,
              background: a.color + "0e",
              border: `1px solid ${a.color}22`,
              marginBottom: 6,
              cursor: "pointer"
            }}
          >
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: a.color,
              flexShrink: 0
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {a.label}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>
                {a.time} · {a.service.name}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ fontSize: 12, color: "#d1d5db" }}>
          Bu gün randevu yok.
        </div>
      )}
    </div>
  );
}