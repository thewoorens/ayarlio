export type Status = "confirmed" | "pending" | "cancelled" | "completed";

export interface PopulatedCustomer {
  _id: string;
  name: string;
  phone: string;
  email: string;
}

export interface PopulatedService {
  _id: string;
  name: string;
  duration: { value: number; unit: string };
  price: number;
  color: string;
}

export interface PopulatedStaff {
  _id: string;
  name: string;
  email: string;
}

export interface Appointment {
  _id: string;
  customerId: PopulatedCustomer;
  serviceId: PopulatedService;
  staffId: PopulatedStaff;
  code: string;
  startTime: string;
  endTime: string;
  status: Status;
  notes?: string;
  cancellationReason?: string;
}

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: { value: number; unit: string };
}

export interface StaffMember {
  _id: string;
  name: string;
}

export interface ApiListResponse<T> {
  data?: T[];
}

export interface FormConfig {
  id?: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  dateISO: string;
  timeStr: string;
  status: Status;
}

export interface StatusBadge {
  label: string;
  color: "success" | "warning" | "danger" | "secondary";
}

export const SC: Record<Status, StatusBadge> = {
  confirmed: { label: "Onaylandı", color: "success" },
  pending: { label: "Bekliyor", color: "warning" },
  cancelled: { label: "İptal", color: "danger" },
  completed: { label: "Tamamlandı", color: "secondary" },
};

export const TABS = [
  { l: "Tümü", v: "all" },
  { l: "Onaylandı", v: "confirmed" },
  { l: "Bekliyor", v: "pending" },
  { l: "Tamamlandı", v: "completed" },
  { l: "İptal", v: "cancelled" },
] as const;

export type TabValue = (typeof TABS)[number]["v"];

const NUM_TO_TR_MONTH = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
] as const;

export const formatDateTR = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.valueOf())) return "";
  return `${d.getDate()} ${NUM_TO_TR_MONTH[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatTimeTR = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.valueOf())) return "";
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
};

export const toIsoDateString = (dateStr: string): string | undefined => {
  const d = new Date(dateStr);
  if (isNaN(d.valueOf())) return undefined;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const toTimeString = (dateStr: string): string | undefined => {
  const d = new Date(dateStr);
  if (isNaN(d.valueOf())) return undefined;
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
};

export const toIsoFromDateValue = (value: { year: number; month: number; day: number }): string =>
  `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`;

export const toHHMM = (value: { hour: number; minute: number }): string =>
  `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;

export const getAvatarConfig = (name?: string) => {
  const parts = name?.trim().split(/\s+/).filter(Boolean) || [];
  const f = parts[0]?.[0] || "";
  const l = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return { initials: (f + l).toUpperCase(), color: "#3b82f6" };
};