"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { UserPlus } from "lucide-react";
import { StaffFormBody } from "../components/StaffFormBody";
import { EditableStaff } from "../types";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: EditableStaff;
  setForm: (v: EditableStaff) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function AddStaffModal({
  isOpen,
  onClose,
  form,
  setForm,
  isSaving,
  onSave,
}: AddStaffModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="font-bold text-lg">
          Yeni Personel Ekle
        </ModalHeader>
        <ModalBody>
          <StaffFormBody form={form} set={setForm} />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            İptal
          </Button>
          <Button
            color="primary"
            isLoading={isSaving}
            onPress={onSave}
            startContent={<UserPlus size={14} />}
            className="font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          >
            Ekle
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}