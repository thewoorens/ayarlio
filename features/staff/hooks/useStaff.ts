import { useMemo, useState } from "react";
import useSWR from "swr";
import { Staff, ApiListResponse, EditableStaff } from "../types";

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  return res.json() as Promise<T>;
};

export function useStaff() {
  const {
    data: response,
    mutate,
    isLoading: isDataLoading,
  } = useSWR<ApiListResponse<Staff>>("/api/tenant/staff", fetcher);

  const staffList = useMemo<Staff[]>(() => response?.data ?? [], [response]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const sel = useMemo(
    () => staffList.find((s) => s._id === selected) ?? null,
    [staffList, selected]
  );

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
    setChecked(
      allChecked ? new Set() : new Set(filteredStaff.map((s) => s._id))
    );

  const [isSaving, setIsSaving] = useState(false);

  const addStaff = async (form: EditableStaff) => {
    if (!form.name.trim()) return false;
    setIsSaving(true);
    try {
      await fetch("/api/tenant/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await mutate();
      return true;
    } catch (err) {
      console.error("Failed to add staff", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateStaff = async (id: string, form: Partial<Staff>) => {
    setIsSaving(true);
    try {
      await fetch(`/api/tenant/staff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await mutate();
      return true;
    } catch (err) {
      console.error("Failed to edit staff", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStaff = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await fetch(`/api/tenant/staff/${id}`, { method: "DELETE" });
      }
      await mutate();
      if (selected && ids.includes(selected)) setSelected(null);
      setChecked(new Set());
      return true;
    } catch (error) {
      console.error("Failed to delete staff", error);
      return false;
    }
  };

  return {
    staffList,
    filteredStaff,
    sel,
    isLoading: isDataLoading,
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
  };
}
