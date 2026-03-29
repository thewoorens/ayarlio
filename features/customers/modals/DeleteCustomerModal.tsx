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
import { AlertCircle, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  selectCount: number;
}

export function DeleteCustomerModal({ isOpen, onClose, onSubmit, selectCount }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (selectCount === 0 && !isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="sm" 
      className="bg-white"
      placement="center"
    >
      <ModalContent className="p-1">
        <ModalHeader className="flex gap-3 items-center">
           <div className="p-2 bg-red-100 text-red-600 rounded-full">
             <AlertCircle size={20} />
           </div>
           <h2 className="text-xl font-bold">Silme Onayı</h2>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600">
              {selectCount > 1
                ? <><span className="font-bold text-gray-900">{selectCount} adet müşteri</span> kaydı kalıcı olarak silinecek. Bu işlemi geri alamazsınız.</>
                : <>Bu müşteri kaydı kalıcı olarak <span className="font-bold text-gray-900">silinecek</span>. Emin misiniz?</>}
            </p>
            <p className="text-xs text-gray-400">Silinen müşteriye ait randevu geçmişi ve istatistikler etkilenebilir.</p>
          </div>
        </ModalBody>
        <ModalFooter className="gap-2">
          <Button variant="light" onPress={onClose} isDisabled={loading} className="font-medium">Vazgeç</Button>
          <Button 
            color="danger" 
            isLoading={loading} 
            onPress={handleSubmit} 
            className="font-bold px-8 shadow-sm"
            startContent={!loading && <Trash2 size={16} />}
          >
            Sil
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
