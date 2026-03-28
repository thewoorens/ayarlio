import type { Key } from "react";

export interface Staff {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
  phone: string;
  email: string;
  workDays: string[];
  startTime: string;
  endTime: string;
  status: "active" | "leave" | "inactive";
  appointments?: number;
  rating?: number;
}

export interface ApiListResponse<T> {
  data?: T[];
}

export type EditableStaff = Pick<
  Staff,
  "name" | "role" | "email" | "phone" | "startTime" | "endTime" | "status" | "workDays"
>;

export type SelectionKey = "all" | Set<Key>;

export interface StatusBadge {
  label: string;
  color: string;
  bg: string;
}

export const STATUS_BADGES: Record<Staff["status"], StatusBadge> = {
  active: { label: "Aktif", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  leave: { label: "İzinde", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  inactive: { label: "Pasif", color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};

export const DAYS_ALL = ["Pzt", "Sal", "Çrş", "Prş", "Cum", "Cmt", "Paz"];

export const FONT = "'DM Sans',Arial,sans-serif";

export const EMPTY_STAFF: Omit<Staff, "_id"> = {
  name: "",
  role: "",
  email: "",
  phone: "",
  status: "active",
  startTime: "09:00",
  endTime: "18:00",
  workDays: [],
};

export const PERF_DATA = [
  { month: "Eyl", appt: 52, rev: 6800 },
  { month: "Eki", appt: 61, rev: 7900 },
  { month: "Kas", appt: 58, rev: 7400 },
  { month: "Ara", appt: 74, rev: 9600 },
  { month: "Oca", appt: 81, rev: 11200 },
  { month: "Şub", appt: 98, rev: 14200 },
];

export const ini = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const onlyLetters = (v: string) =>
  v.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");

export const onlyDigits = (v: string) => v.replace(/\D/g, "").slice(0, 11);

export const toHHMM = (value: { hour: number; minute: number }) =>
  `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;

export const toggleDay = <T extends EditableStaff>(
  form: T,
  day: string,
  set: (v: T) => void
) =>
  set({
    ...form,
    workDays: form.workDays.includes(day)
      ? form.workDays.filter((d: string) => d !== day)
      : [...form.workDays, day],
  });