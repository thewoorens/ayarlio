"use client";
import { Mail, CheckCircle2 } from "lucide-react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SectionTitle, cardStyle } from "../../settings/components/SettingsUI";
import { motion } from "framer-motion";

const emailSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin.").trim().toLowerCase(),
});

type EmailForm = z.infer<typeof emailSchema>;

interface EmailSectionProps {
  initialData: { email: string };
  isSaving: boolean;
  onUpdate: (data: EmailForm) => void;
}

export function EmailSection({ initialData, isSaving, onUpdate }: EmailSectionProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initialData.email }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card shadow="none" style={cardStyle} className="mt-6 border-zinc-200/60 shadow-sm relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-zinc-100 group-hover:scale-110 group-hover:text-primary/10 transition-all duration-300">
          <Mail size={120} strokeWidth={0.5} />
        </div>
        <CardBody className="p-8 relative z-10">
          <SectionTitle 
            title="E-posta Adresi" 
            sub="Giriş yaparken kullandığınız birincil e-posta adresiniz. Bu adres tüm bildirimler için kullanılır."
          />
          
          <form onSubmit={handleSubmit(onUpdate)} className="flex flex-col gap-5 mt-6 max-w-lg">
            <Input
              {...register("email")}
              label="E-posta Adresi"
              placeholder="email@example.com"
              variant="bordered"
              startContent={<Mail size={18} className="text-zinc-400" />}
              className="group"
              classNames={{
                inputWrapper: "bg-zinc-50/50 hover:bg-white border-zinc-200 group-hover:border-primary/40 transition-all duration-300 rounded-xl",
                label: "text-zinc-500 font-semibold"
              }}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <div className="flex justify-start">
              <Button 
                type="submit" 
                variant="flat" 
                color="primary" 
                isLoading={isSaving}
                isDisabled={!isDirty}
                className="font-bold h-11 px-8 rounded-xl bg-primary/10 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                startContent={!isSaving && <CheckCircle2 size={18} />}
              >
                E-posta Güncelle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}
