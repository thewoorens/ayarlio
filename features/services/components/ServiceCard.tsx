"use client";
import { Checkbox } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { Service, Category, Staff } from "../types";

const F = "Arial, sans-serif";

interface ServiceCardProps {
  service: Service;
  cats: Category[];
  staffList: Staff[];
  isChecked: boolean;
  onToggleCheck: (id: string) => void;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceCard({
  service: s,
  cats,
  staffList,
  isChecked,
  onToggleCheck,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <div
      onClick={() => onEdit(s)}
      style={{
        borderRadius: 16,
        padding: 20,
        background: "#fff",
        border: isChecked ? "1px solid #bfdbfe" : "1px solid #e8eaf0",
        opacity: s.isActive ? 1 : 0.6,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!isChecked)
          e.currentTarget.style.borderColor = (s.color || "#e8eaf0") + "55";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isChecked
          ? "#bfdbfe"
          : "#e8eaf0";
      }}
    >
      {/* Left color bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 16,
          bottom: 16,
          width: 3,
          borderRadius: 99,
          background: s.category
            ? cats.find((c) => c.name === s.category)?.color ||
              s.color ||
              "#3b82f6"
            : s.color || "#3b82f6",
        }}
      />

      {/* Checkbox + Edit row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              isSelected={isChecked}
              onValueChange={() => onToggleCheck(s._id)}
              size="sm"
            />
          </div>
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 99,
                color: s.color || "#3b82f6",
                background: (s.color || "#3b82f6") + "18",
              }}
            >
              {s.category || "Kategori Yok"}
            </span>
            {!s.isActive && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 99,
                  color: "#6b7280",
                  background: "rgba(107,114,128,0.1)",
                  marginLeft: 6,
                }}
              >
                Pasif
              </span>
            )}
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                marginTop: 4,
                fontFamily: F,
              }}
            >
              {s.name}
            </h3>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(s);
            }}
            style={{
              padding: "6px 8px",
              borderRadius: 9,
              background: "rgba(59,130,246,0.1)",
              color: "#3b82f6",
              border: "none",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(s._id);
            }}
            style={{
              padding: "6px 8px",
              borderRadius: 9,
              background: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              border: "none",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 12,
          color: "#9ca3af",
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {s.description || "Açıklama yok"}
      </p>

      {/* Duration / bookings / price */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            ⏱ {s.duration?.value || 0}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            · {s.bookings || 0} rezervasyon
          </span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
          ₺{s.price}
        </span>
      </div>

      {/* Staff tags */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        {(s.staffIds || []).map((stId) => {
          const staffObj = staffList.find((x) => x._id === stId);
          return (
            <span
              key={stId}
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 99,
                background: "#f4f6fb",
                color: "#9ca3af",
                border: "1px solid #e8eaf0",
              }}
            >
              {staffObj ? staffObj.name : stId}
            </span>
          );
        })}
      </div>
    </div>
  );
}