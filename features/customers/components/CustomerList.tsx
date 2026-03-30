"use client";

import { useState, useMemo } from "react";
import { ICustomer } from "../types";

import { Search, Trash2, X } from "lucide-react";
import { Checkbox, Button, Avatar } from "@heroui/react";

interface Props {
  customers: ICustomer[];
  loading?: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete?: (ids: string[]) => void;
}

export function CustomerList({ customers, loading, selectedId, onSelect, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return customers.filter((c) =>
      `${c.name} ${c.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  const allChecked =
    filtered.length > 0 &&
    filtered.every((c) => checked.has(c._id));

  function toggleOne(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    if (allChecked) {
      setChecked(new Set());
    } else {
      setChecked(new Set(filtered.map((c) => c._id)));
    }
  }

  function askDelete(ids: string[]) {
    if (onDelete) {
      onDelete(ids);
    }
  }

  return (
    <div className="w-[320px] flex flex-col gap-3 bg-white border border-gray-200 rounded-2xl p-3">

      {/* SEARCH */}

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200">
        <Search size={14} className="text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Müşteri ara..."
          className="flex-1 text-sm outline-none bg-transparent"
        />

        {search && (
          <button onClick={() => setSearch("")}>
            <X size={14} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* SELECT ALL */}

      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Checkbox
              size="sm"
              isSelected={allChecked}
              onValueChange={toggleAll}
            >

              <span className="text-xs text-gray-400">
                {checked.size > 0
                  ? `${checked.size} seçili`
                  : "Tümünü seç"}
              </span>
            </Checkbox>
          </div>

          {checked.size > 0 && (
            <Button
              size="sm"
              color="danger"
              variant="flat"
              startContent={<Trash2 size={13} />}
              onPress={() => askDelete([...checked])}
            >
              Sil
            </Button>
          )}
        </div>
      )}

      {/* LIST */}

      <div className="flex flex-col gap-1 overflow-y-auto max-h-125 select-none">

        {filtered.map((c) => {
          const isSelected = selectedId === c._id;

          return (
            <div
              key={c._id}
              onClick={() => onSelect(c._id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition group
              ${isSelected
                  ? "bg-gray-100 shadow-sm"
                  : "hover:bg-gray-50 shadow-none border border-transparent"
                }`}
            >

              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  size="md"
                  isSelected={checked.has(c._id)}
                  onValueChange={() => toggleOne(c._id)}
                />
              </div>

              {/* AVATAR */}

              <div>
                <Avatar
                  size={"sm"}
                  name={c.name}
                  classNames={{
                    base: "bg-linear-to-br from-[#FFB457] to-[#FF705B] text-white"
                  }}
                />
              </div>

              {/* INFO */}

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : "text-gray-900"}`}>
                  {c.name}
                </p>

                <p className="text-xs text-gray-400 truncate">
                  {c.email}
                </p>
              </div>

              {/* DELETE ICON (Desktop only) */}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  askDelete([c._id]);
                }}
                className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 rounded-md text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}

        {filtered.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-sm text-gray-400 text-center">
              Sonuç bulunamadı
            </p>
          </div>
        )}

        {loading && filtered.length === 0 && (
          <div className="py-6 flex justify-center">
            <p className="text-sm text-gray-400">Yükleniyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
