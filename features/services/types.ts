export interface Category {
  _id: string;
  name: string;
}

export interface ServiceDuration {
  value: number;
  unit: "minutes" | "hours" | "days" | "months" | "years";
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  duration: ServiceDuration;
  price: number;
  description: string;
  staffIds: string[];
  isActive: boolean;
}

export interface Staff {
  _id: string;
  name: string;
}

export interface ServiceForm {
  name: string;
  category: string;
  duration: ServiceDuration;
  price: number;
  description: string;
  staffIds: string[];
  isActive: boolean;
}

export interface CategoryForm {
  name: string;
}

export interface DeleteTarget {
  type: "svc" | "cat";
  ids: string[];
}

export const EMPTY_SERVICE_FORM: ServiceForm = {
  name: "",
  category: "",
  duration: { value: 30, unit: "minutes" },
  price: 0,
  description: "",
  staffIds: [],
  isActive: true,
};

export const UNIT_LABELS: Record<ServiceDuration["unit"], string> = {
  minutes: "dk",
  hours: "saat",
  days: "gün",
  months: "ay",
  years: "yıl",
};
