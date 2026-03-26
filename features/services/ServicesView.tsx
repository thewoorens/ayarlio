"use client";
import { Button } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useServices } from "./hooks/useServices";
import { FilterBar } from "./components/FilterBar";
import { ServiceCard } from "./components/ServiceCard";
import { ServiceModal } from "./modals/ServiceModal";
import { CategoryModal } from "./modals/CategoryModal";
import { DeleteModal } from "./modals/DeleteModal";

const F = "Arial, sans-serif";

export default function ServicesView() {
  const {
    services,
    cats,
    staffList,
    filtered,
    isLoading,
    catFilter,
    setCatFilter,
    search,
    setSearch,
    checkedSvc,
    allSvcChecked,
    toggleSvcCheck,
    toggleAllSvc,
    hoveredCatId,
    setHoveredCatId,
    svcDisc,
    editId,
    form,
    setForm,
    isSaving,
    openAdd,
    openEdit,
    saveSvc,
    toggleStaff,
    catDisc,
    catForm,
    setCatForm,
    saveCat,
    delDisc,
    delLabel,
    askDel,
    confirmDel,
  } = useServices();

  return (
    <div style={{ padding: 24, fontFamily: F }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Hizmetler
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "2px 0 0" }}>
            {isLoading
              ? "Yükleniyor..."
              : `${services.length} hizmet · ${services.filter((s) => s.isActive).length} aktif`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {checkedSvc.size > 0 && (
            <Button
              color="danger"
              variant="flat"
              startContent={<Trash2 size={14} />}
              onPress={() => askDel("svc", [...checkedSvc])}
            >
              {checkedSvc.size} Hizmeti Sil
            </Button>
          )}
          <Button
            onPress={openAdd}
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              boxShadow: "0 2px 12px rgba(59,130,246,0.3)",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Hizmet Ekle
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        catFilter={catFilter}
        onCatFilterChange={setCatFilter}
        cats={cats}
        hoveredCatId={hoveredCatId}
        onCatHover={setHoveredCatId}
        onDeleteCat={(id) => askDel("cat", [id])}
        onOpenCatModal={catDisc.onOpen}
      />

      {/* Select all */}
      {filtered.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Checkbox
            isSelected={allSvcChecked}
            onValueChange={toggleAllSvc}
            size="sm"
          />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            {checkedSvc.size > 0
              ? `${checkedSvc.size} hizmet seçili`
              : "Tüm hizmetleri seç"}
          </span>
        </div>
      )}

      {/* Services Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 14,
        }}
      >
        {isLoading && (
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Hizmetler yükleniyor...
          </p>
        )}
        {!isLoading && filtered.length === 0 && (
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Henüz hizmet bulunamadı.
          </p>
        )}
        {filtered.map((s) => (
          <ServiceCard
            key={s._id}
            service={s}
            cats={cats}
            staffList={staffList}
            isChecked={checkedSvc.has(s._id)}
            onToggleCheck={toggleSvcCheck}
            onEdit={openEdit}
            onDelete={(id) => askDel("svc", [id])}
          />
        ))}
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={svcDisc.isOpen}
        onClose={svcDisc.onClose}
        editId={editId}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        cats={cats}
        staffList={staffList}
        onSave={saveSvc}
        onDelete={(id) => askDel("svc", [id])}
        toggleStaff={toggleStaff}
      />
      <CategoryModal
        isOpen={catDisc.isOpen}
        onClose={catDisc.onClose}
        catForm={catForm}
        setCatForm={setCatForm}
        onSave={saveCat}
      />
      <DeleteModal
        isOpen={delDisc.isOpen}
        onClose={delDisc.onClose}
        delLabel={delLabel}
        onConfirm={confirmDel}
      />
    </div>
  );
}