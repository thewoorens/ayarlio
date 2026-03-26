"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { useState } from "react";
import { useCustomerStore } from "../store/useCustomerStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectCount: number;
}

export function DeleteCustomerModal({ isOpen, onClose, selectCount }: Props) {
  const store = useCustomerStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await store.deleteCustomers();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (selectCount === 0) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Silme Onayı</ModalHeader>
        <ModalBody>
          <div>
            {selectCount > 1
              ? `${selectCount} adet müşteri silinecek. Emin misiniz?`
              : "Bu müşteri silinecek. Emin misiniz?"}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>İptal</Button>
          <Button color="danger" isLoading={loading} onPress={handleSubmit}>Sil</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
