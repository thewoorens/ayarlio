"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";

import { MobileCustomerList } from "./components/mobile/MobileCustomerList";
import { MobileCustomerDetails } from "./components/mobile/MobileCustomerDetails";

import { AddCustomerModal } from "./modals/AddCustomerModal";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { DeleteCustomerModal } from "./modals/DeleteCustomerModal";

import { useCustomers } from "./hooks/useCustomers";
import { ICustomer } from "./types";

export function MobileCustomersView() {
  const { 
    customers, 
    isLoading, 
    deleteCustomer, 
    createCustomer, 
    updateCustomer 
  } = useCustomers();
  
  // Selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Modal states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selectedCustomer = customers.find((c) => c._id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsDetailsOpen(true);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteAsk = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    
    const success = await deleteCustomer(selectedId);
    if (success) {
      setIsDeleteModalOpen(false);
      setIsDetailsOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      
      {/* HEADER */}
      <div className="bg-white px-4 py-4 pt-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Müşteriler</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-0.5">
            {isLoading ? "Yükleniyor..." : `${customers.length} kayıtlı müşteri`}
          </p>
        </div>
        
        <Button
          isIconOnly
          color="primary"
          radius="full"
          className="shadow-md shadow-blue-500/20"
          onPress={() => setIsAddModalOpen(true)}
        >
          <Plus size={22} />
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 bg-white">
        <MobileCustomerList
          customers={customers}
          loading={isLoading}
          onSelect={handleSelect}
        />
      </div>

      {/* DETAILS MODAL (Full Screen) */}
      <MobileCustomerDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        customer={selectedCustomer}
        onEdit={handleEdit}
        onDelete={handleDeleteAsk}
      />

      {/* ACTION MODALS */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={createCustomer}
      />

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={selectedCustomer}
        onSubmit={async (form) => selectedId ? updateCustomer(selectedId, form) : null}
      />

      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteConfirm}
        selectCount={1} // Mobile view currently only supports single delete from details view
      />
      
    </div>
  );
}

export default MobileCustomersView;
