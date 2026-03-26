"use client";

import { useCustomerStore } from "../store/useCustomerStore";
import { Avatar, Button } from "@heroui/react";
import { DotIcon, MailIcon, Pencil, PhoneIcon, Trash2 } from "lucide-react";
import { ICustomer } from "@/features/customers/types";
import { CustomerCharts } from "@/features/customers/components/CustomerCharts";
import { useCustomerStats } from "@/features/customers/hooks/useCustomerStats";

export function CustomerDetails({ customer, loading, onEdit, onDelete }: { customer: ICustomer | null, loading?: boolean, onEdit?: () => void, onDelete?: () => void }) {
  const { selectedId } = useCustomerStore();
  const { data, isLoading } = useCustomerStats(customer?._id)

  if (!customer) return <p>Bir müşteri seçin</p>;

  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Yok";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const statBoxes = [
    ["Ziyaret", isLoading ? "..." : (data?.visitCount || 0).toString()],
    ["Harcama", isLoading ? "..." : formatMoney(data?.spending || 0)],
    ["Son Ziyaret", isLoading ? "..." : formatDate(data?.lastVisit?.serviceDetails)],
    ["Favori Hizmet", isLoading ? "..." : (data?.favoriteServices?.[0] || "-")]
  ];

  return (
    <div className="flex-1 flex flex-col overflow-auto gap-3 bg-white border border-gray-200 rounded-2xl p-3">
      <div className="p-5 flex items-center gap-4" style={{ borderBottom: "1px solid #f0f2f7" }}>
        <div>
          <Avatar size={"lg"} classNames={{
            base: "bg-linear-to-br from-[#FFB457] to-[#FF705B]"
          }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2"><h2 style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#111827"
          }}>{`${customer?.firstName} ${customer?.lastName}`}</h2><span style={{
            fontSize: 14,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 99,
            color: customer?.isActive ? "black" : "whitesmoke",
            background: customer?.isActive ? "oklch(87.1% 0.15 154.449)" : "oklch(63.7% 0.237 25.331)",
          }}>{customer?.isActive ? "Aktif" : "Pasif"}</span></div>
          <div className={"flex items-center gap-2"}>
            <div className={"flex items-center gap-2"}>
              <MailIcon size={14} style={{ color: "#9ca3af", marginTop: 5 }} />
              <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 2 }}>{customer?.email}</p>
            </div>
            {customer?.phone ? (
              <div className="flex items-center gap-2">
                <DotIcon size={14} style={{ color: "#9ca3af", marginTop: 5 }} />
                <PhoneIcon size={14} style={{ color: "#9ca3af", marginTop: 5 }} />
                <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 2 }}>{customer?.phone}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2">
          <Button startContent={<Pencil size={13} />} variant="flat" onPress={onEdit}>Düzenle</Button>
          <Button color="danger" variant="flat" startContent={<Trash2 size={13} />} onPress={onDelete}>Sil</Button>
        </div>
      </div>
      <div className="grid grid-cols-4 p-4 gap-3 " style={{ borderBottom: "1px solid #f0f2f7" }}>
        {statBoxes.map(([l, v]) => (
          <div key={l} style={{ padding: 10, borderRadius: 10, background: "#fafafa", border: "1px solid #e8eaf0" }}><p
            className={"text-sm text-gray-400 select-none"}>{l}</p><p
              style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{v}</p></div>
        ))}
      </div>
      <div className={"pl-5 gap-3 flex flex-col"}>
        <div><span className={"text-lg font-bold select-none"}>Müşteri İstatistikleri</span></div>
        {!isLoading && data && (
          <CustomerCharts
            visitHistory={data.visitHistory}
            serviceDistribution={data.serviceDistribution}
          />
        )}
      </div>
    </div>
  );
}
