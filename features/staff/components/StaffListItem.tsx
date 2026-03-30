"use client";
import { Checkbox } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { Staff, ini } from "../types";

interface StaffListItemProps {
  staff: Staff;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StaffListItem({
  staff,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
  onDelete,
}: StaffListItemProps) {
  const displayAvatar = staff.avatar || ini(staff.name);

  return (
    <div
      onClick={() => onSelect(staff._id)}
      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-colors ${isSelected
        ? "bg-blue-500/10 border border-blue-500/25"
        : "bg-transparent border border-transparent hover:bg-zinc-50"
        }`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          isSelected={isChecked}
          onValueChange={() => onToggleCheck(staff._id)}
          size="sm"
        />
      </div>

      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-zinc-200 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
          {displayAvatar}
        </div>
        {staff.status === "active" && (
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 font-medium mt-0.5 truncate">{staff.role}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-zinc-400 font-medium">
            {staff.appointments || 0} randevu
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            ⭐ {staff.rating || "5.0"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(staff._id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-500 hover:bg-rose-50 rounded-lg outline-none"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}