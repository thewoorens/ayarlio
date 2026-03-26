"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  Chip,
  Avatar,
  Tooltip,
} from "@heroui/react";

import { Check, CircleX, Edit2Icon, RefreshCwIcon } from "lucide-react";

type Appointment = {
  id: string;
  name: string;
  service: string;
  time: string;
  staff: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  avatar: string;
  color: string;
};

type Props = {
  today: {
    dateString: string;
    appointments: Appointment[];
  };
};

const columns = [
  { key: "name", label: "Müşteri Adı" },
  { key: "service", label: "Hizmet Türü" },
  { key: "time", label: "Randevu Saati" },
  { key: "staff", label: "Personel Adı" },
  { key: "code", label: "Randevu Kodu" },
  { key: "status", label: "Randevu Durumu" },
  { key: "actions", label: "Aksiyonlar" },
];

const statusConfig = {
  confirmed: { label: "Onaylandı", color: "success" as const },
  pending: { label: "Bekliyor", color: "warning" as const },
  cancelled: { label: "İptal", color: "danger" as const },
  completed: { label: "Tamamlandı", color: "primary" as const },
};

const filterButtons = [
  { key: "all", label: "Tümü" },
  { key: "completed", label: "Tamamlanan" },
  { key: "confirmed", label: "Onaylandı" },
  { key: "pending", label: "Bekliyor" },
  { key: "cancelled", label: "İptal" },
] as const;

export default function AppointmentsTable({ today }: Props) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return today.appointments;

    return today.appointments.filter((a) => a.status === statusFilter);
  }, [statusFilter, today.appointments]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 ">
        <div>
          <h2 className="text-[15px] font-bold text-gray-800">
            Bugünkü Randevular
          </h2>

          <p className="text-[12px] mt-0.5 text-gray-400">
            {today.dateString} · {filteredRows.length} randevu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ButtonGroup size="sm" variant="flat">
            {filterButtons.map((btn) => (
              <Button
                key={btn.key}
                onPress={() => setStatusFilter(btn.key)}
                className={
                  statusFilter === btn.key
                    ? "bg-gray-100 text-gray-800  border-gray-200 border-1 font-semibold"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 border-1"
                }
              >
                {btn.label}
              </Button>
            ))}
          </ButtonGroup>

          <Button
            size="sm"
            onPress={() => router.push("/pano/randevular")}
            className="text-blue-600 border border-blue-200 bg-blue-50 font-semibold hover:bg-blue-100"
          >
            Tümünü Gör
          </Button>
        </div>
      </div>

      <Table
        removeWrapper
        aria-label="Bugünkü randevular"
        classNames={{
          th: "bg-white border-gray-200 text-gray-400 border-b py-3 px-5",
          td: "py-3.5 px-5 text-[13px]",
          tr: "border-b last:border-0 hover:bg-gray-50 transition group",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "end" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={filteredRows} emptyContent="Randevu bulunamadı.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "name" ? (
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={item.avatar}
                        size="sm"
                        style={{
                          background: item.color + "18",
                          color: item.color,
                          border: `1px solid ${item.color}30`,
                          width: 30,
                          height: 30,
                        }}
                      />

                      <span className="font-semibold text-gray-800">
                        {item.name}
                      </span>
                    </div>
                  ) : columnKey === "time" ? (
                    <span className="text-[12px] font-semibold px-2 py-1 rounded-md bg-gray-100">
                      {item.time}
                    </span>
                  ) : columnKey === "staff" ? (
                    <span className="text-gray-400">{item.staff}</span>
                  ) : columnKey === "status" ? (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={statusConfig[item.status].color}
                    >
                      {statusConfig[item.status].label}
                    </Chip>
                  ) : columnKey === "actions" ? (
                    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition">
                      <ButtonGroup>
                        {item.status === "completed" && (
                          <Tooltip content="Tekrardan Oluştur">
                            <Button isIconOnly size="sm" color="warning">
                              <RefreshCwIcon size={18} />
                            </Button>
                          </Tooltip>
                        )}

                        {item.status !== "completed" && (
                          <Tooltip content="Düzenle">
                            <Button isIconOnly size="sm" color="primary">
                              <Edit2Icon size={18} />
                            </Button>
                          </Tooltip>
                        )}

                        {item.status !== "confirmed" &&
                          item.status !== "completed" && (
                            <Tooltip content="Onayla">
                              <Button isIconOnly size="sm" color="success">
                                <Check size={18} color="white" />
                              </Button>
                            </Tooltip>
                          )}

                        {item.status !== "cancelled" &&
                          item.status !== "completed" && (
                            <Tooltip content="İptal Et">
                              <Button isIconOnly size="sm" color="danger">
                                <CircleX size={18} />
                              </Button>
                            </Tooltip>
                          )}
                      </ButtonGroup>
                    </div>
                  ) : (
                    item[columnKey as keyof Appointment]
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
