import { create } from 'zustand';
import { ICustomer } from '../types';
import { customersApi } from '../api/customers.api';

interface State {
    customers: ICustomer[];
    isLoading: boolean;
    selectedId: string | null;
    // Modal states
    isAddModalOpen: boolean;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    // Selected IDs for deletion (can be one or multiple)
    deleteIds: string[];
}

interface Actions {
    loadCustomers: () => Promise<void>;
    setSelectedId: (id: string | null) => void;

    // Modal controllers
    setAddModalOpen: (isOpen: boolean) => void;
    setEditModalOpen: (isOpen: boolean) => void;
    openDeleteModal: (ids: string[]) => void;
    closeDeleteModal: () => void;

    // Data operations
    createCustomer: (data: Partial<ICustomer>) => Promise<void>;
    updateCustomer: (id: string, data: Partial<ICustomer>) => Promise<void>;
    deleteCustomers: () => Promise<void>; // Operates on deleteIds
}

export const useCustomerStore = create<State & Actions>((set, get) => ({
    customers: [],
    isLoading: false,
    selectedId: null,

    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    deleteIds: [],

    loadCustomers: async () => {
        set({ isLoading: true });
        try {
            const customers = await customersApi.fetchCustomers();
            set({ customers, isLoading: false });
        } catch (error) {
            console.error('Failed to load customers:', error);
            set({ isLoading: false });
        }
    },

    setSelectedId: (id) => set({ selectedId: id }),

    setAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
    setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),

    openDeleteModal: (ids) => set({ isDeleteModalOpen: true, deleteIds: ids }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, deleteIds: [] }),

    createCustomer: async (data) => {
        try {
            await customersApi.createCustomer(data);
            await get().loadCustomers();
        } catch (error) {
            console.error('Create error', error);
            throw error;
        }
    },

    updateCustomer: async (id, data) => {
        try {
            await customersApi.updateCustomer(id, data);
            await get().loadCustomers();
        } catch (error) {
            console.error('Update error', error);
            throw error;
        }
    },

    deleteCustomers: async () => {
        const { deleteIds } = get();
        if (deleteIds.length === 0) return;

        try {
            // Execute deletions sequentially or purely in parallel depending on needs
            // Here we do sequentially to not overwhelm backend, or parallel with Promise.all
            await Promise.all(deleteIds.map(id => customersApi.deleteCustomer(id)));

            await get().loadCustomers();

            // If the currently selected customer was deleted, clear it
            set((state) => ({
                selectedId: state.deleteIds.includes(state.selectedId || '') ? null : state.selectedId,
                isDeleteModalOpen: false,
                deleteIds: []
            }));
        } catch (error) {
            console.error('Delete error', error);
            throw error;
        }
    },
}));
