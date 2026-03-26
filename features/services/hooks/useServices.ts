"use client";
import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import useSWR from "swr";
import {
  Service,
  Category,
  Staff,
  ServiceForm,
  CategoryForm,
  DeleteTarget,
  EMPTY_SERVICE_FORM,
  CATEGORY_COLOR,
} from "../types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useServices() {
  // ── Data fetching ──────────────────────────────────────────────
  const {
    data: response,
    mutate: mutateSvc,
    isLoading,
  } = useSWR("/api/tenant/services", fetcher);
  const services: Service[] = response?.data || [];

  const {
    data: catResponse,
    mutate: mutateCat,
    isLoading: isCatLoading,
  } = useSWR("/api/tenant/services/categories", fetcher);
  const cats: Category[] = catResponse?.data || [];

  const { data: staffResponse, isLoading: isStaffLoading } = useSWR(
    "/api/tenant/staff",
    fetcher
  );
  const staffList: Staff[] = staffResponse?.data || [];

  // ── Filters ────────────────────────────────────────────────────
  const [catFilter, setCatFilter] = useState("Tümü");
  const [search, setSearch] = useState("");

  const filtered = services.filter((s) => {
    const mc = catFilter === "Tümü" || s.category === catFilter;
    const ms = (s.name || "").toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  // ── Multi-select ───────────────────────────────────────────────
  const [checkedSvc, setCheckedSvc] = useState<Set<string>>(new Set());

  const allSvcChecked =
    filtered.length > 0 && filtered.every((s) => checkedSvc.has(s._id));

  function toggleSvcCheck(id: string) {
    setCheckedSvc((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function toggleAllSvc() {
    setCheckedSvc(
      allSvcChecked ? new Set() : new Set(filtered.map((s) => s._id))
    );
  }

  // ── Category hover ─────────────────────────────────────────────
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);

  // ── Service modal ──────────────────────────────────────────────
  const svcDisc = useDisclosure();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>({ ...EMPTY_SERVICE_FORM });
  const [isSaving, setIsSaving] = useState(false);

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY_SERVICE_FORM, category: cats[0]?.name ?? "" });
    svcDisc.onOpen();
  }

  function openEdit(s: Service) {
    setEditId(s._id);
    setForm({
      name: s.name,
      category: s.category || "",
      duration: s.duration || { value: 30, unit: "minutes" },
      price: s.price,
      description: s.description || "",
      staffIds: [...(s.staffIds || [])],
      isActive: s.isActive,
      color: s.color || "#3b82f6",
    });
    svcDisc.onOpen();
  }

  async function saveSvc() {
    if (!form.name.trim()) return;
    setIsSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      duration: { value: form.duration.value, unit: "minutes" },
      price: form.price,
      description: form.description,
      isActive: form.isActive,
      staffIds: form.staffIds,
    };

    try {
      if (editId !== null) {
        await fetch(`/api/tenant/services/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/tenant/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      mutateSvc();
      svcDisc.onClose();
    } catch (err) {
      console.error("Failed to save service", err);
    } finally {
      setIsSaving(false);
    }
  }

  function toggleStaff(stId: string) {
    setForm((p) => ({
      ...p,
      staffIds: p.staffIds.includes(stId)
        ? p.staffIds.filter((x) => x !== stId)
        : [...p.staffIds, stId],
    }));
  }

  // ── Category modal ─────────────────────────────────────────────
  const catDisc = useDisclosure();
  const [catForm, setCatForm] = useState<CategoryForm>({ name: "" });

  async function saveCat() {
    if (!catForm.name.trim() || cats.find((c) => c.name === catForm.name))
      return;
    try {
      await fetch("/api/tenant/services/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catForm.name.trim(), color: CATEGORY_COLOR }),
      });
      mutateCat();
    } catch (err) {
      console.error("Failed to add category", err);
    }
    setCatForm({ name: "" });
    catDisc.onClose();
  }

  // ── Delete modal ───────────────────────────────────────────────
  const delDisc = useDisclosure();
  const [delTarget, setDelTarget] = useState<DeleteTarget>({
    type: "svc",
    ids: [],
  });

  function askDel(type: "svc" | "cat", ids: string[]) {
    setDelTarget({ type, ids });
    delDisc.onOpen();
  }

  async function confirmDel() {
    if (delTarget.type === "svc") {
      for (const id of delTarget.ids) {
        await fetch(`/api/tenant/services/${id}`, { method: "DELETE" });
      }
      setCheckedSvc(new Set());
      mutateSvc();
    } else {
      for (const id of delTarget.ids) {
        await fetch(`/api/tenant/services/categories/${id}`, {
          method: "DELETE",
        });
      }
      mutateCat();
      mutateSvc();

      const names = cats
        .filter((c) => delTarget.ids.includes(c._id))
        .map((c) => c.name);
      if (names.includes(catFilter)) setCatFilter("Tümü");
    }
    delDisc.onClose();
  }

  // ── Delete label (used in DeleteModal) ────────────────────────
  const delLabel =
    delTarget.type === "svc"
      ? delTarget.ids.length === 1
        ? `"${services.find((s) => s._id === delTarget.ids[0])?.name}" hizmeti`
        : `${delTarget.ids.length} hizmet`
      : delTarget.ids.length === 1
      ? `"${cats.find((c) => c._id === delTarget.ids[0])?.name}" kategorisi`
      : `${delTarget.ids.length} kategori`;

  return {
    // data
    services,
    cats,
    staffList,
    filtered,
    isLoading,
    isCatLoading,
    isStaffLoading,
    // filters
    catFilter,
    setCatFilter,
    search,
    setSearch,
    // multi-select
    checkedSvc,
    allSvcChecked,
    toggleSvcCheck,
    toggleAllSvc,
    // category hover
    hoveredCatId,
    setHoveredCatId,
    // service modal
    svcDisc,
    editId,
    form,
    setForm,
    isSaving,
    openAdd,
    openEdit,
    saveSvc,
    toggleStaff,
    // category modal
    catDisc,
    catForm,
    setCatForm,
    saveCat,
    // delete modal
    delDisc,
    delTarget,
    delLabel,
    askDel,
    confirmDel,
  };
}