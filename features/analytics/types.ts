export type MetricType = "revenue" | "appointments";

export type DateRange = "Son 7 Gün" | "Son 30 Gün" | "Bu Yıl";

export interface MonthlyDataItem {
  month: string;
  appointments: number;
  revenue: number;
  newCustomers: number;
}

export interface StaffMember {
  name: string;
  role: string;
  appointments: number;
  rating: number;
  revenue: string;
  avatar: string;
  color: string;
}

export interface HourlyDataItem {
  hour: string;
  pct: number;
}

export interface KpiItem {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  accent: string;
}