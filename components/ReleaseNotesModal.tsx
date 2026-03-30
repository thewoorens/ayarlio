"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "release_notes_seen_v1";

export default function ReleaseNotesModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 dark:text-white">
                Ayarlio v0.1.5 [BETA] - Sürüm Notları
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Yeni sürümde neler değişti?
              </p>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="font-medium text-neutral-800 dark:text-white">
                  Yeni Özellikler
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                  <li>• Ayarlio Mobile artık mevcut</li>
                  <li>• Hesap Yönetim sayfası <a href="/pano/hesap-yonetim" className="text-blue-500 hover:underline">buradan</a> ulaşabilirsiniz</li>
                  <li>• Hızlı işlem FAB </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-neutral-800 dark:text-white">
                  ⚡ İyileştirmeler
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                  <li>• Daha hızlı veri yükleme</li>
                  <li>• Mobil uyumluluk arttırıldı</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-neutral-800 dark:text-white">
                  🐛 Hata Düzeltmeleri
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                  <li>• Tarih seçimi hatası giderildi</li>
                  <li>• Modal kapanma bug fix</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow hover:opacity-90 transition"
              >
                Anladım
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
