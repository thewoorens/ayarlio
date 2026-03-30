"use client";
import { Checkbox } from "@heroui/react";
import { Trash2, Edit2, Clock } from "lucide-react";
import { Service, Category, Staff, UNIT_LABELS } from "../types";

interface ServiceCardProps {
  service: Service;
  cats: Category[];
  staffList: Staff[];
  isChecked: boolean;
  onToggleCheck: (id: string) => void;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceCard({
  service: s,
  staffList,
  isChecked,
  onToggleCheck,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const categoryStr = s.category || "Kategori Yok";

  return (
    <div
      onClick={() => onEdit(s)}
      className={`
        relative overflow-hidden rounded-2xl p-5 bg-white cursor-pointer transition-all duration-200
        ${isChecked ? "border-blue-200 shadow-sm ring-1 ring-blue-50" : "border-gray-200 hover:border-gray-300"}
        ${s.isActive ? "opacity-100" : "opacity-60 grayscale-[0.2]"}
        border
      `}
    >
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full"
      />

      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-start gap-3">
          <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
            <Checkbox
              isSelected={isChecked}
              onValueChange={() => onToggleCheck(s._id)}
              size="sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-xs font-semibold py-0.5 rounded-full"
              >
                {categoryStr}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">
              {s.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(s);
            }}
            className="cursor-pointer p-1.5 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Düzenle"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(s._id);
            }}
            className="cursor-pointer p-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            title="Sil"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed pl-7">
        {s.description || "Açıklama yok"}
      </p>

      <div className="flex items-center justify-between pl-7">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <Clock size={12} className="text-gray-400" />
            <span>
              {s.duration?.value || 0}{" "}
              {s.duration?.unit ? UNIT_LABELS[s.duration.unit] : "dk"}
            </span>
          </div>
        </div>
        <span className="text-sm font-bold text-gray-900">
          ₺{s.price}
        </span>
      </div>

      {s.staffIds && s.staffIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-50 pl-7">
          {s.staffIds.map((stId) => {
            const staffObj = staffList.find((x) => x._id === stId);
            return (
              <span
                key={stId}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100"
              >
                {staffObj ? staffObj.name : stId}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}