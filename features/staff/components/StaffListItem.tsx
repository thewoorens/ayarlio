"use client";
import { Checkbox } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { Staff, STATUS_BADGES, ini } from "../types";

interface StaffListItemProps {
  staff: Staff;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StaffListItem({
  staff: s,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
  onDelete,
}: StaffListItemProps) {
  const sb = STATUS_BADGES[s.status];
  const displayAvatar = s.avatar || ini(s.name);

  return (
    <div
      onClick={() => onSelect(s._id)}
      className="group"
      style={{
        padding: 14,
        borderRadius: 16,
        cursor: "pointer",
        background: isSelected ? "rgba(59,130,246,0.08)" : "transparent",
        border: isSelected
          ? "1px solid rgba(59,130,246,0.25)"
          : "1px solid transparent",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            isSelected={isChecked}
            onValueChange={() => onToggleCheck(s._id)}
            size="sm"
          />
        </div>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: s.color + "22",
              color: s.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              border: `1.5px solid ${s.color}44`,
            }}
          >
            {displayAvatar}
          </div>
          {s.status === "active" && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#22c55e",
                border: "1.5px solid #f4f6fb",
              }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <p
              className="truncate"
              style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
            >
              {s.name}
            </p>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 99,
                color: sb.color,
                background: sb.bg,
                flexShrink: 0,
              }}
            >
              {sb.label}
            </span>
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{s.role}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
            <span style={{ fontSize: 11, color: "#d1d5db" }}>
              {s.appointments || 0} randevu
            </span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>
              ⭐ {s.rating || 5.0}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(s._id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ef4444",
            padding: 4,
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}