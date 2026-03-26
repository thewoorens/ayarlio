"use client";
import { Button } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import { Category } from "../types";

const F = "Arial, sans-serif";

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
      style={{
        fontFamily: F,
        fontWeight: active ? 700 : 500,
        borderColor: active ? (color || "#3b82f6") + "55" : "#e8eaf0",
        background: active ? (color ? color + "20" : "#eff6ff") : "#fff",
        color: active ? color || "#2563eb" : "#6b7280",
        transition: "all 0.18s",
      }}
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
  hoveredCatId: string | null;
  onCatHover: (id: string | null) => void;
  onDeleteCat: (id: string) => void;
  onOpenCatModal: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  catFilter,
  onCatFilterChange,
  cats,
  hoveredCatId,
  onCatHover,
  onDeleteCat,
  onOpenCatModal,
}: FilterBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      {/* Search input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 12,
          background: "#fff",
          border: "1px solid #e8eaf0",
          width: 220,
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Hizmet ara…"
          autoComplete="off"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            fontSize: 13,
            color: "#1f2937",
            fontFamily: F,
            width: "100%",
          }}
        />
      </div>

      {/* Category filters */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FilterBtn
          label="Tümü"
          active={catFilter === "Tümü"}
          onPress={() => onCatFilterChange("Tümü")}
        />
        {cats.map((c) => (
          <div
            key={c._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              position: "relative",
            }}
            onMouseEnter={() => onCatHover(c._id)}
            onMouseLeave={() => onCatHover(null)}
          >
            <FilterBtn
              label={c.name}
              active={catFilter === c.name}
              color={c.color}
              onPress={() => onCatFilterChange(c.name)}
            />
            {hoveredCatId === c._id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCat(c._id);
                }}
                style={{
                  position: "absolute",
                  right: -8,
                  top: -8,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid #fecaca",
                  background: "#fff",
                  color: "#ef4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                aria-label="Kategoriyi sil"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        ))}

        {/* Add category button */}
        <button
          onClick={onOpenCatModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 10,
            border: "1px dashed #d1d5db",
            background: "#fafafa",
            color: "#9ca3af",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: F,
          }}
        >
          <Plus size={12} /> Kategori Ekle
        </button>
      </div>
    </div>
  );
}