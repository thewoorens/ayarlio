"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  DateInput,
  TimeInput,
} from "@heroui/react";
import { parseDate, parseTime } from "@internationalized/date";
import {
  FormConfig,
  Status,
  SC,
  Customer,
  Service,
  StaffMember,
  toIsoFromDateValue,
  toHHMM,
} from "../types";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formConfig: FormConfig | null;
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig | null>>;
  isSaving: boolean;
  customers: Customer[];
  services: Service[];
  staffMembers: StaffMember[];
  onSave: () => void;
  onDelete: () => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
  formConfig,
  setFormConfig,
  isSaving,
  customers,
  services,
  staffMembers,
  onSave,
  onDelete,
}: AppointmentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center" scrollBehavior="inside">
      <ModalContent>
        {formConfig && (
          <>
            <ModalHeader>
              <span style={{ fontWeight: 700 }}>
                {formConfig.id ? "Randevu Düzenle" : "Yeni Randevu Ekle"}
              </span>
            </ModalHeader>
            <ModalBody>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Select
                  label="Müşteri"
                  selectedKeys={new Set([formConfig.customerId])}
                  onSelectionChange={(k) =>
                    setFormConfig((p) => p ? { ...p, customerId: [...k][0] as string } : p)
                  }
                  variant="bordered"
                  size="sm"
                  isRequired
                >
                  {customers.map((c) => (
                    <SelectItem key={c._id} textValue={`${c.name}`}>
                      {`${c.name}`}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Hizmet"
                  selectedKeys={new Set([formConfig.serviceId])}
                  onSelectionChange={(k) =>
                    setFormConfig((p) => p ? { ...p, serviceId: [...k][0] as string } : p)
                  }
                  variant="bordered"
                  size="sm"
                  isRequired
                >
                  {services.map((s) => (
                    <SelectItem key={s._id} textValue={s.name}>
                      {s.name} (₺{s.price})
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Personel"
                  selectedKeys={new Set([formConfig.staffId])}
                  onSelectionChange={(k) =>
                    setFormConfig((p) => p ? { ...p, staffId: [...k][0] as string } : p)
                  }
                  variant="bordered"
                  size="sm"
                  isRequired
                >
                  {staffMembers.map((st) => (
                    <SelectItem key={st._id} textValue={st.name}>
                      {st.name}
                    </SelectItem>
                  ))}
                </Select>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <DateInput
                    label="Tarih"
                    value={parseDate(formConfig.dateISO)}
                    onChange={(value) =>
                      setFormConfig((p) => {
                        if (!p || !value) return p;
                        return { ...p, dateISO: toIsoFromDateValue(value) };
                      })
                    }
                    variant="bordered"
                    size="sm"
                    isRequired
                  />
                  <TimeInput
                    label="Saat"
                    value={parseTime(formConfig.timeStr)}
                    onChange={(value) =>
                      setFormConfig((p) => {
                        if (!p || !value) return p;
                        return { ...p, timeStr: toHHMM(value) };
                      })
                    }
                    variant="bordered"
                    size="sm"
                    hourCycle={24}
                    granularity="minute"
                    isRequired
                  />
                </div>

                <Select
                  label="Durum"
                  selectedKeys={new Set([formConfig.status])}
                  onSelectionChange={(k) =>
                    setFormConfig((p) => p ? { ...p, status: [...k][0] as Status } : p)
                  }
                  variant="bordered"
                  size="sm"
                >
                  {(Object.keys(SC) as Status[]).map((s) => (
                    <SelectItem key={s}>{SC[s].label}</SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter className={formConfig.id ? "justify-between" : "justify-end"}>
              {formConfig.id && (
                <Button color="danger" variant="flat" onPress={onDelete} isLoading={isSaving}>
                  Sil
                </Button>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <Button variant="light" onPress={onClose}>
                  Vazgeç
                </Button>
                <Button color="primary" onPress={onSave} isLoading={isSaving} style={{ fontWeight: 700 }}>
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