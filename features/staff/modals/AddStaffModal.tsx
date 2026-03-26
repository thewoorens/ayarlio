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
import { EditableStaff, FONT } from "../types";

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
        <ModalHeader style={{ fontFamily: FONT, fontWeight: 700 }}>
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
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              fontWeight: 700,
            }}
          >
            Ekle
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}