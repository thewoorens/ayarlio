"use client";
import { useMemo, useEffect } from "react";
import { Button } from "@heroui/react";

import { AppointmentTable } from "./components/AppointmentTable";
import { AppointmentDetail } from "./components/AppointmentDetail";
import { AppointmentModal } from "./modals/AppointmentModal";
import { TabValue, TABS, toIsoDateString, toTimeString } from "./types";
import { useAppointmentStore } from "./store/useAppointmentStore";

export default function AppointmentsView() {
  const store = useAppointmentStore();

  useEffect(() => {
    store.loadInitialData();
  }, [store.loadInitialData]);

  const rows = useMemo(
    () =>
      store.appointments.filter((a) => {
        const s = store.search.toLowerCase();
        const cName = `${a.customerId?.name || ""}`.toLowerCase();
        const sName = (a.serviceId?.name || "").toLowerCase();
        if (s && !cName.includes(s) && !sName.includes(s)) return false;
        if (store.tab !== "all" && a.status !== store.tab) return false;
        return true;
      }),
    [store.appointments, store.search, store.tab]
  );

  const sel = store.appointments.find((a) => a._id === store.selId) ?? null;

  const openAdd = () => {
    const today = new Date();
    store.openAddModal({
      customerId: store.customers[0]?._id || "",
      serviceId: store.services[0]?._id || "",
      staffId: store.staffMembers[0]?._id || "",
      dateISO: toIsoDateString(today.toISOString()) || "",
      timeStr: "09:00",
      status: "pending",
    });
  };

  const openEdit = (a: any) => {
    store.openEditModal({
      id: a._id,
      customerId: a.customerId?._id || "",
      serviceId: a.serviceId?._id || "",
      staffId: a.staffId?._id || "",
      dateISO: toIsoDateString(a.startTime) || "",
      timeStr: toTimeString(a.startTime) || "09:00",
      status: a.status,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", background: "#f8f9fc" }}>
      {/* Sticky top area */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#f8f9fc",
          padding: "20px 24px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          borderBottom: "1px solid #e8eaf0",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", margin: 0 }}>
              Randevular
            </h1>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "2px 0 0" }}>
              {store.isLoading ? "Yükleniyor..." : `${store.appointments.length} randevu`}
            </p>
          </div>
          <Button
            onPress={openAdd}
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              boxShadow: "0 2px 12px rgba(59,130,246,0.3)",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            + Yeni Randevu
          </Button>
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #e8eaf0",
              minWidth: 200,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={store.search}
              onChange={(e) => store.setSearch(e.target.value)}
              placeholder="Müşteri veya hizmet ara…"
              style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "#374151", width: "100%" }}
            />
            {store.search && (
              <button
                onClick={() => store.setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16, lineHeight: 1, padding: 0 }}
              >
                ×
              </button>
            )}
          </div>
          {TABS.map((t) => (
            <button
              key={t.v}
              onClick={() => store.setTab(t.v as TabValue)}
              style={{
                padding: "7px 12px",
                borderRadius: 10,
                border: store.tab === t.v ? "1px solid #bfdbfe" : "1px solid #e8eaf0",
                background: store.tab === t.v ? "#eff6ff" : "#fff",
                color: store.tab === t.v ? "#2563eb" : "#9ca3af",
                fontWeight: store.tab === t.v ? 600 : 400,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* Table + Detail */}
      <style>{`.arow:hover .abtn{opacity:1!important}`}</style>
      <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0, padding: "16px 24px 24px" }}>
        <AppointmentTable
          rows={rows}
          isLoading={store.isLoading}
          selId={store.selId}
          onRowClick={(id) => store.setSelId(store.selId === id ? null : id)}
          onEdit={openEdit}
          onPatchStatus={store.patchStatus}
        />

        {sel && (
          <AppointmentDetail
            appointment={sel}
            onClose={() => store.setSelId(null)}
            onEdit={openEdit}
            onPatchStatus={store.patchStatus}
          />
        )}
      </div>

      <AppointmentModal
        isOpen={store.isModalOpen}
        onClose={store.closeModal}
        formConfig={store.formConfig}
        setFormConfig={store.setFormConfig}
        isSaving={store.isSaving}
        customers={store.customers}
        services={store.services}
        staffMembers={store.staffMembers}
        onSave={store.saveAppointment}
        onDelete={store.deleteAppointment}
      />
    </div>
  );
}