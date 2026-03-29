"use client";
import {
  Input,
  Textarea,
  Card,
  CardBody,
  Switch,
} from "@heroui/react";
import { SectionTitle, SaveBtn, cardStyle } from "./SettingsUI";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface IsletmeTabProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  saved: boolean;
  onSave: () => void;
}

export function IsletmeTab({
  register,
  errors,
  setValue,
  watch,
  saved,
  onSave,
}: IsletmeTabProps) {
  const showCategoriesFirst = watch("showCategoriesFirst");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card shadow="none" style={cardStyle}>
        <CardBody style={{ padding: 24 }}>
          <SectionTitle
            title="İşletme Bilgileri"
            sub="Müşterilere ve faturalarda görünecek bilgiler"
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Input
              {...register("name")}
              label="İşletme Adı"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message as string}
              variant="bordered"
              size="sm"
              autoComplete="off"
              color={errors.name ? "danger" : "primary"}
            />
            <Input
              {...register("phone")}
              label="Telefon"
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message as string}
              variant="bordered"
              size="sm"
              autoComplete="off"
              color={errors.phone ? "danger" : "default"}
              placeholder="05XXXXXXXXX"
            />
            <Input
              {...register("email")}
              label="E-posta"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message as string}
              variant="bordered"
              size="sm"
              type="email"
              autoComplete="off"
              color={errors.email ? "danger" : "default"}
            />
            <Input
              {...register("website")}
              label="Web Sitesi"
              isInvalid={!!errors.website}
              errorMessage={errors.website?.message as string}
              variant="bordered"
              size="sm"
              autoComplete="off"
              color={errors.website ? "danger" : "default"}
              placeholder="https://..."
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <Input
              {...register("address")}
              label="Adres"
              isInvalid={!!errors.address}
              errorMessage={errors.address?.message as string}
              variant="bordered"
              size="sm"
              autoComplete="off"
              color={errors.address ? "danger" : "default"}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <Textarea
              {...register("description")}
              label="İşletme Açıklaması"
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message as string}
              variant="bordered"
              size="sm"
              minRows={2}
              autoComplete="off"
              color={errors.description ? "danger" : "default"}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-800">Seçim Sırası</p>
              <p className="text-xs text-zinc-500 mt-1">Önce kategorileri göster, ardından kategoriye ait hizmetleri listele.</p>
            </div>
            <Switch
              isSelected={showCategoriesFirst}
              onValueChange={(v) => setValue("showCategoriesFirst", v)}
              color="primary"
              size="sm"
            />
          </div>
        </CardBody>
      </Card>
      <SaveBtn saved={saved} onSave={onSave} />
    </div>
  );
}
