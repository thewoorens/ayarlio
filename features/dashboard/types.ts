export type Appointment = {
  id: string;
  name: string;
  service: string;
  time: string;
  staff: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  avatar: string;
  color: string;
};

export type DashboardData = {
  tenant: {
    name: string;
    slug: string;
    industry: string;
  };
  user: {
    name: string;
    role: string;
  };

  stats: {
    totalAppointments: number;
    activeCustomers: number;
    totalRevenue: number;
    cancelRate: string;
  };

  charts: {
    weekly: { day: string; value: number }[];
    monthly: { day: string; value: number }[];
  };

  topServices: {
    id: string;
    name: string;
    count: number;
    pct: number;
    color: string;
  }[];

  today: {
    dateString: string;
    appointments: Appointment[];
  };
};
