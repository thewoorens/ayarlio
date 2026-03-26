import { ICustomer } from '../types';

export interface ApiListResponse<T> {
    data?: T[];
}

export const customersApi = {
    fetchCustomers: async (): Promise<ICustomer[]> => {
        const res = await fetch('/api/tenant/customers');
        const data: ApiListResponse<ICustomer> = await res.json();
        return data.data || [];
    },

    createCustomer: async (payload: Partial<ICustomer>): Promise<void> => {
        const res = await fetch('/api/tenant/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create customer');
    },

    updateCustomer: async (id: string, payload: Partial<ICustomer>): Promise<void> => {
        const res = await fetch(`/api/tenant/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update customer');
    },

    deleteCustomer: async (id: string): Promise<void> => {
        const res = await fetch(`/api/tenant/customers/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete customer');
    },
};
