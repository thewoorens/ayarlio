"use client";
import { Button } from "@heroui/react";

interface SectionTitleProps {
  title: string;
  sub?: string;
}
export function SectionTitle({ title, sub }: SectionTitleProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
        {title}
      </p>
      {sub && (
        <p style={{ fontSize: 12, color: "#9ca3af", margin: "3px 0 0" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

interface RowProps {
  label: string;
  sub?: string;
  children: React.ReactNode;
}
export function Row({ label, sub, children }: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 0",
        borderBottom: "1px solid #f4f6fb",
      }}
    >
      <div>
        <p
          style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: 0 }}
        >
          {label}
        </p>
        {sub && (
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>
            {sub}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0, marginLeft: 24 }}>{children}</div>
    </div>
  );
}

interface SaveBtnProps {
  saved: boolean;
  onSave: () => void;
}
export function SaveBtn({ saved, onSave }: SaveBtnProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 8,
      }}
    >
      <Button
        color={saved ? "success" : "primary"}
        onPress={onSave}
        style={{
          background: saved
            ? "linear-gradient(135deg,#22c55e,#16a34a)"
            : "linear-gradient(135deg,#3b82f6,#2563eb)",
          color: "#fff",
          fontWeight: 700,
          transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
          transform: saved ? "scale(1.04)" : "scale(1)",
        }}
      >
        {saved ? "✓ Kaydedildi" : "Kaydet"}
      </Button>
    </div>
  );
}

export const cardStyle: React.CSSProperties = {
  border: "1px solid #e8eaf0",
  borderRadius: 16,
  boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
  transition: "box-shadow 0.2s",
  background: "#fff",
};
