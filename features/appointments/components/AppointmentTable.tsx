"use client";
import {
  Chip,
  Spinner,
  ButtonGroup,
  Button,
  Tooltip as HerouiTooltip,
} from "@heroui/react";
import { Check, CircleX, CreditCardIcon, Edit2Icon } from "lucide-react";
import {
  Appointment,
  Status,
  SC,
  formatDateTR,
  formatTimeTR,
  getAvatarConfig,
} from "../types";
import Link from "next/link";

interface AppointmentTableProps {
  rows: Appointment[];
  isLoading: boolean;
  selId: string | null;
  onRowClick: (id: string) => void;
  onEdit: (a: Appointment) => void;
  onPatchStatus: (id: string, status: Status) => void;
}

export function AppointmentTable({
  rows,
  isLoading,
  selId,
  onRowClick,
  onEdit,
  onPatchStatus,
}: AppointmentTableProps) {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 16,
        border: "1px solid #e8eaf0",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ overflow: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              background: "#fff",
              borderBottom: "1px solid #f0f2f7",
              zIndex: 1,
            }}
          >
            <tr>
              {[
                "MÜŞTERİ",
                "HİZMET",
                "PERSONEL",
                "TARİH & SAAT",
                "RANDEVU KODU",
                "ÜCRET",
                "DURUM",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 16px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: 48,
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  <Spinner />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: 48,
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  Eşleşen randevu bulunamadı
                </td>
              </tr>
            ) : (
              rows.map((a) => {
                const isSel = selId === a._id;
                const cFirst = a.customerId?.name || "";
                const cName = `${cFirst}`;
                const avatar = getAvatarConfig(cFirst);
                const stName = a.staffId?.name || "Bilinmeyen";
                const svcName = a.serviceId?.name || "";
                const price = a.serviceId?.price
                  ? `₺${a.serviceId.price}`
                  : "-";
                const code = a.code || "-";
                const statusConfig = SC[a.status] || SC.pending;

                return (
                  <tr
                    key={a._id}
                    className="arow"
                    onClick={() => onRowClick(a._id)}
                    style={{
                      borderBottom: "1px solid #f4f6fb",
                      cursor: "pointer",
                      background: isSel ? "#f0f7ff" : "transparent",
                      transition: "background 0.12s",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: avatar.color + "22",
                            color: avatar.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            border: `1px solid ${avatar.color}44`,
                            flexShrink: 0,
                          }}
                        >
                          {avatar.initials}
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111827",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cName}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {svcName}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {stName}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#374151",
                        }}
                      >
                        {formatDateTR(a.startTime)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                          fontFamily: "monospace",
                        }}
                      >
                        {formatTimeTR(a.startTime)}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 14,
                        color: "#0d6efd",
                        fontStyle: "bold",
                      }}
                    >
                      {code}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#374151",
                      }}
                    >
                      {price}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={statusConfig.color}
                        style={{ fontSize: 11, fontWeight: 600 }}
                      >
                        {statusConfig.label}
                      </Chip>
                    </td>
                    <td
                      style={{ padding: "12px 16px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="abtn"
                        style={{ display: "flex", gap: 4, opacity: 0 }}
                      >
                        {a.status === "pending" ? (
                          <div
                            style={{
                              display: "flex",
                              borderRadius: 10,
                              overflow: "hidden",
                            }}
                          >
                            <HerouiTooltip
                              closeDelay={0}
                              content={<span>Düzenle</span>}
                            >
                              <button
                                type="button"
                                onClick={() => onEdit(a)}
                                style={{
                                  width: 40,
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "#0d6efd",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <Edit2Icon size={16} color="white" />
                              </button>
                            </HerouiTooltip>
                            <HerouiTooltip
                              closeDelay={0}
                              content={<span>Onayla</span>}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  onPatchStatus(a._id, "confirmed")
                                }
                                style={{
                                  width: 40,
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "#22c55e",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <Check size={16} color="white" />
                              </button>
                            </HerouiTooltip>
                            <HerouiTooltip
                              closeDelay={0}
                              content={<span>İptal Et</span>}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  onPatchStatus(a._id, "cancelled")
                                }
                                style={{
                                  width: 40,
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "#e91e63",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <CircleX size={16} color="white" />
                              </button>
                            </HerouiTooltip>
                          </div>
                        ) : (
                          <ButtonGroup>
                            {a.status !== "completed" && (
                              <HerouiTooltip
                                closeDelay={0}
                                content={<span>Düzenle</span>}
                              >
                                <Button
                                  isIconOnly
                                  size="sm"
                                  className="p-2"
                                  color="primary"
                                  onPress={() => onEdit(a)}
                                >
                                  <Edit2Icon size={18} />
                                </Button>
                              </HerouiTooltip>
                            )}
                            {a.status !== "confirmed" &&
                              a.status !== "completed" && (
                                <HerouiTooltip
                                  closeDelay={0}
                                  content={<span>Onayla</span>}
                                >
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    className="p-2"
                                    color="success"
                                    onPress={() =>
                                      onPatchStatus(a._id, "confirmed")
                                    }
                                  >
                                    <Check size={18} color="white" />
                                  </Button>
                                </HerouiTooltip>
                              )}
                            {a.status !== "cancelled" &&
                              a.status !== "completed" && (
                                <HerouiTooltip
                                  closeDelay={0}
                                  content={<span>İptal Et</span>}
                                >
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    className="p-2"
                                    color="danger"
                                    onPress={() =>
                                      onPatchStatus(a._id, "cancelled")
                                    }
                                  >
                                    <CircleX size={18} />
                                  </Button>
                                </HerouiTooltip>
                              )}
                          </ButtonGroup>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div
        className="flex flex-col gap-4 sm:flex sm:flex-row"
        style={{
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #f0f2f7",
        }}
      >
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          {rows.length} sonuç gösteriliyor
        </span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Randevular 14 gün sonrasında otomatik olarak silinir. Daha uzun süre
          randevuları tutmak için planınızı
          <Link href="/pricing" className="text-blue-400 ml-1">
            hemen yükseltin.
          </Link>
        </span>
      </div>
    </div>
  );
}
