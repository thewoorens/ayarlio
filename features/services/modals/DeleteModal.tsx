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

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  delLabel: string;
  onConfirm: () => void;
}

export function DeleteModal({
  isOpen,
  onClose,
  delLabel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader style={{ fontWeight: 700, color: "#dc2626" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Trash2 size={15} />
                Silme Onayı
              </div>
            </ModalHeader>
            <ModalBody>
              <p style={{ fontSize: 13, color: "#374151" }}>
                {delLabel} silinecek. Emin misiniz?
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
                Sil
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}