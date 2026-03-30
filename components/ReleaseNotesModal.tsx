"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Smartphone,
  UserCog,
  Zap,
  Gauge,
  MonitorSmartphone,
  Phone,
  CalendarCheck,
  X,
  Sparkles,
  CheckCircle2,
  Bug,
  Wrench,
} from "lucide-react";

const STORAGE_KEY = "release_notes_seen_v1";

const newFeatures = [
  {
    icon: Smartphone,
    title: "Ayarlio Mobile",
    desc: "Artık her yerden randevularınızı yönetin. Tarayıcı tabanlı mobil uygulama ile tam kontrol sizde.",
  },
  {
    icon: UserCog,
    title: "Hesap Yönetim Sayfası",
    desc: "Hesabınızı tek panelden yönetin.",
    link: { href: "/pano/hesap-yonetimi", label: "Sayfaya git →" },
  }
];

const improvements = [
  { icon: Gauge, text: "Veri yükleme hızı %40 artırıldı" },
  {
    icon: MonitorSmartphone,
    text: "Mobil uyumluluk tüm ekranlar için optimize edildi",
  },
];

const fixes = [
  { icon: Phone, text: "Telefon numarası alanı düzeltildi" },
  { icon: CalendarCheck, text: "Tarih seçimi senkronizasyon hatası giderildi" },
  { icon: Bug, text: "Modal kapanma animasyon hatası düzeltildi" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

export default function ReleaseNotesModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="h-full"
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(15,23,42,0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            key="modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            style={{
              width: "100%",
              maxWidth: 460,
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              style={{
                padding: "20px 22px 16px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <motion.div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Rocket size={18} color="#16a34a" strokeWidth={2} />
                </motion.div>
                <div>
                  <motion.div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Ayarlio v0.1.5
                    </span>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontWeight: 600,
                        color: "#16a34a",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: 99,
                        padding: "2px 7px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      BETA
                    </span>
                  </motion.div>
                  <motion.p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginTop: 1,
                    }}
                  >
                    30 Mart 2026 · Sürüm Notları
                  </motion.p>
                </div>
              </div>

              <motion.button
                onClick={handleClose}
                whileHover={{ background: "#f1f5f9" }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
              >
                <X size={15} color="#94a3b8" />
              </motion.button>
            </motion.div>

            {/* Body */}
            <div
              style={{
                maxHeight: "56vh",
                overflowY: "auto",
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* New Features */}
              <motion.section
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#f59e0b",
                      textTransform: "uppercase",
                    }}
                  >
                    Yeni Özellikler
                  </span>
                </motion.div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {newFeatures.map(({ icon: Icon, title, desc, link }) => (
                    <motion.div
                      key={title}
                      whileHover={{ background: "#f8fafc" }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 11,
                        padding: "10px 12px",
                        borderRadius: 12,
                        transition: "background 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Icon size={14} color="#475569" strokeWidth={2} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            color: "#1e293b",
                            lineHeight: 1.3,
                          }}
                        >
                          {title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.74rem",
                            color: "#64748b",
                            marginTop: 2,
                            lineHeight: 1.5,
                          }}
                        >
                          {desc}
                        </p>
                        {link && (
                          <a
                            href={link.href}
                            style={{
                              fontSize: "0.72rem",
                              color: "#3b82f6",
                              fontWeight: 500,
                              textDecoration: "none",
                              display: "inline-block",
                              marginTop: 3,
                            }}
                          >
                            {link.label}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <div style={{ height: 1, background: "#f1f5f9" }} />

              {/* Improvements */}
              <motion.section
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <Wrench size={12} color="#8b5cf6" strokeWidth={2.5} />
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#8b5cf6",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    İyileştirmeler
                  </span>
                </motion.div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 7 }}
                >
                  {improvements.map(({ icon: Icon, text }) => (
                    <motion.div
                      key={text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "0 12px",
                      }}
                    >
                      <Icon
                        size={13}
                        color="#94a3b8"
                        strokeWidth={2}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "0.77rem", color: "#475569" }}>
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <div style={{ height: 1, background: "#f1f5f9" }} />

              {/* Bug Fixes */}
              <motion.section
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <Bug size={12} color="#ef4444" strokeWidth={2.5} />
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#ef4444",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Hata Düzeltmeleri
                  </span>
                </motion.div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 7 }}
                >
                  {fixes.map(({ icon: Icon, text }) => (
                    <motion.div
                      key={text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "0 12px",
                      }}
                    >
                      <Icon
                        size={13}
                        color="#94a3b8"
                        strokeWidth={2}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "0.77rem", color: "#475569" }}>
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: "14px 22px 18px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <motion.button
                whileHover={{ background: "#15803d" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 18px",
                  fontSize: "0.81rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <CheckCircle2 size={14} strokeWidth={2.5} />
                Anladım
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
