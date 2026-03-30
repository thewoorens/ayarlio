"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Trash2 } from "lucide-react";
import { Staff } from "../types";

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  delIds: string[];
  staffList: Staff[];
  onConfirm: () => void;
}

export function DeleteStaffModal({
  isOpen,
  onClose,
  delIds,
  staffList,
  onConfirm,
}: DeleteStaffModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader className="font-bold text-red-600 flex items-center gap-2">
              <Trash2 size={15} />
              Silme Onayı
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {delIds.length === 1
                  ? `"${staffList.find((s) => s._id === delIds[0])?.name}" silinecek. Emin misiniz?`
                  : `${delIds.length} personel silinecek. Emin misiniz?`}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Bu işlem geri alınamaz.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onModalClose}>
                İptal
              </Button>
              <Button
                color="danger"
                onPress={onConfirm}
                startContent={<Trash2 size={14} />}
                className="font-bold"
              >
                {delIds.length > 1 ? `${delIds.length} Personeli Sil` : "Sil"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}