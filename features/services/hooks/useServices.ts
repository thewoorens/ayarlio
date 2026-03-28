"use client";

import { useState, useMemo } from "react";
import { useDisclosure, addToast } from "@heroui/react";
import useSWR from "swr";
import {
  Service,
  Category,
  Staff,
  ServiceForm,
  CategoryForm,
  DeleteTarget,
  EMPTY_SERVICE_FORM,
} from "../types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

async function apiRequest(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "API error");
  }

  return res.json();
}

export function useServices() {
  const {
    data: svcRes,
    mutate: mutateSvc,
    isLoading,
  } = useSWR("/api/tenant/services", fetcher);

  const { data: catRes, mutate: mutateCat } = useSWR(
    "/api/tenant/services/categories",
    fetcher,
  );

  const { data: staffRes } = useSWR("/api/tenant/staff", fetcher);

  const services: Service[] = svcRes?.data || [];
  const cats: Category[] = catRes?.data || [];
  const staffList: Staff[] = staffRes?.data || [];

  const [catFilter, setCatFilter] = useState("Tümü");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat = catFilter === "Tümü" || s.category === catFilter;
      const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, catFilter, search]);

  const [checkedSvc, setCheckedSvc] = useState<Set<string>>(new Set());

  const allSvcChecked =
    filtered.length > 0 && filtered.every((s) => checkedSvc.has(s._id));

  function toggleSvcCheck(id: string) {
    setCheckedSvc((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAllSvc() {
    setCheckedSvc(
      allSvcChecked ? new Set() : new Set(filtered.map((s) => s._id)),
    );
  }

  const svcDisc = useDisclosure();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_SERVICE_FORM);
  const [isSaving, setIsSaving] = useState(false);

  function openAdd() {
    setEditId(null);
    setForm({
      ...EMPTY_SERVICE_FORM,
      category: cats[0]?.name ?? "",
    });
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
    });
    svcDisc.onOpen();
  }

  async function saveSvc() {
    if (!form.name.trim()) return;

    setIsSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      duration: { value: form.duration.value, unit: form.duration.unit },
      price: form.price,
      description: form.description,
      isActive: form.isActive,
      staffIds: form.staffIds,
    };

    try {
      if (editId) {
        await apiRequest(`/api/tenant/services/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        addToast({
          title: "Başarılı",
          description: "Hizmet başarıyla güncellendi.",
          color: "success",
        });
      } else {
        await apiRequest("/api/tenant/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        addToast({
          title: "Başarılı",
          description: "Yeni hizmet başarıyla eklendi.",
          color: "success",
        });
      }

      await mutateSvc();
      svcDisc.onClose();
    } catch (err: any) {
      addToast({
        title: "Hata",
        description: err.message || "Bir hata oluştu",
        color: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function toggleStaff(id: string) {
    setForm((p) => ({
      ...p,
      staffIds: p.staffIds.includes(id)
        ? p.staffIds.filter((x) => x !== id)
        : [...p.staffIds, id],
    }));
  }

  const catDisc = useDisclosure();
  const [catForm, setCatForm] = useState<CategoryForm>({ name: "" });
  const [isCatSaving, setIsCatSaving] = useState(false);

  async function saveCat() {
    const name = catForm.name.trim();

    if (!name) {
      addToast({
        title: "Hata",
        description: "Kategori adı boş olamaz",
        color: "danger",
      });
      return;
    }

    const exists = cats.some(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      addToast({
        title: "Hata",
        description: "Bu kategori zaten mevcut",
        color: "danger",
      });
      return;
    }

    setIsCatSaving(true);

    try {
      await apiRequest("/api/tenant/services/categories", {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
      });

      await mutateCat();
      catDisc.onClose();
      setCatForm({ name: "" });
      addToast({
        title: "Başarılı",
        description: "Kategori başarıyla eklendi.",
        color: "success",
      });
    } catch (err: any) {
      addToast({
        title: "Hata",
        description: err.message || "Kategori eklenirken hata oluştu",
        color: "danger",
      });
    } finally {
      setIsCatSaving(false);
    }
  }

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
    try {
      if (delTarget.type === "svc") {
        await Promise.all(
          delTarget.ids.map((id) =>
            apiRequest(`/api/tenant/services/${id}`, {
              method: "DELETE",
            }),
          ),
        );

        setCheckedSvc(new Set());
        await mutateSvc();
        addToast({
          title: "Başarılı",
          description: "Hizmet başarıyla silindi.",
          color: "success",
        });
      } else {
        await Promise.all(
          delTarget.ids.map((id) =>
            apiRequest(`/api/tenant/services/categories/${id}`, {
              method: "DELETE",
            }),
          ),
        );

        await mutateCat();
        await mutateSvc();

        const deletedCats = cats
          .filter((c) => delTarget.ids.includes(c._id))
          .map((c) => c.name);

        if (deletedCats.includes(catFilter)) setCatFilter("Tümü");
        
        addToast({
          title: "Başarılı",
          description: "Kategori başarıyla silindi.",
          color: "success",
        });
      }
    } catch (err: any) {
      addToast({
        title: "Hata",
        description: err.message || "Silme işlemi sırasında hata oluştu",
        color: "danger",
      });
    } finally {
      delDisc.onClose();
    }
  }

  const delLabel = useMemo(() => {
    if (delTarget.type === "svc") {
      if (delTarget.ids.length === 1) {
        const s = services.find((x) => x._id === delTarget.ids[0]);
        return `"${s?.name}" hizmeti`;
      }
      return `${delTarget.ids.length} hizmet`;
    } else {
      if (delTarget.ids.length === 1) {
        const c = cats.find((x) => x._id === delTarget.ids[0]);
        return `"${c?.name}" kategorisi`;
      }
      return `${delTarget.ids.length} kategori`;
    }
  }, [delTarget, services, cats]);

  return {
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
    isCatSaving,
    delDisc,
    delLabel,
    askDel,
    confirmDel,
  };
}
