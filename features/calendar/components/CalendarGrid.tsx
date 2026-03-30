import { Appointment, DragState } from "../types";
import { DAYS } from "../constants";

interface CalendarGridProps {
  cells: (number | null)[];
  selectedDay: number;
  month: number;
  year: number;
  appointmentsMap: Record<number, Appointment[]>;
  overDay: number | null;
  onDayClick: (day: number) => void;
  onAppointmentClick: (appt: Appointment, day: number) => void;
  onDragStart: (appt: Appointment, day: number) => void;
  onDragOver: (day: number) => void;
  onDragLeave: () => void;
  onDrop: (day: number) => void;
}

export default function CalendarGrid({
  cells,
  selectedDay,
  month,
  year,
  appointmentsMap,
  overDay,
  onDayClick,
  onAppointmentClick,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop
}: CalendarGridProps) {
  const today = new Date();

  return (
    <div style={{
      flex: 1,
      background: "#fff",
      border: "1px solid #e8eaf0",
      borderRadius: 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid #f0f2f7" }}>
        {DAYS.map(d => (
          <div
            key={d}
            style={{
              padding: "9px 0",
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: 1
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridAutoRows: "1fr", flex: 1 }}>
        {cells.map((day, i) => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSelected = day === selectedDay;
          const isDragOver = day === overDay;
          const appts = day ? (appointmentsMap[day] || []) : [];

          return (
            <div
              key={i}
              onClick={() => day && onDayClick(day)}
              onDragOver={e => {
                if (day) {
                  e.preventDefault();
                  onDragOver(day);
                }
              }}
              onDragLeave={onDragLeave}
              onDrop={() => day && onDrop(day)}
              style={{
                borderRight: (i + 1) % 7 === 0 ? "none" : "1px solid #f0f2f7",
                borderBottom: i < cells.length - 7 ? "1px solid #f0f2f7" : "none",
                background: isDragOver ? "#eff6ff" : isSelected ? "#f8fbff" : "#fff",
                padding: "5px 4px",
                cursor: day ? "pointer" : "default",
                overflow: "hidden"
              }}
            >
              {day && (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
                    <span style={{
                      width: 21,
                      height: 21,
                      borderRadius: "50%",
                      fontSize: 11,
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? "#fff" : isSelected ? "#2563eb" : "#6b7280",
                      background: isToday ? "#3b82f6" : isSelected ? "#dbeafe" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {day}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {appts.slice(0, 3).map(a => (
                      <div
                        key={a.id}
                        draggable
                        onDragStart={e => {
                          e.stopPropagation();
                          onDragStart(a, day);
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          onAppointmentClick(a, day);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          padding: "2px 5px",
                          borderRadius: 4,
                          background: a.color + "15",
                          cursor: "grab",
                          userSelect: "none"
                        }}
                      >
                        <span style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: a.color,
                          flexShrink: 0
                        }} />
                        <span style={{
                          fontSize: 10,
                          color: a.color,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          fontWeight: 500
                        }}>
                          {a.label}
                        </span>
                      </div>
                    ))}
                    {appts.length > 3 && (
                      <span style={{ fontSize: 9, color: "#9ca3af", paddingLeft: 3 }}>
                        +{appts.length - 3} daha
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}