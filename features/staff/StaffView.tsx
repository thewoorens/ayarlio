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
    if (success) {
      editD.onClose();
    }
  };

  const delD = useDisclosure();
  const [delIds, setDelIds] = useState<string[]>([]);

  const askDel = (ids: string[]) => {
    setDelIds(ids);
    delD.onOpen();
  };

  const confirmDel = async () => {
    const success = await deleteStaff(delIds);
    if (success) {
      delD.onClose();
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col gap-5">
      <div className="flex items-center justify-between shrink-0 bg-white rounded-xl p-5"
        style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight m-0 text-zinc-900 dark:text-zinc-100">
            Personel
          </h1>
          <p className="text-[13px] text-zinc-400 mt-0.5">
            {staffList.length} çalışan ·{" "}
            {staffList.filter((s) => s.status === "active").length} aktif
          </p>
        </div>
        <div className="flex gap-2">
          {checked.size > 0 && (
            <Button
              color="danger"
              variant="flat"
              startContent={<Trash2 size={14} />}
              onPress={() => askDel([...checked])}
            >
              {checked.size} Seçiliyi Sil
            </Button>
          )}
          <Button
            radius="lg"
            color="primary"
            variant="solid"
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

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-3 w-md shrink-0 bg-white rounded-xl p-5"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <Search size={14} className="text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Personel ara…"
              autoComplete="off"
              className="bg-transparent outline-none text-[13px] w-full text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 border-none p-0"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="bg-transparent border-none cursor-pointer outline-none hover:opacity-80 transition-opacity flex items-center justify-center p-0.5"
              >
                <X size={13} className="text-zinc-400" />
              </button>
            )}
          </div>

          {filteredStaff.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                isSelected={allChecked}
                onValueChange={toggleAll}
                size="sm"
              />
              <span className="text-[11px] text-zinc-400">
                {checked.size > 0 ? `${checked.size} seçili` : "Tümünü seç"}
              </span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {isLoading && (
              <p className="text-[13px] text-center text-zinc-400 py-3">
                Personel yükleniyor...
              </p>
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
          <div className="flex-1 rounded-2xl flex items-center justify-center bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <p className="text-zinc-400 text-[13px] font-medium">Bir personel seçin</p>
          </div>
        )}
      </div>

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
