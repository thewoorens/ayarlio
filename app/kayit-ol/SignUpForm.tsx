"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Input, Checkbox, Link, Alert } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "proton.me",
  "protonmail.com",
  "icloud.com",
  "yahoo.com",
];

const isAllowedEmailDomain = (email: string) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && ALLOWED_EMAIL_DOMAINS.includes(domain);
};

const formatTRPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  let formatted = "";

  if (digits.length > 0) formatted += "(" + digits.slice(0, 3);
  if (digits.length >= 3) formatted += ") ";
  if (digits.length >= 4) formatted += digits.slice(3, 6);
  if (digits.length >= 6) formatted += " ";
  if (digits.length >= 7) formatted += digits.slice(6, 8);
  if (digits.length >= 8) formatted += " ";
  if (digits.length >= 9) formatted += digits.slice(8, 10);

  return { formatted, raw: digits };
};

const registerSchema = z
  .object({
    name: z.string().min(2).max(50),
    surname: z.string().min(2).max(50),

    email: z
      .string()
      .email("Geçerli bir e-posta adresi giriniz")
      .refine(isAllowedEmailDomain, {
        message: "Bu e-posta sağlayıcısı desteklenmiyor",
      }),

    phone: z
      .string()
      .regex(/^5\d{9}$/, "Geçerli bir Türkiye telefon numarası giriniz"),

    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir",
      }),

    confirmPassword: z.string(),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Kullanım şartlarını kabul etmelisiniz",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Şifreler uyuşmuyor",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function SignUpForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("danger");
  const [isLoading, setIsLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const showAlert = useCallback(
    (message: string, color: "success" | "danger") => {
      setAlertMessage(message);
      setAlertColor(color);

      setTimeout(() => setAlertMessage(null), 4000);
    },
    [],
  );

  const blockClipboard = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
  }, []);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

      setPhoneDisplay(formatTRPhone(digits).formatted);

      setValue("phone", digits, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const pos = input.selectionStart || 0;

    if (e.key === "Backspace" && pos > 0) {
      const value = input.value;

      if (/\D/.test(value[pos - 1])) {
        e.preventDefault();

        let newPos = pos - 1;

        while (newPos > 0 && /\D/.test(value[newPos - 1])) {
          newPos--;
        }

        input.setSelectionRange(newPos, newPos);
      }
    }
  };

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const { confirmPassword, name, surname, ...rest } = data;
      const safePayload = {
        ...rest,
        name: `${name} ${surname}`,
        passwordConfirm: confirmPassword,
      };

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          signal: abortRef.current.signal,
          body: JSON.stringify(safePayload),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          let errorMsg = "İşlem başarısız";
          switch (response.status) {
            case 400:
              errorMsg = result?.message || "Lütfen tüm alanları doldurun.";
              break;
            case 409:
              errorMsg = result?.message || "Bu e-posta zaten kullanılıyor.";
              break;
            case 500:
              errorMsg = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
              break;
          }

          // Zod validation hataları varsa onları da göster
          if (result?.errors && typeof result.errors === "object") {
            const firstError = Object.values(result.errors).flat()[0];
            if (typeof firstError === "string") errorMsg = firstError;
          }

          showAlert(errorMsg, "danger");
          setIsLoading(false);
          return;
        }

        showAlert(
          "Kayıt başarılı! Lütfen e-postanızı kontrol edin.",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/giris-yap";
        }, 1500);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setIsLoading(false);
          return;
        }
        showAlert("Bir hata oluştu", "danger");
      } finally {
        setIsLoading(false);
      }
    },
    [showAlert],
  );

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full md:p-8 p-1">
        {alertMessage && (
          <Alert color={alertColor} variant="flat" isClosable className="mb-4">
            {alertMessage}
          </Alert>
        )}

        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="md:flex gap-4">
            <Input
              {...register("name")}
              isRequired
              label="Adınız"
              labelPlacement="outside"
              placeholder="Ahmet"
              variant="bordered"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <Input
              {...register("surname")}
              isRequired
              label="Soyadınız"
              labelPlacement="outside"
              placeholder="Yılmaz"
              variant="bordered"
              className="md:pt-0 pt-3"
              isInvalid={!!errors.surname}
              errorMessage={errors.surname?.message}
            />
          </div>

          <Input
            {...register("email")}
            isRequired
            label="E-Posta Adresiniz"
            labelPlacement="outside"
            placeholder="ahmet@ayarlio.com"
            variant="bordered"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            isRequired
            label="Telefon Numaranız"
            labelPlacement="outside"
            placeholder="(541) 123 45 67"
            variant="bordered"
            value={phoneDisplay}
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneKeyDown}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
          />

          <Input
            {...register("password")}
            isRequired
            label="Parolanız"
            labelPlacement="outside"
            placeholder="••••••••"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={() => setIsVisible((v) => !v)}>
                {isVisible ? <EyeOff /> : <Eye />}
              </button>
            }
            onCopy={blockClipboard}
            onPaste={blockClipboard}
            onCut={blockClipboard}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Input
            {...register("confirmPassword")}
            isRequired
            label="Parolanızı Onaylayın"
            labelPlacement="outside"
            placeholder="••••••••"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button
                type="button"
                onClick={() => setIsConfirmVisible((v) => !v)}
              >
                {isConfirmVisible ? <EyeOff /> : <Eye />}
              </button>
            }
            onCopy={blockClipboard}
            onPaste={blockClipboard}
            onCut={blockClipboard}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />

          <div className="text-sm mt-2">
            <Checkbox {...register("acceptTerms")} />
            <Link href="https://ayarlio.com/kullanim-kosullari" target="_blank">Kullanım Koşulları</Link>
            &nbsp;ve&nbsp;
            <Link href="https://ayarlio.com/gizlilik-sozlesmesi" target="_blank">Gizlilik Sözleşmesi</Link>
            &nbsp;kabul ediyorum
          </div>

          {errors.acceptTerms && (
            <p className="text-danger text-sm">{errors.acceptTerms.message}</p>
          )}

          <Button
            color="primary"
            type="submit"
            size="lg"
            className="text-lg font-semibold"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Hemen Başla
          </Button>
        </form>

        <p className="text-small text-center mt-6">
          <Link href="/giris-yap">Zaten hesabınız var mı? Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
}
