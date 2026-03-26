"use client";
import { Chip, Button } from "@heroui/react";
import {
  Appointment,
  Status,
  SC,
  formatDateTR,
  formatTimeTR,
  getAvatarConfig,
} from "../types";

interface AppointmentDetailProps {
  appointment: Appointment;
  onClose: () => void;
  onEdit: (a: Appointment) => void;
  onPatchStatus: (id: string, status: Status) => void;
}

export function AppointmentDetail({
  appointment: sel,
  onClose,
  onEdit,
  onPatchStatus,
}: AppointmentDetailProps) {
  const avatar = getAvatarConfig(sel.customerId?.firstName, sel.customerId?.lastName);
  const statusConfig = SC[sel.status] || SC.pending;

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        borderRadius: 16,
        border: "1px solid #e8eaf0",
        background: "#fff",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Detay</span>
        <button
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            background: "#f4f6fb",
            color: "#9ca3af",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      {/* Avatar + name */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          paddingBottom: 14,
          borderBottom: "1px solid #f0f2f7",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: avatar.color + "25",
            color: avatar.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            border: `2px solid ${avatar.color}44`,
          }}
        >
          {avatar.initials}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
          {`${sel.customerId?.firstName || ""} ${sel.customerId?.lastName || ""}`}
        </span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{sel.customerId?.phone}</span>
        <Chip size="sm" variant="flat" color={statusConfig.color}>
          {statusConfig.label}
        </Chip>
      </div>

      {/* Detail rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
        {(
          [
            ["Hizmet", sel.serviceId?.name || ""],
            ["Personel", sel.staffId?.name || "Bilinmeyen"],
            ["Tarih", formatDateTR(sel.startTime)],
            ["Saat", formatTimeTR(sel.startTime)],
            [
              "Süre",
              sel.serviceId?.duration
                ? `${sel.serviceId.duration.value} ${sel.serviceId.duration.unit === "minutes" ? "dk" : sel.serviceId.duration.unit}`
                : "-",
            ],
            ["Ücret", sel.serviceId?.price ? `₺${sel.serviceId.price}` : "-"],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#9ca3af" }}>{k}</span>
            <span style={{ fontWeight: 600, color: "#374151", textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="text-gray-400 p-2">
          Randevu Kodu: <b className="text-black">{sel?.code}</b>
        </span>
        <Button color="primary" size="sm" fullWidth onPress={() => onEdit(sel)} style={{ fontWeight: 700 }}>
          Düzenle
        </Button>
        <Button color="danger" variant="flat" size="sm" fullWidth onPress={() => onPatchStatus(sel._id, "cancelled")}>
          İptal Et
        </Button>
      </div>
    </div>
  );
}