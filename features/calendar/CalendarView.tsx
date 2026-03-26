"use client";

import { useCalendarData } from "./hooks/useCalendarData";
import { useCalendarNavigation } from "./hooks/useCalendarNavigation";
import { useCalendarActions } from "./hooks/useCalendarActions";
import { useExternalEvents } from "./hooks/useExternalEvents";
import { useServiceStaffInit } from "./hooks/useServiceStaffInit";
import { generateCalendarCells } from "./utils/calendarUtils";

import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import SelectedDayPanel from "./components/SelectedDayPanel";
import UpcomingPanel from "./components/UpcomingPanel";
import AppointmentModal from "./modals/AppointmentModal";
import AppointmentDetailModal from "./modals/AppointmentDetailModal";

export default function CalendarPage() {
  const { month, year, selectedDay, setSelectedDay, prev, next } =
    useCalendarNavigation();
  const { map, upcoming, dbServices, dbStaff, reloadAppointments } =
    useCalendarData(month, year);

  const {
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
    formState,
    setFormState,
  } = useCalendarActions({
    month,
    year,
    selectedDay,
    dbServices,
    dbStaff,
    reloadAppointments,
  });

  useServiceStaffInit({
    dbServices,
    dbStaff,
    serviceId: formState.serviceId,
    staffId: formState.staffId,
    setServiceId: setFormState.setServiceId,
    setStaffId: setFormState.setStaffId,
  });

  useExternalEvents({ selectedDay, dbServices, dbStaff, openAdd });

  const cells = generateCalendarCells(year, month);

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        gap: 18,
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minWidth: 0,
        }}
      >
        <CalendarHeader
          month={month}
          year={year}
          onPrev={prev}
          onNext={next}
          onAddAppointment={openAdd}
        />
        <CalendarGrid
          cells={cells}
          selectedDay={selectedDay}
          month={month}
          year={year}
          appointmentsMap={map}
          overDay={overDay}
          onDayClick={setSelectedDay}
          onAppointmentClick={openEdit}
          onDragStart={handleDragStart}
          onDragOver={setOverDay}
          onDragLeave={() => setOverDay(null)}
          onDrop={dropAppointment}
        />
      </div>

      <div
        style={{
          width: 225,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        <SelectedDayPanel
          selectedDay={selectedDay}
          month={month}
          appointments={map[selectedDay] || []}
          onAppointmentClick={openEdit}
        />
        <UpcomingPanel upcoming={upcoming} onAppointmentClick={openDetail} />
      </div>

      {modal && (modal.type === "edit" || modal.type === "add") && (
        <AppointmentModal
          type={modal.type}
          appointment={modal.type === "edit" ? modal.appt : undefined}
          day={modal.day}
          month={month}
          year={year}
          label={formState.label}
          email={formState.email}
          phone={formState.phone}
          time={formState.time}
          serviceId={formState.serviceId}
          staffId={formState.staffId}
          services={dbServices}
          staff={dbStaff}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onSave={modal.type === "edit" ? saveEdit : saveAdd}
          onDelete={modal.type === "edit" ? deleteAppointment : undefined}
          onLabelChange={setFormState.setLabel}
          onEmailChange={setFormState.setEmail}
          onPhoneChange={setFormState.setPhone}
          onTimeChange={setFormState.setTime}
          onServiceChange={setFormState.setServiceId}
          onStaffChange={setFormState.setStaffId}
        />
      )}

      {modal && modal.type === "detail" && (
        <AppointmentDetailModal
          appointment={modal.appt}
          day={modal.day}
          month={month}
          year={year}
          onClose={closeModal}
          onEdit={() => openEdit(modal.appt, modal.day)}
        />
      )}
    </div>
  );
}
