"use client";
import { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import { IsletmeTab } from "./components/BusinessTab";
import { useSettings } from "./hooks/useSettings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const businessSchema = z.object({
  name: z
    .string()
    .min(2, "İşletme adı en az 2 karakter olmalıdır.")
    .max(100, "İşletme adı 100 karakterden uzun olamaz.")
    .trim(),
  phone: z
    .string()
    .regex(/^(\+90|0)?5\d{9}$/, "Lütfen geçerli bir Türkiye telefon numarası girin (örn: 05XXXXXXXXX).")
    .trim(),
  email: z
    .string()
    .email("Lütfen geçerli bir e-posta adresi girin.")
    .trim()
    .toLowerCase(),
  website: z
    .string()
    .trim()
    .url("Lütfen geçerli bir web sitesi URL'si girin (örn: https://ayarlio.com).")
    .or(z.literal(""))
    .optional(),
  address: z.string().trim().optional(),
  description: z.string().trim().optional(),
  showCategoriesFirst: z.boolean(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function SettingsView() {
  const { data, isLoading } = useSettings();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      description: "",
      showCategoriesFirst: false,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        phone: data.phone || "",
        email: data.settings?.email || "",
        website: data.settings?.website || "",
        address: data.settings?.address || "",
        description: data.settings?.description || "",
        showCategoriesFirst: Boolean(data.settings?.showCategoriesFirst),
      });
    }
  }, [data, reset]);

  const onSave = async (formData: BusinessFormData) => {
    if (!data) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          settings: {
            ...data.settings,
            email: formData.email,
            address: formData.address,
            description: formData.description,
            website: formData.website,
            showCategoriesFirst: formData.showCategoriesFirst,
          },
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        console.error("Ayarlar güncellenirken hata:", resData.message);
        alert(resData.message || "Ayarlar güncellenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Settings PUT error:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" label="Ayarlar yükleniyor..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Ayarlar
        </h1>
        {isSaving && <Spinner size="sm" color="primary" />}
      </div>

      <IsletmeTab
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        saved={saved}
        onSave={handleSubmit(onSave)}
      />
    </div>
  );
}
