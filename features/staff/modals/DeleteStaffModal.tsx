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
            <ModalHeader style={{ fontWeight: 700, color: "#dc2626" }}>
              <div className="flex items-center gap-2">
                <Trash2 size={15} />
                Silme Onayı
              </div>
            </ModalHeader>
            <ModalBody>
              <p style={{ fontSize: 13, color: "#374151" }}>
                {delIds.length === 1
                  ? `"${staffList.find((s) => s._id === delIds[0])?.name}" silinecek. Emin misiniz?`
                  : `${delIds.length} personel silinecek. Emin misiniz?`}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
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
                style={{ fontWeight: 700 }}
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