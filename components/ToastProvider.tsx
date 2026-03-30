"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";
import { HeroUIProvider } from "@heroui/react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string, type: ToastType = "info") {
    const id = Math.random().toString(36).slice(2);

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <HeroUIProvider>
      <ToastContext.Provider value={{ showToast }}>
        {children}

        {/* Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`
              flex items-start gap-3 px-4 py-3 rounded-lg shadow-md text-sm min-w-60
              animate-in fade-in slide-in-from-top-2
              ${
                toast.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : toast.type === "error"
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-gray-50 border border-gray-200 text-gray-700"
              }
            `}
            >
              <span className="flex-1">{toast.message}</span>

              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </HeroUIProvider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
