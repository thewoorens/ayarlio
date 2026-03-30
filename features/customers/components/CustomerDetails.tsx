"use client";

import { Avatar, Button, Spinner } from "@heroui/react";
import { MailIcon, Pencil, PhoneIcon, Trash2, Calendar, ShoppingBag, Star } from "lucide-react";
import { ICustomer } from "@/features/customers/types";
import { CustomerCharts } from "@/features/customers/components/CustomerCharts";
import { useCustomerStats } from "@/features/customers/hooks/useCustomerStats";

interface Props {
  customer: ICustomer | null;
  loading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CustomerDetails({ customer, loading, onEdit, onDelete }: Props) {
  const { data, isLoading: statsLoading } = useCustomerStats(customer?._id)

  if (loading && !customer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-2xl p-6">
        <Spinner label="Yükleniyor..." color="primary" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl p-6 text-gray-400">
        <Avatar size="lg" className="mb-4 bg-gray-100 text-gray-300" />
        <p className="text-lg font-medium">Bir müşteri seçin</p>
        <p className="text-sm">Müşteri detaylarını görüntülemek için listeden bir seçim yapın.</p>
      </div>
    );
  }

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
    { label: "Ziyaret", value: statsLoading ? "..." : (data?.visitCount || 0).toString(), icon: <Calendar size={16} /> },
    { label: "Harcama", value: statsLoading ? "..." : formatMoney(data?.spending || 0), icon: <ShoppingBag size={16} /> },
    { label: "Son Ziyaret", value: statsLoading ? "..." : formatDate(data?.lastVisit?.serviceDetails), icon: <Calendar size={16} /> },
    { label: "Favori Hizmet", value: statsLoading ? "..." : (data?.favoriteServices?.[0] || "-"), icon: <Star size={16} /> }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-6">
        <div className="relative">
          <Avatar 
            size={"lg"} 
            name={customer.name}
            classNames={{
              base: "bg-linear-to-br from-[#FFB457] to-[#FF705B] text-white w-20 h-20 text-2xl"
            }} 
          />
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${customer.isActive ? "bg-green-500" : "bg-gray-400"}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
             <span className={`text-xs px-2 py-1 rounded-full font-medium ${customer.isActive ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>
               {customer.isActive ? "Aktif" : "Pasif"}
             </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-2 text-gray-500">
              <MailIcon size={14} />
              <p className="text-sm">{customer.email}</p>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 text-gray-500 border-l border-gray-200 pl-4">
                <PhoneIcon size={14} />
                <p className="text-sm">{customer.phone}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            startContent={<Pencil size={14} />} 
            variant="flat" 
            size="sm"
            onPress={onEdit}
            className="font-medium"
          >
            Düzenle
          </Button>
          <Button 
            color="danger" 
            variant="flat" 
            size="sm"
            startContent={<Trash2 size={14} />} 
            onPress={onDelete}
            className="font-medium"
          >
            Sil
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statBoxes.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition group">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                 <span className="text-primary opacity-20 group-hover:opacity-100 transition">{stat.icon}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 truncate">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Notes Section if exists */}
        {customer.notes && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-100">
             <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Notlar</h3>
             <p className="text-sm text-amber-900 leading-relaxed">{customer.notes}</p>
          </div>
        )}

        {/* Charts Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">Müşteri Analitiği</h3>
            <div className="h-px flex-1 bg-gray-100 ml-2" />
          </div>
          
          {statsLoading ? (
            <div className="flex justify-center py-12">
               <Spinner size="sm" />
            </div>
          ) : data ? (
            <div className="bg-white rounded-xl p-2">
              <CustomerCharts
                visitHistory={data.visitHistory}
                serviceDistribution={data.serviceDistribution}
              />
            </div>
          ) : (
             <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm">Bu müşteri için henüz istatistik verisi bulunmuyor.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
