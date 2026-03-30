"use client";

import { useState, useMemo } from "react";
import { ICustomer } from "../../types";
import { Search, ChevronRight } from "lucide-react";
import { Avatar } from "@heroui/react";

interface Props {
  customers: ICustomer[];
  loading?: boolean;
  onSelect: (id: string) => void;
}

export function MobileCustomerList({ customers, loading, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return customers.filter((c) =>
      `${c.name} ${c.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* SEARCH */}
      <div className="px-4 py-3 bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-600">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Müşterilerde ara..."
            className="flex-1 text-[15px] outline-none bg-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="flex flex-col pb-20">
        {filtered.map((c) => (
          <div
            key={c._id}
            onClick={() => onSelect(c._id)}
            className="flex items-center gap-3 p-4 bg-white active:bg-gray-50 border-b border-gray-50 transition-colors"
          >
            <Avatar
              size="md"
              name={c.name}
              classNames={{
                base: "bg-linear-to-br from-[#FFB457] to-[#FF705B] text-white"
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-semibold text-gray-900 truncate">
                {c.name}
              </p>
              <p className="text-[14px] text-gray-500 truncate">
                {c.email || "E-posta yok"}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-[15px] text-gray-400 text-center">
              Müşteri bulunamadı
            </p>
          </div>
        )}

        {loading && filtered.length === 0 && (
          <div className="py-12 flex justify-center">
            <p className="text-[15px] text-gray-400">Yükleniyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
