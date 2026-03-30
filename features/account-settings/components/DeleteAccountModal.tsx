"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox
} from "@heroui/react";
import { Trash2, AlertTriangle, ShieldAlert, MailOpen, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onConfirm: (code: string) => Promise<void>;
  onInitiate: () => Promise<boolean>;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  isAdmin,
  onConfirm,
  onInitiate
}: DeleteAccountModalProps) {
  const [step, setStep] = useState(1);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [otp, setOtp] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInitiate = async () => {
    setIsInitiating(true);
    setErrorMsg(null);
    const success = await onInitiate();
    if (success) {
      setStep(2);
    } else {
      setErrorMsg("Doğrulama kodu gönderilemedi, lütfen tekrar deneyin.");
    }
    setIsInitiating(false);
  };

  const handleConfirm = async () => {
    if (otp.length !== 6) {
      setErrorMsg("Lütfen 6 haneli doğrulama kodunu girin.");
      return;
    }

    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await onConfirm(otp);
    } catch (err: any) {
      setErrorMsg(err.message || "Hesap silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setConfirmCheckbox(false);
    setOtp("");
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={resetModal}
      backdrop="blur"
      size="lg"
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-md",
        base: "border border-zinc-200 bg-white rounded-[24px] shadow-2xl",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center pt-8">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-2">
                <Trash2 size={28} />
              </div>
              <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Kalıcı Hesap Silme</h2>
              <p className="text-sm font-medium text-zinc-500">Bu işlem geri alınamaz.</p>
            </ModalHeader>

            <ModalBody className="px-8 pb-8">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4 py-4"
                  >
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 items-start">
                      <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-bold text-rose-900">Önemli Uyarı</p>
                        <p className="text-xs text-rose-700/80 leading-relaxed mt-0.5">
                          {isAdmin
                            ? "Yönetici hesabınızı sildiğinizde, işletmenize bağlı tüm veriler (hizmetler, randevular, personel ve müşteri kayıtları) KALICI OLARAK silinecektir."
                            : "Hesabınızı sildiğinizde, tüm kişisel verileriniz ve erişim haklarınız kalıcı olarak kaldırılacaktır."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <Checkbox
                        isSelected={confirmCheckbox}
                        onValueChange={setConfirmCheckbox}
                        className="items-start"
                        color="danger"
                      >
                        <div className="flex flex-col">
                          <span className="text-zinc-800 text-sm font-semibold">Tüm verilerimin silinmesini onaylıyorum.</span>
                          <span className="text-zinc-500 text-xs">Bu işlem sonucunda hiçbir veri kurtarılamayacaktır.</span>
                        </div>
                      </Checkbox>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6 py-4 items-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-2 border border-blue-100 shadow-inner">
                      <MailOpen size={32} />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 font-bold text-lg leading-tight">E-posta Adresinizi Kontrol Edin</h3>
                      <p className="text-zinc-500 text-sm mt-2 px-10">
                        Güvenliğiniz için kayıtlı email adresinize 6 haneli bir doğrulama kodu gönderdik.
                      </p>
                    </div>

                    <div className="w-full max-w-[240px] mt-4">
                      <Input
                        value={otp}
                        onValueChange={(v) => setOtp(v.toUpperCase())}
                        placeholder="• • • • • •"
                        variant="flat"
                        size="lg"
                        maxLength={6}
                        classNames={{
                          input: "text-center text-2xl font-black tracking-[8px] placeholder:tracking-normal",
                          inputWrapper: "bg-zinc-100 border-2 border-zinc-200 focus-within:border-primary/50 transition-all h-20 rounded-2xl"
                        }}
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full">{errorMsg}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalBody>

            <ModalFooter className="px-8 pb-8 pt-0 flex flex-col gap-2">
              {step === 1 ? (
                <div className="flex flex-col w-full gap-2">
                  <Button
                    isDisabled={!confirmCheckbox}
                    isLoading={isInitiating}
                    onPress={handleInitiate}
                    color="danger"
                    className="w-full h-14 font-black rounded-2xl bg-rose-600 shadow-[0_8px_24px_rgba(225,29,72,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Hesabı Silmeyi Başlat
                  </Button>
                  <Button variant="light" className="font-bold text-zinc-500 h-12" onPress={onClose}>
                    Vazgeç
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col w-full gap-2">
                  <Button
                    isLoading={isDeleting}
                    onPress={handleConfirm}
                    color="danger"
                    className="w-full h-14 font-black rounded-2xl bg-zinc-900 text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    startContent={<ShieldAlert size={20} />}
                  >
                    HESABI KALICI OLARAK SİL
                  </Button>
                  <Button
                    variant="light"
                    className="font-bold text-zinc-400 h-10"
                    onPress={() => setStep(1)}
                  >
                    Geri Dön
                  </Button>
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
