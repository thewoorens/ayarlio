"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { CategoryForm } from "../types";

const F = "Arial, sans-serif";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  catForm: CategoryForm;
  setCatForm: React.Dispatch<React.SetStateAction<CategoryForm>>;
  onSave: () => void;
}

export function CategoryModal({
  isOpen,
  onClose,
  catForm,
  setCatForm,
  onSave,
}: CategoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader style={{ fontFamily: F, fontWeight: 700 }}>
              Yeni Kategori Ekle
            </ModalHeader>
            <ModalBody>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Input
                  label="Kategori Adı"
                  value={catForm.name}
                  onValueChange={(v) => setCatForm((p) => ({ ...p, name: v }))}
                  variant="bordered"
                  size="sm"
                  isRequired
                  placeholder="örn: Spa, Ağda..."
                  autoComplete="off"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onModalClose}>
                İptal
              </Button>
              <Button
                color="primary"
                onPress={onSave}
                style={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                }}
              >
                Ekle
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}