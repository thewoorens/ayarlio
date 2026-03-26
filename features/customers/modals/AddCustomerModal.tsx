"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem
} from "@heroui/react";

import { useState } from "react";
import { useCustomerStore } from "../store/useCustomerStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  notes: string;
}

const initialForm: CustomerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  isActive: true,
  notes: "",
};

export function AddCustomerModal({ isOpen, onClose }: Props) {
  const store = useCustomerStore();
  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      return;
    }

    setLoading(true);
    try {
      await store.createCustomer(form);
      setForm(initialForm);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} placement="center">
      <ModalContent>
        <ModalHeader className="font-bold mt-3">Yeni Müşteri Ekle</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ad"
                value={form.firstName}
                onValueChange={(v) => setForm((p) => ({ ...p, firstName: v }))}
                variant="bordered"
                size="sm"
                isRequired
                autoComplete="off"
                isInvalid={!form.firstName.trim() && form.firstName !== ""}
              />
              <Input
                label="Soyad"
                value={form.lastName}
                onValueChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
                variant="bordered"
                size="sm"
                isRequired
                autoComplete="off"
                isInvalid={!form.lastName.trim() && form.lastName !== ""}
              />
            </div>
            <Input
              label="E-posta"
              value={form.email}
              onValueChange={(v) => setForm((p) => ({ ...p, email: v }))}
              type="email"
              variant="bordered"
              size="sm"
              autoComplete="off"
              isRequired
              isInvalid={!form.email.trim() && form.email !== ""}
            />
            <Input
              label="Telefon"
              value={form.phone}
              onValueChange={(v) => setForm((p) => ({ ...p, phone: v }))}
              placeholder="05XXXXXXXXX"
              variant="bordered"
              size="sm"
              autoComplete="off"
              inputMode="numeric"
            />
            <Select
              label="Durum"
              selectedKeys={[form.isActive ? "active" : "passive"]}
              onSelectionChange={(keys) =>
                setForm((p) => ({
                  ...p,
                  isActive: Array.from(keys)[0] === "active",
                }))
              }
              variant="bordered"
              size="sm"
            >
              <SelectItem key="active">Aktif</SelectItem>
              <SelectItem key="passive">Pasif</SelectItem>
            </Select>
            <Input
              label="Not"
              value={form.notes}
              onValueChange={(v) => setForm((p) => ({ ...p, notes: v }))}
              variant="bordered"
              size="sm"
              autoComplete="off"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" size={"lg"} onPress={closeModal}>İptal</Button>
          <Button color="primary" onPress={handleSubmit} size={"lg"} isLoading={loading}>Ekle</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
