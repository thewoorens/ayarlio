"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { UserPlus } from "lucide-react";

import { CustomerList } from "./components/CustomerList";
import { CustomerDetails } from "./components/CustomerDetails";

import { AddCustomerModal } from "./modals/AddCustomerModal";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { DeleteCustomerModal } from "./modals/DeleteCustomerModal";

import { useCustomers } from "./hooks/useCustomers";
import { ICustomer } from "./types";

function CustomersView() {
  const { customers, isLoading, deleteCustomer, deleteMultipleCustomers, createCustomer, updateCustomer } = useCustomers();
  
  // Selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Deletion tracking
  const [deleteIds, setDeleteIds] = useState<string[]>([]);

  const selectedCustomer =
    customers.find((c) => c._id === selectedId) ?? null;

  const openDeleteModal = (ids: string[]) => {
    setDeleteIds(ids);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteIds([]);
  };

  const handleDelete = async () => {
    if (deleteIds.length === 0) return;
    
    let success = false;
    if (deleteIds.length === 1) {
      success = await deleteCustomer(deleteIds[0]);
    } else {
      success = await deleteMultipleCustomers(deleteIds);
    }

    if (success) {
      if (selectedId && deleteIds.includes(selectedId)) {
        setSelectedId(null);
      }
      closeDeleteModal();
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-81px)] flex flex-col gap-5">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-xl font-bold">Müşterileriniz</h1>
          <p className="text-sm text-gray-400">
            {isLoading ? "Yükleniyor..." : `${customers.length} kayıtlı müşteri`}
          </p>
        </div>

        <Button
          startContent={<UserPlus size={16} />}
          color="primary"
          onPress={() => setIsAddModalOpen(true)}
        >
          Müşteri Ekle
        </Button>

      </div>

      {/* CONTENT */}

      <div className="flex flex-1 gap-4 min-h-0">

        {/* CUSTOMER LIST */}

        <CustomerList
          customers={customers}
          loading={isLoading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={openDeleteModal}
        />

        {/* CUSTOMER DETAILS */}

        <CustomerDetails
          loading={isLoading}
          customer={selectedCustomer}
          onEdit={() => setIsEditModalOpen(true)}
          onDelete={() =>
            selectedCustomer && openDeleteModal([selectedCustomer._id])
          }
        />

      </div>

      {/* MODALS */}

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
        onClose={closeDeleteModal}
        onSubmit={handleDelete}
        selectCount={deleteIds.length}
      />

    </div>
  );
}

export default CustomersView;
