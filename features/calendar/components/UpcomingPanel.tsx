import { UpcomingAppointment } from "../types";
import { MONTHS } from "../constants";

interface UpcomingPanelProps {
  upcoming: UpcomingAppointment[];
  onAppointmentClick: (appt: UpcomingAppointment, day: number) => void;
}

export default function UpcomingPanel({ upcoming, onAppointmentClick }: UpcomingPanelProps) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8eaf0",
      borderRadius: 16,
      padding: 16,
      flex: 1
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10
      }}>
        Yaklaşan
      </div>
      {upcoming.map(a => (
        <div
          key={a.id}
          onClick={() => onAppointmentClick(a, a.day)}
          style={{
            padding: "9px 10px",
            borderRadius: 10,
            background: "#fafafa",
            border: "1px solid #f0f2f7",
            marginBottom: 6,
            cursor: "pointer"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
          onMouseLeave={e => e.currentTarget.style.background = "#fafafa"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: a.color,
              flexShrink: 0
            }} />
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#111827",
              flex: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}>
              {a.label}
            </span>
            <span style={{
              fontSize: 10,
              color: a.color,
              fontWeight: 600
            }}>
              {a.day} {MONTHS[a.month]}
            </span>
          </div>
          <div style={{
            fontSize: 11,
            color: "#9ca3af",
            paddingLeft: 11,
            marginTop: 2
          }}>
            {a.service.name} · {a.time}
          </div>
        </div>
      ))}
    </div>
  );
}