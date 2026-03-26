"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useState, useEffect } from "react";
import { ICustomer } from "../types";
import { useCustomerStore } from "../store/useCustomerStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: ICustomer | null;
}

export function EditCustomerModal({ isOpen, onClose, customer }: Props) {
  const store = useCustomerStore();
  const [form, setForm] = useState<ICustomer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(customer);
  }, [customer]);

  const handleSubmit = async () => {
    if (!form || !form._id) return;
    setLoading(true);
    try {
      await store.updateCustomer(form._id, form);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Müşteri Düzenle</ModalHeader>
        {form && (
          <>
            <ModalBody className="flex flex-col gap-3">
              <Input
                label="Ad"
                value={form.firstName}
                onValueChange={(v) => setForm((p) => p && { ...p, firstName: v })}
              />
              <Input
                label="Soyad"
                value={form.lastName}
                onValueChange={(v) => setForm((p) => p && { ...p, lastName: v })}
              />
              <Input
                label="E-posta"
                value={form.email}
                onValueChange={(v) => setForm((p) => p && { ...p, email: v })}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>İptal</Button>
              <Button color="primary" isLoading={loading} onPress={handleSubmit}>Kaydet</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
