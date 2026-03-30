"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { ICustomer } from "../../types";
import {
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  ChevronLeft,
  Star,
} from "lucide-react";
import { useCustomerStats } from "../../hooks/useCustomerStats";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: ICustomer | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function MobileCustomerDetails({
  isOpen,
  onClose,
  customer,
  onEdit,
  onDelete,
}: Props) {
  const { data, isLoading } = useCustomerStats(customer?._id);

  if (!customer) return null;

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Yok";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      classNames={{
        base: "m-0 rounded-none bg-gray-50",
        wrapper: "z-[100] p-0",
      }}
    >
      <ModalContent>
        {() => (
          <>
            {/* HEADER */}
            <ModalHeader className="flex items-center justify-between bg-white border-b border-gray-100 px-3 py-3 sm:px-4 sm:py-4">
              <Button
                isIconOnly
                variant="light"
                onPress={onClose}
                className="-ml-2"
              >
                <ChevronLeft size={22} />
              </Button>

              <span className="text-base sm:text-lg font-semibold">
                Müşteri Detayı
              </span>

              <div className="flex gap-1 -mr-2">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => {
                    onClose();
                    setTimeout(onEdit, 250);
                  }}
                >
                  <Edit2 size={18} className="text-gray-600" />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => {
                    onClose();
                    setTimeout(onDelete, 250);
                  }}
                >
                  <Trash2 size={18} className="text-red-500" />
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className="p-0 overflow-y-auto pb-8">
              {/* PROFILE */}
              <div className="bg-white px-4 py-6 sm:p-6 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10" />

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFB457] to-[#FF705B] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg mb-3 sm:mb-4 z-10 border-4 border-white">
                  {customer.name.charAt(0).toUpperCase()}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 z-10 text-center">
                  {customer.name}
                </h2>

                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 mt-3 text-xs sm:text-sm text-gray-500 w-full px-2 sm:px-4">
                  {customer.phone && (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border">
                      <Phone size={14} className="text-blue-500" />
                      {customer.phone}
                    </div>
                  )}

                  {customer.email && (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border max-w-full">
                      <Mail size={14} className="text-blue-500" />
                      <span className="truncate max-w-[180px] sm:max-w-xs">
                        {customer.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* STATS */}
              <div className="px-3 sm:px-4 py-4 grid grid-cols-2 gap-3">
                <StatCard
                  icon={<Calendar size={18} />}
                  label="Ziyaret"
                  value={isLoading ? "..." : data?.visitCount || 0}
                />

                <StatCard
                  icon={<ShoppingBag size={18} />}
                  label="Harcama"
                  value={isLoading ? "..." : formatMoney(data?.spending || 0)}
                />

                <StatCard
                  icon={<Calendar size={18} />}
                  label="Son Ziyaret"
                  value={
                    isLoading
                      ? "..."
                      : formatDate(data?.lastVisit?.serviceDetails)
                  }
                />

                <StatCard
                  icon={<Star size={18} />}
                  label="Favori Hizmet"
                  value={isLoading ? "..." : data?.favoriteServices?.[0] || "-"}
                />
              </div>

              {/* NOTES */}
              {customer.notes && (
                <div className="px-3 sm:px-4 pb-4">
                  <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-100">
                    <h3 className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                      Notlar
                    </h3>
                    <p className="text-sm sm:text-[15px] text-amber-900 leading-relaxed">
                      {customer.notes}
                    </p>
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

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border flex flex-col gap-1.5">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-[11px] sm:text-xs text-gray-500">{label}</p>
      <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
        {value}
      </p>
    </div>
  );
}
