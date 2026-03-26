import { ApiListResponse, Appointment, Customer, Service, StaffMember, Status } from '../types';

export const appointmentsApi = {
    fetchAppointments: async (): Promise<Appointment[]> => {
        const res = await fetch('/api/tenant/appointments');
        const data: ApiListResponse<Appointment> = await res.json();
        return data.data || [];
    },

    fetchCustomers: async (): Promise<Customer[]> => {
        const res = await fetch('/api/tenant/customers');
        const data: ApiListResponse<Customer> = await res.json();
        return data.data || [];
    },

    fetchServices: async (): Promise<Service[]> => {
        const res = await fetch('/api/tenant/services');
        const data: ApiListResponse<Service> = await res.json();
        return data.data || [];
    },

    fetchStaffMembers: async (): Promise<StaffMember[]> => {
        const res = await fetch('/api/tenant/staff');
        const data: ApiListResponse<StaffMember> = await res.json();
        return data.data || [];
    },

    createAppointment: async (payload: any): Promise<void> => {
        const res = await fetch('/api/tenant/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create appointment');
    },

    updateAppointment: async (id: string, payload: any): Promise<void> => {
        const res = await fetch(`/api/tenant/appointments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update appointment');
    },

    patchStatus: async (id: string, status: Status): Promise<void> => {
        const res = await fetch(`/api/tenant/appointments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to patch status');
    },

    deleteAppointment: async (id: string): Promise<void> => {
        const res = await fetch(`/api/tenant/appointments/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete appointment');
    },
};
