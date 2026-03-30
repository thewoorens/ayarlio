"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertOctagon, Trash2 } from "lucide-react";

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
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center" backdrop="blur">
      <ModalContent className="rounded-2xl">
        {(onModalClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-2">
              <div className="flex items-center gap-3 text-red-600">
                <h2 className="text-lg tracking-tight">Kalıcı Olarak Sil</h2>
              </div>
            </ModalHeader>
            <ModalBody className="py-4">
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                <span className="text-gray-900">{delLabel}</span> kalıcı olarak silinecek. Bu işleme devam etmek istediğinize emin misiniz?
              </p>
              <p className="text-xs text-gray-500 mt-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                Bu işlem geri alınamaz ve veriler tamamen kaybolur.
              </p>
            </ModalBody>
            <ModalFooter className="flex gap-3 pt-3 pb-5 pr-6">
              <Button
                variant="flat"
                color="default"
                onPress={onModalClose}
                className="font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                radius="lg"
              >
                Vazgeç
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm();
                }}
                startContent={<Trash2 size={16} />}
                className="font-semibold shadow-sm"
                radius="lg"
              >
                Evet, Sil
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}