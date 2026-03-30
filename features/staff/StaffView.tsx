"use client";
import { useState } from "react";
import { useDisclosure, Button, Checkbox } from "@heroui/react";
import { UserPlus, Trash2, Search, X } from "lucide-react";

import { StaffListItem } from "./components/StaffListItem";
import { StaffDetail } from "./components/StaffDetail";
import { AddStaffModal } from "./modals/AddStaffModal";
import { EditStaffModal } from "./modals/EditStaffModal";
import { DeleteStaffModal } from "./modals/DeleteStaffModal";
import { useStaff } from "./hooks/useStaff";
import { Staff, EditableStaff, EMPTY_STAFF } from "./types";

export default function StaffView() {
  const {
    staffList,
    filteredStaff,
    sel,
    isLoading,
    isSaving,
    search,
    setSearch,
    selected,
    setSelected,
    checked,
    setChecked,
    allChecked,
    toggleOne,
    toggleAll,
    addStaff,
    updateStaff,
    deleteStaff,
  } = useStaff();

  const addD = useDisclosure();
  const [addForm, setAddForm] = useState<EditableStaff>({ ...EMPTY_STAFF });

  const handleAdd = async () => {
    const success = await addStaff(addForm);
    if (success) {
      setAddForm({ ...EMPTY_STAFF });
      addD.onClose();
    }
  };

  const editD = useDisclosure();
  const [editForm, setEditForm] = useState<Staff | null>(null);

  const handleEdit = async () => {
    if (!editForm) return;
    const success = await updateStaff(editForm._id, editForm);
    if (success) editD.onClose();
  };

  const delD = useDisclosure();
  const [delIds, setDelIds] = useState<string[]>([]);

  const askDel = (ids: string[]) => {
    setDelIds(ids);
    delD.onOpen();
  };

  const confirmDel = async () => {
    const success = await deleteStaff(delIds);
    if (success) delD.onClose();
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 md:gap-5">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-xl p-4 md:p-5 shadow-sm">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Personel
          </h1>
          <p className="text-xs text-zinc-400">
            {staffList.length} çalışan ·{" "}
            {staffList.filter((s) => s.status === "active").length} aktif
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {checked.size > 0 && (
            <Button
              size="sm"
              color="danger"
              variant="flat"
              startContent={<Trash2 size={14} />}
              onPress={() => askDel([...checked])}
            >
              {checked.size} Seçiliyi Sil
            </Button>
          )}

          <Button
            size="sm"
            radius="lg"
            color="primary"
            startContent={<UserPlus size={15} />}
            onPress={() => {
              setAddForm({ ...EMPTY_STAFF });
              addD.onOpen();
            }}
          >
            Personel Ekle
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-3 w-full lg:w-80 xl:w-96 bg-white rounded-xl p-4 md:p-5 shadow-sm">
          {/* SEARCH */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <Search size={14} className="text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Personel ara…"
              className="bg-transparent outline-none text-sm w-full"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} className="text-zinc-400" />
              </button>
            )}
          </div>

          {/* CHECK ALL */}
          {filteredStaff.length > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                isSelected={allChecked}
                onValueChange={toggleAll}
                size="sm"
              />
              <span className="text-xs text-zinc-400">
                {checked.size > 0 ? `${checked.size} seçili` : "Tümünü seç"}
              </span>
            </div>
          )}

          {/* LIST */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading && (
              <p className="text-sm text-center text-zinc-400">Yükleniyor...</p>
            )}

            {filteredStaff.map((s) => (
              <StaffListItem
                key={s._id}
                staff={s}
                isSelected={selected === s._id}
                isChecked={checked.has(s._id)}
                onSelect={setSelected}
                onToggleCheck={toggleOne}
                onDelete={(id) => askDel([id])}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 min-h-[300px]">
          {sel ? (
            <StaffDetail
              staff={sel}
              onEdit={(s) => {
                setEditForm({ ...s });
                editD.onOpen();
              }}
              onDelete={(id) => askDel([id])}
            />
          ) : (
            <div className="h-full rounded-xl flex items-center justify-center bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
              <p className="text-zinc-400 text-sm">Bir personel seçin</p>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <AddStaffModal
        isOpen={addD.isOpen}
        onClose={addD.onClose}
        form={addForm}
        setForm={setAddForm}
        isSaving={isSaving}
        onSave={handleAdd}
      />

      <EditStaffModal
        isOpen={editD.isOpen}
        onClose={editD.onClose}
        form={editForm}
        setForm={setEditForm}
        isSaving={isSaving}
        onSave={handleEdit}
        onDelete={(id) => askDel([id])}
      />

      <DeleteStaffModal
        isOpen={delD.isOpen}
        onClose={delD.onClose}
        delIds={delIds}
        staffList={staffList}
        onConfirm={confirmDel}
      />
    </div>
  );
}
