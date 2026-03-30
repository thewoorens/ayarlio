"use client";
import { useState } from "react";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { useUser } from "./hooks/useUser";
import { SettingsSidebar } from "./components/SettingsSidebar";
import { ProfileSection } from "./components/ProfileSection";
import { EmailSection } from "./components/EmailSection";
import { SecuritySection } from "./components/SecuritySection";
import { DeleteAccountModal } from "./components/DeleteAccountModal";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, ShieldAlert, LogOut, Trash2, ArrowRight } from "lucide-react";
import { SectionTitle, cardStyle } from "../settings/components/SettingsUI";

export default function AccountSettingsView() {
  const { user, isLoading, mutate } = useUser();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">("profile");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const showAlert = (type: "success" | "error", message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 5000);
  };

  const handleUpdateProfile = async (data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        showAlert("success", "Profil başarıyla güncellendi");
        mutate();
      } else {
        showAlert("error", result.message);
      }
    } catch (err) {
      showAlert("error", "Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showAlert("success", "Şifreniz başarıyla değiştirildi");
      } else {
        showAlert("error", result.message);
      }
    } catch (err) {
      showAlert("error", "Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("Tüm oturumlardan çıkış yapmak istediğinize emin misiniz?")) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/logout-all", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        showAlert("success", result.message);
        setTimeout(() => window.location.href = "/auth/login", 2000);
      } else {
        showAlert("error", result.message);
      }
    } catch (err) {
      showAlert("error", "İşlem sırasında bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  const initiateDelete = async () => {
    try {
      const res = await fetch("/api/user/delete/initiate", { method: "POST" });
      const result = await res.json();
      return result.success;
    } catch (err) {
      return false;
    }
  };

  const confirmDelete = async (code: string) => {
    try {
      const res = await fetch("/api/user/delete/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await res.json();
      if (result.success) {
        window.location.href = "/auth/register";
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" label="Hesap bilgileri yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 xl:p-12 bg-white rounded-xl p-5 mt-5"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <div className="mb-10 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-zinc-900 tracking-tighter"
          >
            Hesap Yönetimi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-base mt-2 font-semibold"
          >
            Kişisel verileriniz, oturumlarınız ve güvenlik tercihleriniz üzerinde tam kontrol sahibi olun.
          </motion.p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/50">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
            <ShieldAlert size={20} strokeWidth={2.5} />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Hesap Durumu</p>
            <p className="text-sm font-bold text-zinc-800 leading-tight mt-1">Aktif & Güvenli</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <SettingsSidebar activeTab={activeTab} onTabChange={(t) => setActiveTab(t as any)} />

        <div className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {activeTab === "profile" && (
                <div className="flex flex-col gap-8">
                  <ProfileSection
                    initialData={user}
                    isSaving={isSaving}
                    onUpdate={handleUpdateProfile}
                  />
                  <EmailSection
                    initialData={user}
                    isSaving={isSaving}
                    onUpdate={handleUpdateProfile}
                  />
                </div>
              )}

              {activeTab === "security" && (
                <SecuritySection
                  isSaving={isSaving}
                  onUpdate={handleChangePassword}
                />
              )}

              {activeTab === "danger" && (
                <div className="flex flex-col gap-8">
                  <Card shadow="none" style={cardStyle} className="border-zinc-200/60 shadow-sm overflow-hidden group">
                    <CardBody className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                              <LogOut size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Tüm Oturumlardan Çıkış Yap</h3>
                          </div>
                          <p className="text-zinc-500 text-sm leading-relaxed font-medium max-w-xl">
                            Eğer hesabınızın başka cihazlarda açık olduğunu düşünüyorsanız veya şüpheli bir durum fark ettiyseniz,
                            bu işlemi yaparak tüm cihazlardaki oturumlarınızı anında sonlandırabilirsiniz.
                          </p>
                        </div>
                        <Button
                          color="warning"
                          variant="flat"
                          onPress={handleLogoutAll}
                          isLoading={isSaving}
                          startContent={<ArrowRight size={18} />}
                        >
                          Tüm Oturumları Kapat
                        </Button>
                      </div>
                    </CardBody>
                  </Card>

                  <Card shadow="none" style={cardStyle} className="border-rose-200/60 shadow-sm overflow-hidden bg-rose-50/20">
                    <div className="h-1 w-full" />
                    <CardBody className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
                              <Trash2 size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-rose-900 tracking-tight">Hesabı Kalıcı Olarak Sil</h3>
                          </div>
                          <p className="text-rose-700/70 text-sm leading-relaxed font-medium max-w-xl">
                            {user?.role === 'admin'
                              ? "DİKKAT: Yönetici hesabı silindiğinde işletme profili, personel listesi, randevular ve tüm hizmet verileri kalıcı olarak silinecektir. Bu işlem geri alınamaz."
                              : "Hesabınız silindiğinde tüm kişisel verileriniz, geçmişiniz ve erişim haklarınız sistemden kalıcı olarak temizlenecektir."}
                          </p>
                        </div>
                        <Button
                          color="danger"
                          onPress={() => setIsDeleteModalOpen(true)}
                        >
                          Hesabımı Sil
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Status Notifications */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className={`fixed top-8 right-8 p-4 rounded-2xl flex items-center justify-between border shadow-2xl z-[100] min-w-[320px] ${status.type === "success"
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-rose-600 border-rose-500 text-white"
                  } backdrop-blur-md`}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  {status.type === "success" ? <CheckCircle size={22} strokeWidth={3} /> : <AlertCircle size={22} strokeWidth={3} />}
                  {status.message}
                </div>
                <button
                  onClick={() => setStatus(null)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors ml-4"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        isAdmin={user?.role === 'admin'}
        onInitiate={initiateDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
