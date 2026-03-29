"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { ICustomer } from "../../types";
import { Edit2, Trash2, Phone, Mail, Calendar, ShoppingBag, ChevronLeft, Star } from "lucide-react";
import { useCustomerStats } from "../../hooks/useCustomerStats";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: ICustomer | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function MobileCustomerDetails({ isOpen, onClose, customer, onEdit, onDelete }: Props) {
  const { data, isLoading } = useCustomerStats(customer?._id);

  if (!customer) return null;

  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Yok";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      classNames={{
        base: "m-0 rounded-none bg-gray-50",
        wrapper: "z-[100] p-0"
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
          },
          exit: {
            y: 50,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" }
          }
        }
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-between bg-white border-b border-gray-100 p-4 shrink-0">
              <Button isIconOnly variant="light" onPress={onClose} className="-ml-2">
                <ChevronLeft size={24} />
              </Button>
              <span className="text-[17px] font-semibold">Müşteri Detayı</span>
              <div className="flex gap-1 -mr-2">
                <Button isIconOnly variant="light" onPress={() => { onClose(); setTimeout(onEdit, 300); }}>
                  <Edit2 size={20} className="text-gray-600" />
                </Button>
                <Button isIconOnly variant="light" onPress={() => { onClose(); setTimeout(onDelete, 300); }}>
                  <Trash2 size={20} className="text-red-500" />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="p-0 overflow-y-auto w-full pb-10">
              {/* Profile Card */}
              <div className="bg-white p-6 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-r from-blue-500 to-indigo-600 opacity-10"></div>
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#FFB457] to-[#FF705B] text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-4 z-10 border-4 border-white">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 z-10">{customer.name}</h2>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-sm text-gray-500 z-10 w-full px-4">
                  {customer.phone && (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      <Phone size={14} className="text-blue-500" />
                      {customer.phone}
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      <Mail size={14} className="text-blue-500" />
                      <span className="truncate max-w-[200px]">{customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="px-4 py-4 grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                    <Calendar size={18} />
                  </div>
                  <p className="text-xs font-medium text-gray-500">Ziyaret</p>
                  <p className="text-[19px] font-bold text-gray-900">
                    {isLoading ? "..." : (data?.visitCount || 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                    <ShoppingBag size={18} />
                  </div>
                  <p className="text-xs font-medium text-gray-500">Harcama</p>
                  <p className="text-[19px] font-bold text-gray-900">
                    {isLoading ? "..." : formatMoney(data?.spending || 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                    <Calendar size={18} />
                  </div>
                  <p className="text-xs font-medium text-gray-500">Son Ziyaret</p>
                  <p className="text-[15px] font-bold text-gray-900 truncate mt-1">
                    {isLoading ? "..." : formatDate(data?.lastVisit?.serviceDetails)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                    <Star size={18} />
                  </div>
                  <p className="text-xs font-medium text-gray-500">Favori Hizmet</p>
                  <p className="text-[15px] font-bold text-gray-900 truncate mt-1">
                    {isLoading ? "..." : (data?.favoriteServices?.[0] || "-")}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="px-4 pb-4">
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Notlar</h3>
                    <p className="text-[15px] text-amber-900 leading-relaxed">{customer.notes}</p>
                  </div>
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
