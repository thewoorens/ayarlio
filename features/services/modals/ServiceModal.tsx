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
  NumberInput,
} from "@heroui/react";
import { Trash2 } from "lucide-react";
import { Category, Staff, ServiceForm } from "../types";

const F = "Arial, sans-serif";

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
    >
      <ModalContent>
        <ModalHeader style={{ fontFamily: F, fontWeight: 700 }}>
          {editId !== null ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input
              label="Hizmet Adı"
              value={form.name}
              onValueChange={(v) => setForm((p) => ({ ...p, name: v }))}
              variant="bordered"
              size="sm"
              isRequired
              autoComplete="off"
            />
            <Select
              label="Kategori"
              selectedKeys={new Set([form.category])}
              onSelectionChange={(k) =>
                setForm((p) => ({ ...p, category: [...k][0] as string }))
              }
              variant="bordered"
              size="sm"
            >
              {cats.map((c) => (
                <SelectItem key={c.name}>{c.name}</SelectItem>
              ))}
            </Select>
            <div style={{ display: "flex", gap: 12 }}>
              <NumberInput
                label="Süre (dk)"
                minValue={0}
                value={form.duration.value}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    duration: {
                      ...p.duration,
                      value: Number(v) || 0,
                      unit: "minutes",
                    },
                  }))
                }
                variant="bordered"
                size="sm"
                style={{ flex: 1 }}
              />
              <Input
                label="Fiyat (₺)"
                type="number"
                value={form.price.toString()}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, price: parseInt(v) || 0 }))
                }
                variant="bordered"
                size="sm"
                style={{ flex: 1 }}
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
            />

            {/* Staff selection */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                Personel
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {staffList.map((stObj) => {
                  const stId = stObj._id;
                  const stName = stObj.name;
                  return (
                    <div
                      key={stId}
                      onClick={() => toggleStaff(stId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: form.staffIds.includes(stId)
                          ? "1px solid #bfdbfe"
                          : "1px solid #e8eaf0",
                        background: form.staffIds.includes(stId)
                          ? "#eff6ff"
                          : "#f8f9fc",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          border: form.staffIds.includes(stId)
                            ? "none"
                            : "1px solid #d1d5db",
                          background: form.staffIds.includes(stId)
                            ? "#2563eb"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {form.staffIds.includes(stId) && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: form.staffIds.includes(stId)
                            ? "#2563eb"
                            : "#374151",
                          fontWeight: form.staffIds.includes(stId) ? 600 : 400,
                        }}
                      >
                        {stName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 10,
                background: "#f8f9fc",
                border: "1px solid #e8eaf0",
              }}
            >
              <span style={{ fontSize: 13, color: "#374151" }}>Aktif</span>
              <Switch
                isSelected={form.isActive}
                onValueChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
                size="sm"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className={editId !== null ? "justify-between" : ""}>
          {editId !== null && (
            <Button
              color="danger"
              variant="flat"
              startContent={<Trash2 size={14} />}
              onPress={() => {
                onClose();
                onDelete(editId);
              }}
            >
              Sil
            </Button>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="light" onPress={onClose}>
              İptal
            </Button>
            <Button
              color="primary"
              isLoading={isSaving}
              onPress={onSave}
              style={{
                fontWeight: 700,
                background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              }}
            >
              {editId !== null ? "Kaydet" : "Ekle"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}