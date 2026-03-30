"use client";

import { use, useEffect, useState, useCallback, useMemo } from "react";
import NotFoundRedirect from "./components/NotFoundRedirect";
import ChatWidget from "./components/ChatWidget";
import Image from "next/image";
import { Button, Input, Textarea, Spinner } from "@heroui/react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  WalletCardsIcon,
  Users,
  CalendarDays,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Phone,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutList,
} from "lucide-react";

type StepRef = { id: number; label: string; icon: any; type: string };

const TR_DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

/* ══════════════════════════════════════
   CUSTOM CALENDAR COMPONENT
══════════════════════════════════════ */
function CalendarPicker({
  value,
  onChange,
  disabledDates = [],
  isUnavailable,
}: {
  value: string | null;
  onChange: (date: string) => void;
  disabledDates?: string[];
  isUnavailable?: (date: string) => boolean;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  // Monday-first: 0=Mon...6=Sun
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const toISO = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const isPast = (d: number) => {
    const dt = new Date(viewYear, viewMonth, d);
    return dt < today;
  };

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={viewYear === today.getFullYear() && viewMonth <= today.getMonth()}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <motion.span
          key={`${viewYear}-${viewMonth}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold text-neutral-800"
        >
          {TR_MONTHS[viewMonth]} {viewYear}
        </motion.span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {TR_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-neutral-400 py-1 tracking-wide">
            {d}
          </div>
        ))}
      </div>

      <motion.div
        key={`${viewYear}-${viewMonth}-grid`}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-7 gap-y-1"
      >
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const iso = toISO(viewYear, viewMonth, day);
          const past = isPast(day);
          const disabled = past || disabledDates.includes(iso);
          const unavailable = isUnavailable ? isUnavailable(iso) : false;
          const selected = value === iso;
          const isToday = iso === toISO(today.getFullYear(), today.getMonth(), today.getDate());
          const notAllowed = disabled || unavailable;

          return (
            <div key={iso} className="flex justify-center">
              <motion.button
                whileHover={!notAllowed ? { scale: 1.12 } : {}}
                whileTap={!notAllowed ? { scale: 0.92 } : {}}
                disabled={notAllowed}
                onClick={() => !notAllowed && onChange(iso)}
                className={clsx(
                  "w-9 h-9 rounded-full text-sm font-medium transition-all duration-150 relative",
                  selected
                    ? "bg-neutral-900 text-white shadow-md"
                    : isToday && !notAllowed
                      ? "bg-neutral-100 text-neutral-900 font-bold"
                      : unavailable && !past
                        ? "text-red-400 bg-red-50/50 cursor-not-allowed opacity-80 decoration-red-300"
                        : disabled
                          ? "text-neutral-300 cursor-not-allowed"
                          : "text-neutral-700 hover:bg-neutral-100",
                )}
              >
                {day}
                {isToday && !selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neutral-400" />
                )}
              </motion.button>
            </div>
          );
        })}
      </motion.div>

      <div className="mt-5 flex items-start gap-2 pt-3 border-t border-neutral-100">
        <div className="w-3 h-3 rounded-full bg-red-50 mt-0.5 border border-red-200 shrink-0"></div>
        <span className="text-[10.5px] text-neutral-400 leading-snug">
          Kırmızı görünümlü günler personelin çalışmadığı veya tüm saatlerinin dolu olduğu günlerdir.
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   AYARLIO INTRO SPLASH
══════════════════════════════════════ */
function AyarlioIntro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafaf8] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-neutral-200"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: i * 2.5, opacity: 1 / (i * 1.5) }}
          transition={{ delay: i * 0.12, duration: 1.2, ease: "easeOut" }}
          style={{ width: 120, height: 120 }}
        />
      ))}
      <motion.div
        className="relative flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          initial={{ rotate: -12, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/ayarlio-logo.png"
            alt="Ayarlio Logo"
            width={200}
            height={200}
          />
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <p className="text-[11px] text-neutral-400 tracking-[0.2em] uppercase font-medium">
            Online Randevu Sistemi
          </p>
        </motion.div>
        <motion.div
          className="w-28 h-0.5 bg-neutral-100 rounded-full overflow-hidden mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <motion.div
            className="h-full bg-neutral-900 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.75, duration: 1.4, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function TenantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const cleanSlug = slug.toLowerCase().trim();

  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const isCatFirst = Boolean(data?.tenant?.settings?.showCategoriesFirst);
  const categories = Array.from(
    new Set(data?.services?.map((s: any) => s.category).filter(Boolean))
  ) as string[];

  const STEPS = isCatFirst
    ? [
      { id: 1, label: "Kategori", icon: LayoutList, type: "category" },
      { id: 2, label: "Hizmet", icon: WalletCardsIcon, type: "service" },
      { id: 3, label: "Personel", icon: Users, type: "staff" },
      { id: 4, label: "Tarih & Saat", icon: CalendarDays, type: "datetime" },
      { id: 5, label: "Bilgiler", icon: UserCheck, type: "info" },
    ]
    : [
      { id: 1, label: "Hizmet", icon: WalletCardsIcon, type: "service" },
      { id: 2, label: "Personel", icon: Users, type: "staff" },
      { id: 3, label: "Tarih & Saat", icon: CalendarDays, type: "datetime" },
      { id: 4, label: "Bilgiler", icon: UserCheck, type: "info" },
    ];

  const maxSteps = STEPS.length;
  const currentStepInfo = STEPS.find((s) => s.id === step);
  const currentStepType = currentStepInfo?.type || "info";

  useEffect(() => {
    if (
      data?.tenant?._id &&
      !sessionStorage.getItem(`visited_${data.tenant._id}`)
    ) {
      fetch("/api/tenant/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: data.tenant._id }),
      }).catch(console.error);
      sessionStorage.setItem(`visited_${data.tenant._id}`, "true");
    }
  }, [data?.tenant]);

  // Fixed: properly checks if a time slot overlaps with existing appointments
  const isTimeSlotAvailable = useCallback(
    (timeStr: string): boolean => {
      if (!selectedDate || !selectedStaff || !selectedService) return true;

      const [h, m] = timeStr.split(":").map(Number);

      // Seçilen tarihi UTC olarak oluştur (backend UTC gönderiyor)
      const [year, month, day] = selectedDate.split("-").map(Number);
      const proposedStart = new Date(Date.UTC(year, month - 1, day, h - 3, m)); // TR → UTC (UTC+3)

      if (proposedStart <= new Date()) return false;

      if (!data?.appointments?.length) return true;

      const dur = selectedService.duration || { value: 60, unit: "minutes" };
      const durMs =
        dur.unit === "hours" ? dur.value * 3_600_000 : dur.value * 60_000;
      const proposedEnd = new Date(proposedStart.getTime() + durMs);

      return !data.appointments.some((appt: any) => {
        if (appt.staffId !== selectedStaff._id) return false;
        if (appt.status === "cancelled") return false;

        const apptStart = new Date(appt.startTime); // ISO string, direkt UTC
        const apptEnd = new Date(appt.endTime);

        return proposedStart < apptEnd && proposedEnd > apptStart;
      });
    },
    [selectedDate, selectedStaff, selectedService, data?.appointments],
  );

  const timeSlots = useMemo(() => {
    if (!selectedStaff || !selectedStaff.startTime || !selectedStaff.endTime) {
      return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
    }
    const [startH, startM] = selectedStaff.startTime.split(":").map(Number);
    const [endH, endM] = selectedStaff.endTime.split(":").map(Number);
    const slots = [];
    let curH = startH;
    let curM = startM;
    while (curH * 60 + curM <= endH * 60 + endM) {
      slots.push(`${String(curH).padStart(2, "0")}:${String(curM).padStart(2, "0")}`);
      curM += 30;
      if (curM >= 60) {
        curH += 1;
        curM -= 60;
      }
    }
    return slots;
  }, [selectedStaff]);

  const isUnavailable = useCallback((isoStr: string) => {
    if (!selectedStaff || !selectedStaff.workDays) return false;
    const parsed = new Date(isoStr);
    const trDaysMap = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const dayName = trDaysMap[parsed.getDay()];
    return !selectedStaff.workDays.includes(dayName);
  }, [selectedStaff]);

  // Pre-compute available slots for the selected date
  const slotAvailability = useCallback(() => {
    return timeSlots.reduce(
      (acc, t) => {
        acc[t] = isTimeSlotAvailable(t);
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }, [isTimeSlotAvailable, timeSlots]);

  const availability = slotAvailability();

  const handleBookAppointment = async () => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const [h, m] = selectedTime!.split(":").map(Number);
      const startTime = new Date(selectedDate!);
      startTime.setHours(h, m, 0, 0);
      const dur = selectedService.duration || { value: 60, unit: "minutes" };
      const durMs =
        dur.unit === "hours" ? dur.value * 3_600_000 : dur.value * 60_000;
      const endTime = new Date(startTime.getTime() + durMs);

      const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: data.tenant._id,
          serviceId: selectedService._id,
          staffId: selectedStaff._id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          customerNote: form.note,
        }),
      });
      const result = await res.json();
      setSubmitMessage({
        type: result.success ? "success" : "error",
        text: result.message || "Bir hata oluştu.",
      });
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Sunucu ile iletişim kurulamadı.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch(`/api/page?slug=${cleanSlug}`)
      .then((r) => r.json())
      .then((body) => {
        if (mounted) {
          setData(body.success ? body.data : null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setData(null);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [cleanSlug]);

  if (loading && !showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!loading && !data?.tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8] px-4">
        <div className="max-w-sm w-full bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-neutral-800">
            Sayfa Bulunamadı
          </h2>
          <p className="text-neutral-500 text-sm">
            Aradığınız randevu sayfası mevcut değil.
          </p>
          <NotFoundRedirect />
        </div>
      </div>
    );
  }

  const { tenant, services, staff } = data || {};
  const availableStaff =
    staff?.filter((p: any) => selectedService?.staffIds?.includes(p._id)) ?? [];

  const listVariants: any = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.055 } },
  };
  const itemVariants: any = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { font-family: 'DM Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        html, body { background: #fafaf8; overscroll-behavior: none; }
      `}</style>

      <AnimatePresence>
        {showIntro && <AyarlioIntro onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {!showIntro && !loading && data?.tenant && (
          <motion.div
            key="page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen min-h-dvh bg-[#fafaf8] flex flex-col"
          >
            {/* Dot pattern */}
            <div
              className="fixed inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: 0.35,
              }}
            />

            {/* ── HEADER BAR (mobile sticky) ── */}
            <motion.header
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-30 sticky top-0 bg-[#fafaf8]/90 backdrop-blur-md border-b border-neutral-200/70 px-5 pt-safe-top"
            >
              <div className="max-w-xl mx-auto flex flex-col py-4 gap-3">
                {/* Business info row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="serif text-xl leading-tight text-neutral-900 truncate">
                      {tenant.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Sparkles size={10} className="text-neutral-300" />
                        {tenant.industry}
                      </span>
                      {tenant.phone && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <Phone size={10} className="text-neutral-300" />
                          {tenant.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Step counter pill */}
                  <div className="shrink-0 bg-neutral-900 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                    {step}/{maxSteps}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neutral-900 rounded-full"
                    animate={{ width: `${(step / maxSteps) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>

                {/* Step labels */}
                <div className="flex items-center">
                  {STEPS.map((s, idx) => {
                    const done = step > s.id;
                    const current = step === s.id;
                    const Icon = s.icon;
                    return (
                      <div key={s.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-1">
                          <motion.div
                            animate={{
                              backgroundColor: done
                                ? "#171717"
                                : current
                                  ? "#fff"
                                  : "#fff",
                              borderColor: done
                                ? "#171717"
                                : current
                                  ? "#171717"
                                  : "#e5e5e5",
                              scale: current ? 1.08 : 1,
                            }}
                            transition={{ duration: 0.25 }}
                            className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                          >
                            {done ? (
                              <CheckCircle2 size={13} className="text-white" />
                            ) : (
                              <Icon
                                size={12}
                                className={
                                  current
                                    ? "text-neutral-900"
                                    : "text-neutral-300"
                                }
                              />
                            )}
                          </motion.div>
                          <span
                            className={clsx(
                              "text-[9px] font-semibold tracking-wide transition-colors",
                              current
                                ? "text-neutral-800"
                                : done
                                  ? "text-neutral-500"
                                  : "text-neutral-300",
                            )}
                          >
                            {s.label}
                          </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div className="flex-1 h-px mx-1 mb-4 bg-neutral-200 overflow-hidden relative">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-neutral-900"
                              animate={{ width: step > s.id ? "100%" : "0%" }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.header>

            {/* ── SUMMARY BAR ── */}
            <AnimatePresence>
              {(selectedCategory || selectedService || selectedStaff || selectedTime) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-20 border-b border-neutral-200/60 bg-white/70 backdrop-blur-sm overflow-hidden"
                >
                  <div className="max-w-xl mx-auto px-5 py-2.5 flex flex-wrap gap-x-3 gap-y-1">
                    {isCatFirst && selectedCategory && !selectedService && (
                      <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <LayoutList size={11} className="text-neutral-400" />
                        {selectedCategory}
                      </span>
                    )}
                    {selectedService && (
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <WalletCardsIcon
                          size={11}
                          className="text-neutral-400"
                        />
                        <span className="font-semibold text-neutral-700">
                          {selectedService.name}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="font-bold text-neutral-900">
                          {selectedService.price} {selectedService.currency}
                        </span>
                      </span>
                    )}
                    {selectedStaff && (
                      <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <Users size={11} className="text-neutral-400" />
                        {selectedStaff.name}
                      </span>
                    )}
                    {selectedDate && selectedTime && (
                      <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <CalendarDays size={11} className="text-neutral-400" />
                        {new Date(
                          selectedDate + "T12:00:00",
                        ).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                        })}
                        <span className="text-neutral-300">·</span>
                        {selectedTime}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="relative z-20 flex-1 overflow-y-auto">
              <div className="max-w-xl mx-auto px-0 sm:px-4 py-4 pb-28">
                <div className="bg-white sm:rounded-3xl sm:border sm:border-neutral-200/80 sm:shadow-sm overflow-hidden">
                  <div className="px-5 py-5 sm:px-7 sm:py-6">
                    <AnimatePresence mode="wait" custom={direction}>
                      {/* ── STEP: CATEGORY ── */}
                      {currentStepType === "category" && (
                        <SlideStep key="cat" dir={direction}>
                          <StepHeader
                            icon={LayoutList}
                            title="Kategori Seçin"
                            subtitle="Almak istediğiniz hizmetin türünü seçin"
                          />
                          <motion.div
                            className="mt-4 space-y-2.5"
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {categories.length === 0 ? (
                              <div className="text-center py-12 text-neutral-400">
                                Kategori bulunamadı.
                              </div>
                            ) : (
                              categories.map((cat: string) => (
                                <motion.div key={cat} variants={itemVariants}>
                                  <button
                                    onClick={() => {
                                      setSelectedCategory(cat);
                                      setSelectedService(null);
                                      goTo(step + 1);
                                    }}
                                    className={clsx(
                                      "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between",
                                      selectedCategory === cat
                                        ? "border-neutral-900 bg-neutral-900/5 shadow-sm"
                                        : "border-neutral-200/60 bg-white hover:border-neutral-300 hover:bg-neutral-50/50"
                                    )}
                                  >
                                    <div className="font-semibold text-neutral-800">{cat}</div>
                                    <ChevronRight size={18} className="text-neutral-400" />
                                  </button>
                                </motion.div>
                              ))
                            )}
                          </motion.div>
                        </SlideStep>
                      )}

                      {/* ── STEP: SERVICE ── */}
                      {currentStepType === "service" && (
                        <SlideStep key="srv" dir={direction}>
                          <StepHeader
                            icon={WalletCardsIcon}
                            title="Hizmet Seçin"
                            subtitle="Almak istediğiniz hizmeti seçin"
                          />
                          <motion.div
                            className="mt-4 space-y-2.5"
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {services
                              .filter((service: any) => isCatFirst && selectedCategory ? service.category === selectedCategory : true)
                              .map((service: any) => (
                              <motion.div key={service._id} variants={itemVariants}>
                                <ServiceCard
                                  service={service}
                                  selected={selectedService?._id === service._id}
                                  onSelect={() => setSelectedService(service)}
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        </SlideStep>
                      )}

                      {/* ── STEP: STAFF ── */}
                      {currentStepType === "staff" && (
                        <SlideStep key="stf" dir={direction}>
                          <StepHeader
                            icon={Users}
                            title="Personel Seçin"
                            subtitle="Hizmetinizi alacağınız personeli seçin"
                          />
                          <motion.div
                            className="mt-4 space-y-2.5"
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {availableStaff.length === 0 ? (
                              <motion.div className="text-center py-12 text-neutral-400">
                                <Users size={28} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Bu hizmet için uygun personel yok.</p>
                              </motion.div>
                            ) : (
                              availableStaff.map((p: any) => (
                                <motion.div key={p._id} variants={itemVariants}>
                                  <StaffCard
                                    person={p}
                                    selected={selectedStaff?._id === p._id}
                                    onSelect={() => setSelectedStaff(p)}
                                  />
                                </motion.div>
                              ))
                            )}
                          </motion.div>
                        </SlideStep>
                      )}

                      {/* ── STEP: DATE & TIME ── */}
                      {currentStepType === "datetime" && (
                        <SlideStep key="dt" dir={direction}>
                          <StepHeader
                            icon={CalendarDays}
                            title="Tarih & Saat"
                            subtitle="Randevu tarihinizi belirleyin"
                          />
                          <div className="mt-4 space-y-5">
                            {/* Custom Calendar */}
                            <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4">
                              <CalendarPicker
                                value={selectedDate}
                                isUnavailable={isUnavailable}
                                onChange={(iso) => {
                                  setSelectedDate(iso);
                                  setSelectedTime(null);
                                }}
                              />
                            </div>

                            {/* Time slots */}
                            <AnimatePresence>
                              {selectedDate ? (
                                <motion.div
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-400">
                                      Saat Seçin
                                    </label>
                                    <span className="text-[10px] text-neutral-400">
                                      {new Date(selectedDate + "T12:00:00").toLocaleDateString("tr-TR", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                      })}
                                    </span>
                                  </div>
                                  <motion.div
                                    className="grid grid-cols-4 sm:grid-cols-6 gap-2"
                                    variants={listVariants}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    {timeSlots.map((time) => {
                                      const ok = availability[time];
                                      const sel = selectedTime === time;
                                      return (
                                        <motion.button
                                          key={time}
                                          variants={{
                                            hidden: { opacity: 0, scale: 0.82 },
                                            visible: {
                                              opacity: 1,
                                              scale: 1,
                                              transition: { duration: 0.2 },
                                            },
                                          }}
                                          disabled={!ok}
                                          onClick={() => ok && setSelectedTime(time)}
                                          whileHover={ok ? { scale: 1.06, y: -1 } : {}}
                                          whileTap={ok ? { scale: 0.94 } : {}}
                                          className={clsx(
                                            "py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150",
                                            sel
                                              ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                                              : ok
                                                ? "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-500 hover:text-neutral-900"
                                                : "bg-neutral-50/80 text-neutral-300 border-neutral-100 cursor-not-allowed line-through decoration-neutral-300",
                                          )}
                                        >
                                          {time}
                                        </motion.button>
                                      );
                                    })}
                                  </motion.div>
                                  {/* Legend */}
                                  <div className="flex items-center gap-4 mt-3">
                                    <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                      <span className="w-3 h-3 rounded-md bg-white border border-neutral-200 inline-block" />
                                      Müsait
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                      <span className="w-3 h-3 rounded-md bg-neutral-50 border border-neutral-100 inline-block" />
                                      Dolu
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                      <span className="w-3 h-3 rounded-md bg-neutral-900 inline-block" />
                                      Seçili
                                    </span>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex flex-col items-center gap-2 py-6 text-neutral-300"
                                >
                                  <CalendarDays size={24} className="opacity-40" />
                                  <p className="text-xs text-neutral-400">Yukarıdan bir tarih seçin</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </SlideStep>
                      )}

                      {/* ── STEP: FORM ── */}
                      {currentStepType === "info" && (
                        <SlideStep key="inf" dir={direction}>
                          {submitMessage?.type === "success" ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.93 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                              className="text-center py-8 space-y-5"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 14 }}
                                className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto shadow-lg"
                              >
                                <CheckCircle2 size={28} className="text-white" />
                              </motion.div>
                              <div>
                                <h3 className="serif text-2xl text-neutral-900">Randevunuz Alındı</h3>
                                <p className="text-neutral-500 text-sm mt-1.5">{submitMessage.text}</p>
                              </div>
                              <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4 text-left space-y-3">
                                {[
                                  { label: "Hizmet", value: selectedService?.name },
                                  { label: "Personel", value: selectedStaff?.name },
                                  {
                                    label: "Tarih",
                                    value: selectedDate
                                      ? new Date(selectedDate + "T12:00:00").toLocaleDateString("tr-TR", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        })
                                      : "",
                                  },
                                  { label: "Saat", value: selectedTime ?? "" },
                                  { label: "Tutar", value: `${selectedService?.price} ${selectedService?.currency}` },
                                ].map(({ label, value }) => (
                                  <div key={label} className="flex justify-between text-sm">
                                    <span className="text-neutral-400">{label}</span>
                                    <span className="font-semibold text-neutral-800">{value}</span>
                                  </div>
                                ))}
                              </div>
                              <Button
                                variant="flat"
                                className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl font-medium text-sm w-full"
                                onPress={() => window.location.reload()}
                              >
                                Yeni Randevu Oluştur
                              </Button>
                            </motion.div>
                          ) : (
                            <>
                              <StepHeader icon={UserCheck} title="Bilgileriniz" subtitle="Randevuyu tamamlamak için bilgilerinizi girin" />
                              <motion.div className="mt-4 space-y-3" variants={listVariants} initial="hidden" animate="visible">
                                {[
                                  { label: "Ad Soyad", key: "name", type: "text", placeholder: "Ahmet Yılmaz" },
                                  { label: "Telefon", key: "phone", type: "tel", placeholder: "05XX XXX XX XX" },
                                  { label: "E-posta", key: "email", type: "email", placeholder: "ornek@mail.com" },
                                ].map(({ label, key, type, placeholder }) => (
                                  <motion.div key={key}>
                                    <Input
                                      label={label}
                                      type={type}
                                      placeholder={placeholder}
                                      variant="bordered"
                                      isRequired
                                      value={(form as any)[key]}
                                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                      classNames={{
                                        label: "text-neutral-500 text-sm",
                                        input: "text-neutral-900 text-sm placeholder:text-neutral-300",
                                        inputWrapper: "border-neutral-200 hover:border-neutral-400 focus-within:!border-neutral-900 bg-neutral-50/80 rounded-xl",
                                      }}
                                    />
                                  </motion.div>
                                ))}
                                <motion.div>
                                  <Textarea
                                    label="Not (opsiyonel)"
                                    placeholder="Eklemek istediğiniz bir not..."
                                    variant="bordered"
                                    value={form.note}
                                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                                    classNames={{
                                      label: "text-neutral-500 text-sm",
                                      input: "text-neutral-900 text-sm placeholder:text-neutral-300",
                                      inputWrapper: "border-neutral-200 hover:border-neutral-400 focus-within:!border-neutral-900 bg-neutral-50/80 rounded-xl",
                                    }}
                                    minRows={2}
                                  />
                                </motion.div>
                              </motion.div>
                              <AnimatePresence>
                                {submitMessage?.type === "error" && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl"
                                  >
                                    {submitMessage.text}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </SlideStep>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

    {/* ── BOTTOM NAV BAR (fixed, app-like) ── */ }
            {submitMessage?.type !== "success" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="fixed bottom-0 inset-x-0 z-40 pb-safe-bottom"
              >
                <div className="bg-white/90 backdrop-blur-xl border-t border-neutral-200/80 px-5 py-3 shadow-lg shadow-neutral-200/50">
                  <div className="max-w-xl mx-auto flex items-center sm:justify-between gap-3">
                    {/* Back */}
                    {step > 1 ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goTo(step - 1)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-600 text-sm font-medium hover:bg-neutral-200 transition-colors"
                      >
                        <ArrowLeft size={15} />
                        Geri
                      </motion.button>
                    ) : (
                      <div className="xs:hidden" />
                    )}

                    {/* Summary center */}
                    {selectedService && step > 1 && (
                      <div className="hidden sm:flex flex-col items-center text-center">
                        <span className="text-xs font-semibold text-neutral-800">
                          {selectedService.name}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {selectedService.price} {selectedService.currency}
                        </span>
                      </div>
                    )}

                    {/* Next / Submit */}
                    {step < maxSteps ? (
                      <motion.button
                        whileHover={{ scale: nextEnabled(currentStepType, selectedCategory, selectedService, selectedStaff, selectedDate, selectedTime) ? 1.02 : 1 }}
                        whileTap={{ scale: nextEnabled(currentStepType, selectedCategory, selectedService, selectedStaff, selectedDate, selectedTime) ? 0.97 : 1 }}
                        disabled={!nextEnabled(currentStepType, selectedCategory, selectedService, selectedStaff, selectedDate, selectedTime)}
                        onClick={() => goTo(step + 1)}
                        className={clsx(
                          "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          nextEnabled(currentStepType, selectedCategory, selectedService, selectedStaff, selectedDate, selectedTime)
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "bg-neutral-200 text-neutral-400 cursor-not-allowed",
                        )}
                      >
                        İleri
                        <ArrowRight size={15} />
                      </motion.button>
                    ) : submitMessage?.type !== "error" ? (
                      <motion.button
                        whileHover={{ scale: !form.name || !form.phone || !form.email || isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: !form.name || !form.phone || !form.email || isSubmitting ? 1 : 0.97 }}
                        disabled={!form.name || !form.phone || !form.email || isSubmitting}
                        onClick={handleBookAppointment}
                        className={clsx(
                          "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          (!form.name || !form.phone || !form.email || isSubmitting)
                            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                            : "bg-neutral-900 text-white shadow-sm",
                        )}
                      >
                        {isSubmitting ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          <>
                            Randevu Oluştur
                            <CheckCircle2 size={15} />
                          </>
                        )}
                      </motion.button>
                    ) : null}
                  </div>
                </div>

                {/* Ayarlio footer */}
                <div className="bg-white/80 backdrop-blur-xl border-t border-neutral-100/60 py-1.5 text-center">
                  <a
                    href="https://ayarlio.com"
                    className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <span className="w-3 h-px bg-neutral-300" />
                    <span style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className="font-normal text-neutral-500">
                      ayarlio
                    </span>
                    <span className="tracking-widest uppercase">tarafından sunulmaktadır</span>
                    <span className="w-3 h-px bg-neutral-300" />
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {data?.tenant && <ChatWidget tenantName={tenant?.name} />}
    </>
  );
}

/* ── Helper: is next button enabled for this step ── */
function nextEnabled(
  stepType: string,
  category: string | null,
  service: any,
  staff: any,
  date: string | null,
  time: string | null,
): boolean {
  if (stepType === "category") return !!category;
  if (stepType === "service") return !!service;
  if (stepType === "staff") return !!staff;
  if (stepType === "datetime") return !!date && !!time;
  return false;
}

/* ══════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════ */

function SlideStep({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: number;
}) {
  return (
    <motion.div
      custom={dir}
      initial={{ opacity: 0, x: dir * 22 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: dir * -22 }}
      transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StepHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-1">
      <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-neutral-600" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        <p className="text-neutral-400 text-xs mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  selected,
  onSelect,
}: {
  service: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const dur = service.duration || { value: 60, unit: "minutes" };
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.985 }}
      className={clsx(
        "w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-200 group",
        selected
          ? "border-neutral-800 bg-neutral-900 shadow-md"
          : "border-neutral-200 bg-white active:bg-neutral-50",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              "font-semibold text-sm",
              selected ? "text-white" : "text-neutral-800",
            )}
          >
            {service.name}
          </p>
          <span className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
            <Clock size={10} />
            {dur.value} {dur.unit === "minutes" ? "dakika" : "saat"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span
            className={clsx(
              "text-sm font-bold",
              selected ? "text-white" : "text-neutral-900",
            )}
          >
            {service.price}
            <span className="text-xs font-normal ml-0.5 text-neutral-400">
              {" "}
              {service.currency}
            </span>
          </span>
          <div
            className={clsx(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
              selected ? "border-white bg-white" : "border-neutral-300",
            )}
          >
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-2 h-2 rounded-full bg-neutral-900"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function StaffCard({
  person,
  selected,
  onSelect,
}: {
  person: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const initials = person.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.985 }}
      className={clsx(
        "w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-200 group",
        selected
          ? "border-neutral-800 bg-neutral-900 shadow-md"
          : "border-neutral-200 bg-white active:bg-neutral-50",
      )}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all",
            selected
              ? "bg-white text-neutral-900"
              : "bg-neutral-100 text-neutral-600",
          )}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              "font-semibold text-sm",
              selected ? "text-white" : "text-neutral-800",
            )}
          >
            {person.name}
          </p>
          <p className="text-xs mt-0.5 text-neutral-400">{person.role}</p>
        </div>
        {person.workDays?.length > 0 && (
          <div className="hidden sm:flex gap-1 flex-wrap justify-end max-w-32">
            {person.workDays.map((d: string) => (
              <span
                key={d}
                className={clsx(
                  "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                  selected
                    ? "bg-neutral-700 text-neutral-300"
                    : "bg-neutral-100 text-neutral-500",
                )}
              >
                {d}
              </span>
            ))}
          </div>
        )}
        <div
          className={clsx(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
            selected ? "border-white bg-white" : "border-neutral-300",
          )}
        >
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-2 h-2 rounded-full bg-neutral-900"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}
