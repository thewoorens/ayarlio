"use client";

import { Button, Checkbox, Spinner } from "@heroui/react";
import { Trash2, Plus } from "lucide-react";
import { useServices } from "./hooks/useServices";
import { FilterBar } from "./components/FilterBar";
import { ServiceCard } from "./components/ServiceCard";
import { ServiceModal } from "./modals/ServiceModal";
import { CategoryModal } from "./modals/CategoryModal";
import { DeleteModal } from "./modals/DeleteModal";

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
  const activeCount = services.filter((s) => s.isActive).length;
  return (
    <div>
      <div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Spinner />
            <span className="text-sm">Hizmetler yükleniyor...</span>
          </div>
        )}
      </div>
      {!isLoading && (
        <div className="p-6 space-y-6">
          <div
            className="flex flex-wrap items-start justify-between gap-4 bg-white rounded-xl p-5"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
          >
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Hizmetler</h1>
              <p className="text-sm text-gray-400 mt-1">
                {isLoading
                  ? "Yükleniyor..."
                  : `${services.length} hizmet · ${activeCount} aktif`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {checkedSvc.size > 0 && (
                <Button
                  radius="lg"
                  startContent={<Trash2 size={14} />}
                  color="danger"
                  variant="solid"
                  onPress={() => askDel("svc", [...checkedSvc])}
                >
                  {checkedSvc.size} seçiliyi sil
                </Button>
              )}

              <Button
                radius="lg"
                startContent={<Plus size={14} />}
                color="primary"
                variant="solid"
                onPress={openAdd}
              >
                Hizmet Ekle
              </Button>
            </div>
          </div>

          <div
            className="flex flex-col gap-5 bg-white rounded-xl p-5"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
          >
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              catFilter={catFilter}
              onCatFilterChange={setCatFilter}
              cats={cats}
              onDeleteCat={(id) => askDel("cat", [id])}
              onOpenCatModal={catDisc.onOpen}
            />

            {filtered.length > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <Checkbox
                  isSelected={allSvcChecked}
                  onValueChange={toggleAllSvc}
                  size="sm"
                />
                <span>
                  {checkedSvc.size > 0
                    ? `${checkedSvc.size} hizmet seçili`
                    : "Tüm hizmetleri seç"}
                </span>
              </div>
            )}

            <div className="min-h-50">
              {!isLoading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                  Hizmet bulunamadı
                </div>
              )}

              {!isLoading && filtered.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
              )}
            </div>
          </div>
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
      )}
    </div>
  );
}
