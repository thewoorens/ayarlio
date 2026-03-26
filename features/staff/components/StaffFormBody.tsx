"use client";
import { Input, Select, SelectItem, TimeInput } from "@heroui/react";
import { parseTime } from "@internationalized/date";
import {
  EditableStaff,
  Staff,
  SelectionKey,
  DAYS_ALL,
  FONT,
  onlyLetters,
  onlyDigits,
  toHHMM,
  toggleDay,
} from "../types";

interface StaffFormBodyProps<T extends EditableStaff> {
  form: T;
  set: (v: T) => void;
}

export function StaffFormBody<T extends EditableStaff>({
  form,
  set,
}: StaffFormBodyProps<T>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input
          label="Ad Soyad"
          value={form.name}
          onValueChange={(v: string) => set({ ...form, name: onlyLetters(v) })}
          variant="bordered"
          size="sm"
          isRequired
          autoComplete="off"
        />
        <Input
          label="Rol / Unvan"
          value={form.role}
          onValueChange={(v: string) => set({ ...form, role: v })}
          variant="bordered"
          size="sm"
          autoComplete="off"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input
          label="E-posta"
          value={form.email}
          onValueChange={(v: string) => set({ ...form, email: v })}
          variant="bordered"
          size="sm"
          autoComplete="off"
          type="email"
        />
        <Input
          label="Telefon"
          value={form.phone}
          onValueChange={(v: string) => set({ ...form, phone: onlyDigits(v) })}
          placeholder="05XXXXXXXXX"
          variant="bordered"
          size="sm"
          autoComplete="off"
          inputMode="numeric"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <TimeInput
          label="Başlangıç"
          variant="bordered"
          size="sm"
          hourCycle={24}
          granularity="minute"
          value={parseTime(form.startTime || "09:00")}
          onChange={(value) => {
            if (!value) return;
            set({ ...form, startTime: toHHMM(value) });
          }}
        />
        <TimeInput
          label="Bitiş"
          variant="bordered"
          size="sm"
          hourCycle={24}
          granularity="minute"
          value={parseTime(form.endTime || "18:00")}
          onChange={(value) => {
            if (!value) return;
            set({ ...form, endTime: toHHMM(value) });
          }}
        />
        <Select
          label="Durum"
          selectedKeys={new Set([form.status])}
          onSelectionChange={(k: SelectionKey) => {
            if (k === "all") return;
            const nextStatus = Array.from(k)[0] as Staff["status"] | undefined;
            if (!nextStatus) return;
            set({ ...form, status: nextStatus });
          }}
          variant="bordered"
          size="sm"
        >
          <SelectItem key="active">Aktif</SelectItem>
          <SelectItem key="leave">İzinde</SelectItem>
          <SelectItem key="inactive">Pasif</SelectItem>
        </Select>
      </div>
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Çalışma Günleri
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DAYS_ALL.map((d) => (
            <button
              key={d}
              onClick={() => toggleDay(form, d, set)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
                border: form.workDays.includes(d)
                  ? "1px solid #bfdbfe"
                  : "1px solid #e8eaf0",
                background: form.workDays.includes(d) ? "#eff6ff" : "#f8f9fc",
                color: form.workDays.includes(d) ? "#2563eb" : "#9ca3af",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}