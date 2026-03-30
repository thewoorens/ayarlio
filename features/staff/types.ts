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
  colorClass: string;
}

export const DAYS_ALL = ["Pzt", "Sal", "Çrş", "Prş", "Cum", "Cmt", "Paz"];

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
  { month: "Eyl", appt: 0, rev: 0 },
  { month: "Eki", appt: 0, rev: 0 },
  { month: "Kas", appt: 0, rev: 0 },
  { month: "Ara", appt: 0, rev: 0 },
  { month: "Oca", appt: 0, rev: 0 },
  { month: "Şub", appt: 0, rev: 0 },
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