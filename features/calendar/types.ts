export interface Appointment {
  id: string;
  label: string;
  phone?: string;
  email?: string;
  color: string;
  time: string;
  service: any;
  staff: any;
  tenantId?: string;
  customerId?: string;
  originalDate?: Date;
}

export interface UpcomingAppointment extends Appointment {
  day: number;
  month: number;
}

export interface DragState {
  appt: Appointment;
  from: number;
}

export type ModalState =
  | { type: "edit"; appt: Appointment; day: number }
  | { type: "detail"; appt: Appointment; day: number }
  | { type: "add"; day: number }
  | null;

export interface Service {
  _id: string;
  name: string;
  color?: string;
  duration?: {
    value: number;
    unit: 'minutes' | 'hours';
  };
  tenantId?: string;
}

export interface Staff {
  _id: string;
  name: string;
  tenantId?: string;
}