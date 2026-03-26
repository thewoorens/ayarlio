"use client";
import { useMemo, useState } from "react";
import { useDisclosure, Button, Checkbox } from "@heroui/react";
import { UserPlus, Trash2, Search, X } from "lucide-react";
import useSWR from "swr";

import { StaffListItem } from "./components/StaffListItem";
import { StaffDetail } from "./components/StaffDetail";
import { AddStaffModal } from "./modals/AddStaffModal";
import { EditStaffModal } from "./modals/EditStaffModal";
import { DeleteStaffModal } from "./modals/DeleteStaffModal";
import {
  Staff,
  ApiListResponse,
  EditableStaff,
  FONT,
  EMPTY_STAFF,
} from "./types";

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  return res.json() as Promise<T>;
};

export default function StaffView() {
  const { data: response, mutate, isLoading } = useSWR<ApiListResponse<Staff>>(
    "/api/tenant/staff",
    fetcher
  );
  const staffList = useMemo<Staff[]>(() => response?.data ?? [], [response]);

  // ── Filters & selection ────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const sel = staffList.find((s) => s._id === selected) ?? null;

  const filteredStaff = useMemo(() => {
    const q = search.toLowerCase();
    return staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q)
    );
  }, [staffList, search]);

  const allChecked =
    filteredStaff.length > 0 && filteredStaff.every((s) => checked.has(s._id));

  const toggleOne = (id: string) =>
    setChecked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const toggleAll = () =>
    setChecked(allChecked ? new Set() : new Set(filteredStaff.map((s) => s._id)));

  // ── Add modal ──────────────────────────────────────────────────
  const addD = useDisclosure();
  const [addForm, setAddForm] = useState<EditableStaff>({ ...EMPTY_STAFF });
  const [isSaving, setIsSaving] = useState(false);

  async function addStaff() {
    if (!addForm.name.trim()) return;
    setIsSaving(true);
    try {
      await fetch("/api/tenant/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      mutate();
      setAddForm({ ...EMPTY_STAFF });
      addD.onClose();
    } catch (err) {
      console.error("Failed to add staff", err);
    } finally {
      setIsSaving(false);
    }
  }

  // ── Edit modal ─────────────────────────────────────────────────
  const editD = useDisclosure();
  const [editForm, setEditForm] = useState<Staff | null>(null);

  async function saveEdit() {
    if (!editForm) return;
    setIsSaving(true);
    try {
      await fetch(`/api/tenant/staff/${editForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      mutate();
      editD.onClose();
    } catch (err) {
      console.error("Failed to edit staff", err);
    } finally {
      setIsSaving(false);
    }
  }

  // ── Delete modal ───────────────────────────────────────────────
  const delD = useDisclosure();
  const [delIds, setDelIds] = useState<string[]>([]);

  const askDel = (ids: string[]) => {
    setDelIds(ids);
    delD.onOpen();
  };

  const confirmDel = async () => {
    for (const id of delIds) {
      await fetch(`/api/tenant/staff/${id}`, { method: "DELETE" });
    }
    mutate();
    if (selected && delIds.includes(selected)) setSelected(null);
    setChecked(new Set());
    delD.onClose();
  };

  return (
    <div
      className="p-6 h-[calc(100vh-64px)] flex flex-col gap-5"
      style={{ fontFamily: FONT }}
    >
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Personel
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "2px 0 0" }}>
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
            startContent={<UserPlus size={15} />}
            onPress={() => {
              setAddForm({ ...EMPTY_STAFF });
              addD.onOpen();
            }}
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Personel Ekle
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Sol liste */}
        <div className="flex flex-col gap-3" style={{ width: 280, flexShrink: 0 }}>
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "#fff", border: "1px solid #e8eaf0" }}
          >
            <Search size={14} color="#d1d5db" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Personel ara…"
              autoComplete="off"
              style={{
                background: "transparent",
                outline: "none",
                fontSize: 13,
                width: "100%",
                color: "#1f2937",
                border: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={13} color="#9ca3af" />
              </button>
            )}
          </div>

          {/* Select all */}
          {filteredStaff.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                isSelected={allChecked}
                onValueChange={toggleAll}
                size="sm"
              />
              <span style={{ fontSize: 11, color: "#9ca3af" }}>
                {checked.size > 0 ? `${checked.size} seçili` : "Tümünü seç"}
              </span>
            </div>
          )}

          {/* Staff list */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {isLoading && (
              <p
                style={{
                  fontSize: 13,
                  textAlign: "center",
                  color: "#9ca3af",
                  padding: "12px 0",
                }}
              >
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

        {/* Sağ detay */}
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
          <div
            className="flex-1 rounded-2xl flex items-center justify-center"
            style={{ background: "#fff", border: "1px solid #e8eaf0" }}
          >
            <p style={{ color: "#d1d5db", fontSize: 13 }}>Bir personel seçin</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={addD.isOpen}
        onClose={addD.onClose}
        form={addForm}
        setForm={setAddForm}
        isSaving={isSaving}
        onSave={addStaff}
      />
      <EditStaffModal
        isOpen={editD.isOpen}
        onClose={editD.onClose}
        form={editForm}
        setForm={setEditForm}
        isSaving={isSaving}
        onSave={saveEdit}
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