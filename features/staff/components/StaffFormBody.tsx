"use client";
import { Input, Select, SelectItem, TimeInput } from "@heroui/react";
import { parseTime } from "@internationalized/date";
import {
  EditableStaff,
  Staff,
  SelectionKey,
  DAYS_ALL,
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
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
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
      <div className="grid grid-cols-2 gap-3">
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
      <div className="grid grid-cols-3 gap-3">
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
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
          Çalışma Günleri
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {DAYS_ALL.map((d) => {
            const isActive = form.workDays.includes(d);
            return (
              <button
                type="button"
                key={d}
                onClick={() => toggleDay(form, d, set)}
                className={`w-9 h-9 rounded-xl text-[11px] font-semibold transition-colors ${isActive
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-zinc-50 text-zinc-400 border border-zinc-200 hover:bg-zinc-100"
                  }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}