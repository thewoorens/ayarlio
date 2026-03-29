"use client";

import useSWR from 'swr';
import { ICustomer } from '../types';
import { useToast } from '@/components/ToastProvider';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCustomers() {
    const { showToast } = useToast();
    const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: ICustomer[] }>(
        '/api/tenant/customers',
        fetcher
    );

    const [isMutating, setIsMutating] = useState(false);

    const customers = data?.data || [];

    const createCustomer = async (formData: Partial<ICustomer>): Promise<ICustomer | null> => {
        setIsMutating(true);
        try {
            const res = await fetch('/api/tenant/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();

            if (result.success) {
                showToast('Müşteri başarıyla eklendi', 'success');
                mutate(); // Refresh the list
                return result.data;
            } else {
                showToast(result.message || 'Müşteri eklenirken hata oluştu', 'error');
                return null;
            }
        } catch (err) {
            console.error(err);
            showToast('Bir hata oluştu', 'error');
            return null;
        } finally {
            setIsMutating(false);
        }
    };

    const updateCustomer = async (id: string, formData: Partial<ICustomer>): Promise<ICustomer | null> => {
        setIsMutating(true);
        try {
            const res = await fetch(`/api/tenant/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();

            if (result.success) {
                showToast('Müşteri güncellendi', 'success');
                mutate(); // Refresh the list
                return result.data;
            } else {
                showToast(result.message || 'Güncelleme hatası', 'error');
                return null;
            }
        } catch (err) {
            console.error(err);
            showToast('Bir hata oluştu', 'error');
            return null;
        } finally {
            setIsMutating(false);
        }
    };

    const deleteCustomer = async (id: string) => {
        setIsMutating(true);
        try {
            const res = await fetch(`/api/tenant/customers/${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();

            if (result.success) {
                showToast('Müşteri silindi', 'success');
                mutate(); // Refresh the list
                return true;
            } else {
                showToast(result.message || 'Silme hatası', 'error');
                return false;
            }
        } catch (err) {
            console.error(err);
            showToast('Bir hata oluştu', 'error');
            return false;
        } finally {
            setIsMutating(false);
        }
    };

    const deleteMultipleCustomers = async (ids: string[]) => {
        setIsMutating(true);
        let successCount = 0;
        try {
            for (const id of ids) {
                const res = await fetch(`/api/tenant/customers/${id}`, {
                    method: 'DELETE',
                });
                const result = await res.json();
                if (result.success) successCount++;
            }

            if (successCount > 0) {
                showToast(`${successCount} müşteri başarıyla silindi`, 'success');
                mutate();
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            showToast('Bazı müşteriler silinirken hata oluştu', 'error');
            return false;
        } finally {
            setIsMutating(false);
        }
    };

    return {
        customers,
        isLoading,
        isError: error,
        isMutating,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        deleteMultipleCustomers,
        refresh: mutate
    };
}
