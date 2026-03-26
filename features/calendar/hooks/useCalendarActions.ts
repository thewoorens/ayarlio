import { useState, useRef } from "react";
import { Appointment, DragState, ModalState, Service, Staff } from "../types";
import { COLORS } from "../constants";

interface UseCalendarActionsProps {
  month: number;
  year: number;
  selectedDay: number;
  dbServices: Service[];
  dbStaff: Staff[];
  reloadAppointments: () => Promise<void>;
}

export function useCalendarActions({
  month,
  year,
  selectedDay,
  dbServices,
  dbStaff,
  reloadAppointments
}: UseCalendarActionsProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overDay, setOverDay] = useState<number | null>(null);
  const drag = useRef<DragState | null>(null);

  // Form states
  const [label, setLabel] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("10:00");
  const [serviceId, setServiceId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");

  const resetForm = () => {
    setLabel("");
    setEmail("");
    setPhone("");
    setTime("10:00");
    if (dbServices.length > 0) setServiceId(dbServices[0]._id);
    if (dbStaff.length > 0) setStaffId(dbStaff[0]._id);
  };

  const openEdit = (appt: Appointment, day: number) => {
    setModal({ type: "edit", appt, day });
    setLabel(appt.label);
    setEmail(appt.email || "");
    setPhone(appt.phone || "");
    setTime(appt.time);
    setServiceId(appt.service?._id);
    setStaffId(appt.staff?._id);
  };

  const openAdd = () => {
    setModal({ type: "add", day: selectedDay });
    resetForm();
  };

  const openDetail = (appt: Appointment, day: number) => {
    setModal({ type: "detail", appt, day });
  };

  const closeModal = () => {
    setModal(null);
  };

  const saveEdit = async () => {
    if (!modal || modal.type !== "edit") return;
    setIsSubmitting(true);

    const [hours, minutes] = time.split(':').map(Number);
    const startDateTime = new Date(year, month, modal.day, hours, minutes);

    try {
      await fetch(`/api/tenant/appointments/${modal.appt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, staffId, startTime: startDateTime.toISOString() })
      });
      await reloadAppointments();
      setModal(null);
    } catch (e) {
      console.error("Failed to update appt", e);
    }
    setIsSubmitting(false);
  };

  const saveAdd = async () => {
    if (!modal || modal.type !== "add") return;
    setIsSubmitting(true);

    const [hours, minutes] = time.split(':').map(Number);
    const startDateTime = new Date(year, month, modal.day, hours, minutes);

    const svcObj = dbServices.find(s => s._id === serviceId);
    const durOpt = svcObj?.duration || { value: 60, unit: 'minutes' as const };
    const durMs = durOpt.unit === 'hours' ? durOpt.value * 60 * 60 * 1000 : durOpt.value * 60 * 1000;
    const endDateTime = new Date(startDateTime.getTime() + durMs);

    try {
      const tenantId = dbServices[0]?.tenantId || dbStaff[0]?.tenantId;
      await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId, serviceId, staffId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          customerName: label,
          customerPhone: phone,
          customerEmail: email,
          customerNote: "Takvim üzerinden eklendi"
        })
      });
      await reloadAppointments();
      setModal(null);
    } catch (e) {
      console.error("Failed to add appt", e);
    }
    setIsSubmitting(false);
  };

  const deleteAppointment = async () => {
    if (!modal || modal.type !== "edit") return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/tenant/appointments/${modal.appt.id}`, { method: 'DELETE' });
      await reloadAppointments();
      setModal(null);
    } catch (e) {
      console.error("Failed to delete appt", e);
    }
    setIsSubmitting(false);
  };

  const dropAppointment = async (to: number) => {
    if (!drag.current || drag.current.from === to) {
      drag.current = null;
      setOverDay(null);
      return;
    }

    const { appt } = drag.current;
    const [hours, minutes] = appt.time.split(':').map(Number);
    const startDateTime = new Date(year, month, to, hours, minutes);

    try {
      await fetch(`/api/tenant/appointments/${appt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime: startDateTime.toISOString() })
      });
      await reloadAppointments();
    } catch (e) {
      console.error("Failed to drop appt", e);
    }

    drag.current = null;
    setOverDay(null);
  };

  const handleDragStart = (appt: Appointment, day: number) => {
    drag.current = { appt, from: day };
  };

  return {
    modal,
    isSubmitting,
    overDay,
    setOverDay,
    openEdit,
    openAdd,
    openDetail,
    closeModal,
    saveEdit,
    saveAdd,
    deleteAppointment,
    dropAppointment,
    handleDragStart,
    formState: { label, email, phone, time, serviceId, staffId },
    setFormState: { setLabel, setEmail, setPhone, setTime, setServiceId, setStaffId }
  };
}