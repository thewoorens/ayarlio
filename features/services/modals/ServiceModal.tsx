"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
} from "@heroui/react";
import { Trash2, Check } from "lucide-react";
import { Category, Staff, ServiceForm, UNIT_LABELS, ServiceDuration } from "../types";
import Link from "next/link";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editId: string | null;
  form: ServiceForm;
  setForm: React.Dispatch<React.SetStateAction<ServiceForm>>;
  isSaving: boolean;
  cats: Category[];
  staffList: Staff[];
  onSave: () => void;
  onDelete: (id: string) => void;
  toggleStaff: (stId: string) => void;
}

export function ServiceModal({
  isOpen,
  onClose,
  editId,
  form,
  setForm,
  isSaving,
  cats,
  staffList,
  onSave,
  onDelete,
  toggleStaff,
}: ServiceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent className="rounded-2xl">
        <ModalHeader className="text-xl font-bold tracking-tight text-gray-900 pb-2">
          {editId !== null ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}
        </ModalHeader>
        <ModalBody className="py-2">
          <div className="flex flex-col gap-4">
            <Input
              label="Hizmet Adı"
              value={form.name}
              onValueChange={(v) => setForm((p) => ({ ...p, name: v }))}
              variant="bordered"
              size="sm"
              isRequired
              autoComplete="off"
              classNames={{ inputWrapper: "shadow-sm" }}
            />
            <Select
              label="Kategori"
              selectedKeys={new Set([form.category])}
              onSelectionChange={(k) =>
                setForm((p) => ({ ...p, category: [...k][0] as string }))
              }
              variant="bordered"
              size="sm"
              classNames={{ trigger: "shadow-sm" }}
            >
              {cats.map((c) => (
                <SelectItem key={c.name}>{c.name}</SelectItem>
              ))}
            </Select>
            <div className="flex gap-3">
              <Input
                label="Süre"
                type="number"
                value={form.duration.value.toString()}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    duration: {
                      ...p.duration,
                      value: Number(v) || 0,
                    },
                  }))
                }
                variant="bordered"
                size="sm"
                className="flex-1"
                classNames={{ inputWrapper: "shadow-sm" }}
              />
              <Select
                label="Birim"
                selectedKeys={new Set([form.duration.unit])}
                onSelectionChange={(k) =>
                  setForm((p) => ({
                    ...p,
                    duration: {
                      ...p.duration,
                      unit: [...k][0] as ServiceDuration["unit"],
                    },
                  }))
                }
                variant="bordered"
                size="sm"
                className="flex-1"
                classNames={{ trigger: "shadow-sm" }}
              >
                {Object.entries(UNIT_LABELS).map(([key, val]) => (
                  <SelectItem key={key}>{val}</SelectItem>
                ))}
              </Select>
              <Input
                label="Fiyat (₺)"
                type="number"
                value={form.price.toString()}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, price: parseInt(v) || 0 }))
                }
                variant="bordered"
                size="sm"
                className="flex-1"
                classNames={{ inputWrapper: "shadow-sm" }}
              />
            </div>
            <Textarea
              label="Açıklama"
              value={form.description}
              onValueChange={(v) => setForm((p) => ({ ...p, description: v }))}
              variant="bordered"
              size="sm"
              minRows={2}
              autoComplete="off"
              classNames={{ inputWrapper: "shadow-sm" }}
            />

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                Personel
              </p>
              <div className="flex flex-col gap-2">
                {staffList.length > 0 ? staffList.map((stObj) => {
                  const stId = stObj._id;
                  const stName = stObj.name;
                  const isSelected = form.staffIds.includes(stId);

                  return (
                    <div
                      key={stId}
                      onClick={() => toggleStaff(stId)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer transition-colors duration-200
                        ${isSelected ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"}
                      `}
                    >
                      <div
                        className={`
                          w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors
                          ${isSelected ? "bg-blue-600 border-none" : "border border-gray-300 bg-white"}
                        `}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                      </div>
                      <span
                        className={`text-sm ${isSelected ? "text-blue-700 font-semibold" : "text-gray-700 font-medium"}`}
                      >
                        {stName}
                      </span>
                    </div>
                  );
                }) : <span className="text-sm text-gray-500">Personel bulunamadı. <Link href="/pano/personel" className="text-blue-500">Personel ekle</Link></span>}
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 mt-1">
              <span className="text-sm font-medium text-gray-700">Aktif Hizmet</span>
              <Switch
                isSelected={form.isActive}
                onValueChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
                size="sm"
                color="primary"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className={`pt-3 pb-5 px-6 ${editId !== null ? "justify-between" : ""}`}>
          {editId !== null && (
            <Button
              color="danger"
              variant="flat"
              startContent={<Trash2 size={16} />}
              onPress={() => {
                onClose();
                onDelete(editId);
              }}
              className="font-medium bg-red-50 hover:bg-red-100 text-red-600"
              radius="lg"
            >
              Sil
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button
              variant="flat"
              onPress={onClose}
              radius="lg"
            >
              İptal
            </Button>
            <Button
              color="primary"
              isLoading={isSaving}
              onPress={onSave}
              radius="lg"
            >
              {editId !== null ? "Kaydet" : "Ekle"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}