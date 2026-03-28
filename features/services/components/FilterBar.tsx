"use client";

import { Button, Input } from "@heroui/react";
import { Plus, Trash2, Search } from "lucide-react";
import { Category } from "../types";
import clsx from "clsx";

interface FilterBtnProps {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}

function FilterBtn({ label, active, color, onPress }: FilterBtnProps) {
  return (
    <Button
      size="sm"
      radius="full"
      variant={active ? "flat" : "bordered"}
      onPress={onPress}
      className={clsx(
        "text-xs px-3 h-8 transition-all",
        active
          ? "font-semibold shadow-sm"
          : "font-medium text-gray-500 hover:text-gray-700",
      )}
      style={
        active && color
          ? {
              backgroundColor: color + "20",
              borderColor: color + "55",
              color: color,
            }
          : undefined
      }
    >
      {label}
    </Button>
  );
}

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  catFilter: string;
  onCatFilterChange: (name: string) => void;
  cats: Category[];
  onDeleteCat: (id: string) => void;
  onOpenCatModal: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  catFilter,
  onCatFilterChange,
  cats,
  onDeleteCat,
  onOpenCatModal,
}: FilterBarProps) {
  return (
    <div className="flex gap-5">
      <div className="flex items-center justify-between gap-3">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Hizmet ara..."
          radius="lg"
          startContent={<Search size={14} />}
          className="max-w-xs"
          color="primary"
          variant="bordered"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterBtn
          label="Tümü"
          active={catFilter === "Tümü"}
          onPress={() => onCatFilterChange("Tümü")}
        />

        {cats.map((c) => (
          <div key={c._id} className="relative group flex items-center">
            <FilterBtn
              label={c.name}
              active={catFilter === c.name}
              color={c.color}
              onPress={() => onCatFilterChange(c.name)}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCat(c._id);
              }}
              className={clsx(
                "cursor-pointer absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center",
                "rounded-full border border-red-200 bg-white text-red-500 shadow-sm",
                "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100",
                "transition-all duration-150 hover:bg-red-50",
              )}
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
        <Button
          size="sm"
          color="primary"
          variant="faded"
          radius="lg"
          startContent={<Plus size={14} />}
          onPress={onOpenCatModal}
          className="font-semibold"
        >
          Kategori Ekle
        </Button>
      </div>
    </div>
  );
}
