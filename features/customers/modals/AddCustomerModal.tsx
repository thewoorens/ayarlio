"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch
} from "@heroui/react";

import { useState } from "react";
import { ICustomer } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ICustomer>) => Promise<ICustomer | null>;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  notes: string;
}

const initialForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  isActive: true,
  notes: "",
};

export function AddCustomerModal({ isOpen, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Ad Soyad gereklidir";
    if (!form.email.trim()) newErrors.email = "E-posta gereklidir";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Geçersiz e-posta formatı";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await onSubmit(form);
      if (result) {
        setForm(initialForm);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={closeModal} 
      placement="center"
      className="bg-white"
      size="md"
    >
      <ModalContent className="p-2">
        <ModalHeader className="flex flex-col gap-1">
           <h2 className="text-xl font-bold">Yeni Müşteri Ekle</h2>
           <p className="text-xs text-gray-400 font-normal">Müşteri bilgilerini girerek yeni bir kayıt oluşturun.</p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4 py-2">
            <Input
              label="Ad Soyad"
              value={form.name}
              onValueChange={(v) => {
                setForm((p) => ({ ...p, name: v }));
                if (errors.name) setErrors(e => { const { name, ...rest } = e; return rest; });
              }}
              placeholder="Ahmet Yılmaz"
              labelPlacement="outside"
              variant="bordered"
              isRequired
              autoComplete="off"
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
            
            <Input
              label="E-posta"
              value={form.email}
              onValueChange={(v) => {
                setForm((p) => ({ ...p, email: v }));
                if (errors.email) setErrors(e => { const { email, ...rest } = e; return rest; });
              }}
              type="email"
              placeholder="ahmet@example.com"
              labelPlacement="outside"
              variant="bordered"
              isRequired
              autoComplete="off"
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            
            <div className="flex gap-4">
              <Input
                label="Telefon"
                value={form.phone}
                onValueChange={(v) => setForm((p) => ({ ...p, phone: v }))}
                placeholder="05XXXXXXXXX"
                labelPlacement="outside"
                variant="bordered"
                autoComplete="off"
                inputMode="numeric"
                className="flex-1"
              />
              
              <div className="flex flex-col gap-2 min-w-24">
                 <span className="text-sm font-medium">Durum</span>
                 <Switch 
                  isSelected={form.isActive} 
                  onValueChange={(v) => setForm(p => ({ ...p, isActive: v }))}
                  size="sm"
                  color="success"
                 >
                   <span className="text-xs">{form.isActive ? "Aktif" : "Pasif"}</span>
                 </Switch>
              </div>
            </div>

            <Textarea
              label="Notlar"
              value={form.notes}
              onValueChange={(v) => setForm((p) => ({ ...p, notes: v }))}
              placeholder="Müşteri hakkında özel notlar..."
              labelPlacement="outside"
              variant="bordered"
              minRows={3}
            />
          </div>
        </ModalBody>
        <ModalFooter className="gap-3">
          <Button variant="light" onPress={closeModal} isDisabled={loading}>Vazgeç</Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading} className="px-8 font-bold">Kaydet</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
