"use client";
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Copy, Check } from "lucide-react";
import { Input, Button, Card, CardBody, Divider, Tooltip } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SectionTitle, cardStyle } from "../../settings/components/SettingsUI";
import { motion } from "framer-motion";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifrenizi girin."),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalıdır."),
  confirmPassword: z.string().min(1, "Şifre onayını girin."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

interface SecuritySectionProps {
  isSaving: boolean;
  onUpdate: (data: PasswordForm) => void;
}

export function SecuritySection({ isSaving, onUpdate }: SecuritySectionProps) {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: PasswordForm) => {
    await onUpdate(data);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <Card shadow="none" style={cardStyle} className="border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="h-1 w-full" />
        <CardBody className="p-8">
          <SectionTitle
            title="Şifre Değiştir"
            sub="Hesabınızı güvende tutmak için periyodik olarak şifrenizi güncelleyin. Hesabınıza sadece siz erişebilirsiniz."
          />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-8 max-w-2xl">
            <div className="space-y-4">
              <Input
                {...register("currentPassword")}
                type="password"
                label="Mevcut Şifre"
                placeholder="••••••••"
                variant="bordered"
                startContent={<Lock size={18} className="text-zinc-400" />}
                className="group w-full"
                classNames={{
                  inputWrapper: "bg-zinc-50/50 hover:bg-white border-zinc-200 group-hover:border-primary/40 rounded-xl transition-all duration-300",
                  label: "text-zinc-500 font-semibold"
                }}
                isInvalid={!!errors.currentPassword}
                errorMessage={errors.currentPassword?.message}
              />

              <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1 opacity-50" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white px-3">Güvenli Şifre</span>
                <Divider className="flex-1 opacity-50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register("newPassword")}
                  type="password"
                  label="Yeni Şifre"
                  placeholder="••••••••"
                  variant="bordered"
                  className="group"
                  classNames={{
                    inputWrapper: "bg-zinc-50/50 hover:bg-white border-zinc-200 group-hover:border-primary/40 rounded-xl transition-all duration-300",
                    label: "text-zinc-500 font-semibold"
                  }}
                  isInvalid={!!errors.newPassword}
                  errorMessage={errors.newPassword?.message}
                />
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  label="Yeni Şifre (Yeniden)"
                  placeholder="••••••••"
                  variant="bordered"
                  className="group"
                  classNames={{
                    inputWrapper: "bg-zinc-50/50 hover:bg-white border-zinc-200 group-hover:border-primary/40 rounded-xl transition-all duration-300",
                    label: "text-zinc-500 font-semibold"
                  }}
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword?.message}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                color="primary"
                isLoading={isSaving}
                isDisabled={!isValid}
                startContent={!isSaving && <ShieldCheck size={18} />}
              >
                Şifreyi Güncelle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <PasswordGenerator />

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card shadow="none" className="bg-amber-50/50 border border-amber-100" style={{ borderRadius: 16 }}>
          <CardBody className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-amber-900">Güvenlik Önerisi</h3>
                <p className="text-sm text-amber-700/80 mt-1 leading-relaxed">
                  Güçlü bir şifre; en az 8 karakter uzunluğunda, büyük-küçük harf, rakam ve özel karakter (., !, *, vb.) içermelidir.
                  Lütfen şifrenizi kimseyle paylaşmayın.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

    </motion.div>
  );
}

function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
    setCopied(false);
  }, []);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card shadow="none" className="bg-blue-50/30 border border-blue-100/50" style={{ borderRadius: 16 }}>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500 shrink-0 border border-blue-100">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-blue-900">Şifre Oluşturucu</h3>
                <p className="text-xs text-blue-700/70 mt-0.5">Tek tıkla güvenli ve rastgele bir şifre oluşturun.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <div className="flex-1 md:w-48 h-12 bg-white border border-blue-100 rounded-xl px-4 flex items-center justify-between font-mono text-sm text-blue-900 overflow-hidden">
                {password ? (
                  <span className="truncate mr-2">{password}</span>
                ) : (
                  <span className="text-blue-300 italic">Şifre oluşturun...</span>
                )}
                {password && (
                  <Tooltip content={copied ? "Kopyalandı!" : "Kopyala"}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={copyToClipboard}
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </Button>
                  </Tooltip>
                )}
              </div>

              <Button
                color="primary"
                variant="flat"
                className="h-12 px-6 rounded-xl font-semibold bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                onPress={generatePassword}
                startContent={
                  <motion.div
                    animate={password ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <RefreshCw size={18} />
                  </motion.div>
                }
              >
                Oluştur
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
