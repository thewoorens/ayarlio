"use client";
import { User, Phone, CheckCircle2 } from "lucide-react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SectionTitle, cardStyle } from "../../settings/components/SettingsUI";
import { motion } from "framer-motion";

const profileSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır.").trim(),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası girin."),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  initialData: { name: string; phone?: string };
  isSaving: boolean;
  onUpdate: (data: ProfileForm) => void;
}

export function ProfileSection({ initialData, isSaving, onUpdate }: ProfileSectionProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || ""
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card shadow="none" style={cardStyle} className="overflow-hidden border-zinc-200/60 shadow-sm">
        <div className="h-2 w-full" />
        <CardBody className="p-8">
          <SectionTitle
            title="Kişisel Bilgiler"
            sub="Hesabınızdaki adınız ve iletişim numaranız diğer kullanıcılara ve sistem raporlarına yansır."
          />

          <form onSubmit={handleSubmit(onUpdate)} className="flex flex-col gap-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                {...register("name")}
                label="Tam İsim"
                placeholder="Örn: Ahmet Yılmaz"
                variant="bordered"
                startContent={<User size={18} className="text-zinc-400" />}
                className="group"
                classNames={{
                  inputWrapper: "bg-zinc-50/50 hover:bg-white border-zinc-200 group-hover:border-primary/40 transition-all duration-300 rounded-xl",
                  label: "text-zinc-500 font-semibold"
                }}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
              <Input
                {...register("phone")}
                label="Telefon Numarası"
                placeholder="05XXXXXXXXX"
                variant="bordered"
                startContent={<Phone size={18} className="text-zinc-400" />}
                className="group"
                classNames={{
                  inputWrapper: "bg-zinc-50/50 hover:bg-white border-zinc-200 group-hover:border-primary/40 transition-all duration-300 rounded-xl",
                  label: "text-zinc-500 font-semibold"
                }}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                color="primary"
                isLoading={isSaving}
                isDisabled={!isDirty}
                startContent={!isSaving && <CheckCircle2 size={18} />}
              >
                Bilgileri Güncelle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}
