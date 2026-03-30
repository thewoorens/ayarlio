"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { StaffFormBody } from "../components/StaffFormBody";
import { Staff } from "../types";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: Staff | null;
  setForm: (v: Staff) => void;
  isSaving: boolean;
  onSave: () => void;
  onDelete: (id: string) => void;
}

export function EditStaffModal({
  isOpen,
  onClose,
  form,
  setForm,
  isSaving,
  onSave,
  onDelete,
}: EditStaffModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        {form && (
          <>
            <ModalHeader className="font-bold text-lg">
              Personel Düzenle
            </ModalHeader>
            <ModalBody>
              <StaffFormBody form={form} set={setForm} />
            </ModalBody>
            <ModalFooter className="justify-between">
              <Button
                color="danger"
                variant="flat"
                startContent={<Trash2 size={14} />}
                onPress={() => {
                  onClose();
                  onDelete(form._id);
                }}
              >
                Sil
              </Button>
              <div className="flex gap-2">
                <Button variant="light" onPress={onClose}>
                  İptal
                </Button>
                <Button
                  color="primary"
                  isLoading={isSaving}
                  onPress={onSave}
                  startContent={<Pencil size={14} />}
                  className="font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                >
                  Kaydet
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}