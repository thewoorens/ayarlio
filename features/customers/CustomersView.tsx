"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";
import { UserPlus } from "lucide-react";

import { CustomerList } from "./components/CustomerList";
import { CustomerDetails } from "./components/CustomerDetails";

import { AddCustomerModal } from "./modals/AddCustomerModal";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { DeleteCustomerModal } from "./modals/DeleteCustomerModal";

import { useCustomerStore } from "./store/useCustomerStore";

function CustomersView() {
  const store = useCustomerStore();

  useEffect(() => {
    store.loadCustomers();
  }, [store.loadCustomers]);

  const selectedCustomer =
    store.customers.find((c) => c._id === store.selectedId) ?? null;

  return (
    <div className="p-6 h-[calc(100vh-81px)] flex flex-col gap-5">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-xl font-bold">Müşterileriniz</h1>
          <p className="text-sm text-gray-400">
            {store.isLoading ? "Yükleniyor..." : `${store.customers.length} kayıtlı müşteri`}
          </p>
        </div>

        <Button
          startContent={<UserPlus size={16} />}
          color="primary"
          onPress={() => store.setAddModalOpen(true)}
        >
          Müşteri Ekle
        </Button>

      </div>

      {/* CONTENT */}

      <div className="flex flex-1 gap-4 min-h-0">

        {/* CUSTOMER LIST */}

        <CustomerList
          customers={store.customers}
          loading={store.isLoading}
          onDelete={(id) => store.openDeleteModal([id])}
        />

        {/* CUSTOMER DETAILS */}

        <CustomerDetails
          loading={store.isLoading}
          customer={selectedCustomer}
          onEdit={() => store.setEditModalOpen(true)}
          onDelete={() =>
            selectedCustomer && store.openDeleteModal([selectedCustomer._id])
          }
        />

      </div>

      {/* MODALS */}

      <AddCustomerModal
        isOpen={store.isAddModalOpen}
        onClose={() => store.setAddModalOpen(false)}
      />

      <EditCustomerModal
        isOpen={store.isEditModalOpen}
        onClose={() => store.setEditModalOpen(false)}
        customer={selectedCustomer}
      />

      <DeleteCustomerModal
        isOpen={store.isDeleteModalOpen}
        onClose={store.closeDeleteModal}
        selectCount={store.deleteIds.length}
      />

    </div>
  );
}

export default CustomersView;
