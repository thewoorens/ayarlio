import { Select, SelectItem, TimeInput, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { parseTime } from "@internationalized/date";
import { Appointment, Service, Staff } from "../types";
import { MONTHS } from "../constants";
import { onlyLetters, onlyDigits, toHHMM } from "../utils/calendarUtils";

interface AppointmentModalProps {
  type: "edit" | "add";
  appointment?: Appointment;
  day: number;
  month: number;
  year: number;
  
  label: string;
  email: string;
  phone: string;
  time: string;
  serviceId: string;
  staffId: string;
  
  services: Service[];
  staff: Staff[];
  isSubmitting: boolean;
  
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  
  onLabelChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onStaffChange: (value: string) => void;
}

export default function AppointmentModal({
  type,
  appointment,
  day,
  month,
  year,
  label,
  email,
  phone,
  time,
  serviceId,
  staffId,
  services,
  staff,
  isSubmitting,
  onClose,
  onSave,
  onDelete,
  onLabelChange,
  onEmailChange,
  onPhoneChange,
  onTimeChange,
  onServiceChange,
  onStaffChange
}: AppointmentModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} placement="center" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div>{type === "edit" ? "Randevu Düzenle" : "Yeni Randevu"}</div>
              <div className="text-sm font-normal text-default-500">
                {day} {MONTHS[month]} {year}
              </div>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Müşteri Adı"
                variant="bordered"
                value={label}
                onValueChange={(val) => onLabelChange(onlyLetters(val))}
                isDisabled={type === "edit"}
                isRequired
                description={type === "edit" ? "Müşteri adı değiştirilemez" : ""}
              />
              {type === "add" && (
                <>
                  <Input
                    label="E-posta"
                    type="email"
                    variant="bordered"
                    value={email}
                    onValueChange={onEmailChange}
                  />
                  <Input
                    label="Telefon"
                    type="tel"
                    variant="bordered"
                    value={phone}
                    onValueChange={(val) => onPhoneChange(onlyDigits(val))}
                  />
                </>
              )}
              
              <Select
                label="Hizmet"
                variant="bordered"
                selectedKeys={new Set([serviceId])}
                onSelectionChange={k => onServiceChange([...k][0] as string)}
                isRequired
              >
                {services.map(s => <SelectItem key={s._id}>{s.name}</SelectItem>)}
              </Select>

              <Select
                label="Personel"
                variant="bordered"
                selectedKeys={new Set([staffId])}
                onSelectionChange={k => onStaffChange([...k][0] as string)}
                isRequired
              >
                {staff.map(s => <SelectItem key={s._id}>{s.name}</SelectItem>)}
              </Select>

              <TimeInput
                label="Saat"
                variant="bordered"
                hourCycle={24}
                granularity="minute"
                value={time ? parseTime(time) : null}
                onChange={(value) => {
                  if (!value) return;
                  onTimeChange(toHHMM(value));
                }}
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              {type === "edit" && onDelete && (
                <Button color="danger" variant="flat" onPress={onDelete} isLoading={isSubmitting}>
                  Sil
                </Button>
              )}
              <Button color="default" variant="flat" onPress={onClose} isDisabled={isSubmitting}>
                İptal
              </Button>
              <Button color="primary" onPress={onSave} isLoading={isSubmitting}>
                Kaydet
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}