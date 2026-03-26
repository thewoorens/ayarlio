import { create } from 'zustand';
import { Appointment, Customer, Service, StaffMember, Status, FormConfig } from '../types';
import { appointmentsApi } from '../api/appointments.api';

interface State {
    appointments: Appointment[];
    customers: Customer[];
    services: Service[];
    staffMembers: StaffMember[];
    isLoading: boolean;
    isSaving: boolean;

    search: string;
    tab: Status | 'all';
    selId: string | null;

    isModalOpen: boolean;
    formConfig: FormConfig | null;
}

interface Actions {
    loadInitialData: () => Promise<void>;
    setSearch: (search: string) => void;
    setTab: (tab: Status | 'all') => void;
    setSelId: (id: string | null) => void;

    openAddModal: (config: FormConfig) => void;
    openEditModal: (config: FormConfig) => void;
    closeModal: () => void;
    setFormConfig: (updater: FormConfig | null | ((prev: FormConfig | null) => FormConfig | null)) => void;

    saveAppointment: () => Promise<void>;
    deleteAppointment: () => Promise<void>;
    patchStatus: (id: string, status: Status) => Promise<void>;
}

export const useAppointmentStore = create<State & Actions>((set, get) => ({
    appointments: [],
    customers: [],
    services: [],
    staffMembers: [],
    isLoading: false,
    isSaving: false,

    search: '',
    tab: 'all',
    selId: null,

    isModalOpen: false,
    formConfig: null,

    loadInitialData: async () => {
        set({ isLoading: true });
        try {
            const [appointments, customers, services, staffMembers] = await Promise.all([
                appointmentsApi.fetchAppointments(),
                appointmentsApi.fetchCustomers(),
                appointmentsApi.fetchServices(),
                appointmentsApi.fetchStaffMembers(),
            ]);
            set({ appointments, customers, services, staffMembers, isLoading: false });
        } catch (error) {
            console.error('Failed to load initial data:', error);
            set({ isLoading: false });
        }
    },

    setSearch: (search) => set({ search }),
    setTab: (tab) => set({ tab }),
    setSelId: (selId) => set({ selId }),

    openAddModal: (config) => set({ isModalOpen: true, formConfig: config }),
    openEditModal: (config) => set({ isModalOpen: true, formConfig: config }),
    closeModal: () => set({ isModalOpen: false, formConfig: null }),
    setFormConfig: (updater) => set((state) => ({
        formConfig: typeof updater === 'function' ? updater(state.formConfig) : updater
    })),

    saveAppointment: async () => {
        const { formConfig, services, loadInitialData } = get();
        if (!formConfig || !formConfig.customerId || !formConfig.serviceId || !formConfig.staffId) return;

        set({ isSaving: true });
        try {
            const formService = services.find((s) => s._id === formConfig.serviceId);
            const minutesToAdd = formService?.duration?.value || 30;

            const startTime = new Date(`${formConfig.dateISO}T${formConfig.timeStr}:00`);
            const endTime = new Date(startTime.getTime() + minutesToAdd * 60000);

            const payload = {
                customerId: formConfig.customerId,
                serviceId: formConfig.serviceId,
                staffId: formConfig.staffId,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: formConfig.status,
            };

            if (formConfig.id) {
                await appointmentsApi.updateAppointment(formConfig.id, payload);
            } else {
                await appointmentsApi.createAppointment(payload);
            }

            await loadInitialData();
            set({ isModalOpen: false, isSaving: false });
        } catch (error) {
            console.error('Save error', error);
            set({ isSaving: false });
        }
    },

    deleteAppointment: async () => {
        const { formConfig, loadInitialData } = get();
        if (!formConfig?.id) return;

        set({ isSaving: true });
        try {
            await appointmentsApi.deleteAppointment(formConfig.id);
            await loadInitialData();
            set({ selId: null, isModalOpen: false, isSaving: false });
        } catch (error) {
            console.error('Delete error', error);
            set({ isSaving: false });
        }
    },

    patchStatus: async (id, status) => {
        const { loadInitialData } = get();
        try {
            await appointmentsApi.patchStatus(id, status);
            await loadInitialData();
        } catch (error) {
            console.error('Patch status error', error);
        }
    },
}));
