"use client";

import React, {useState} from "react";
import {Button, Input, Link, Alert} from "@heroui/react";
import {Eye, EyeOff} from "lucide-react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Parola zorunludur"),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface SignInFormProps {
  emailVerified?: boolean;
}

export default function SignInForm({emailVerified}: SignInFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ text: string, type: "success" | "danger" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  });

  const blockClipboard = (
    e: React.ClipboardEvent | React.DragEvent | React.MouseEvent,
  ) => e.preventDefault();
  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        let errorMsg = "Bilinmeyen bir hata oluştu.";
        switch (res.status) {
          case 400:
            errorMsg = "Lütfen alanları kontrol edin.";
            break;
          case 401:
            errorMsg = "E-posta veya parola yanlış.";
            break;
          case 409:
            errorMsg = "E-posta doğrulanmamış. Lütfen e-posta kutunuzu kontrol edin.";
            break;
          case 500:
            errorMsg = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
            break;
        }

        setAlertMessage({text: errorMsg, type: "danger"});
        return;
      }

      setAlertMessage({text: "Giriş başarılı, yönlendiriliyorsunuz...", type: "success"});

      const nextRoute = result.data?.user?.isSetup ? "/pano" : "/kurulum";
      setTimeout(() => {
        window.location.href = nextRoute;
      }, 800);

    } catch (err) {
      console.error(err);
      setAlertMessage({text: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.", type: "danger"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full md:p-8 p-1">
        {emailVerified && !alertMessage && (
          <Alert color="success" variant="flat" className="mt-6 mb-6">
            E-posta doğrulama başarılı. Giriş yapabilirsiniz.
          </Alert>
        )}
        {alertMessage && (
          <Alert color={alertMessage.type} variant="flat" className="mb-6 mt-6">
            {alertMessage.text}
          </Alert>
        )}
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* EMAIL */}
          <Input
            {...register("email")}
            autoComplete="new-email"
            isRequired
            label="E-Posta Adresiniz"
            labelPlacement="outside"
            placeholder="ahmet@gmail.com"
            variant="bordered"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          {/* PASSWORD */}
          <Input
            {...register("password")}
            autoComplete="new-password"
            isRequired
            label="Parolanız"
            labelPlacement="outside"
            placeholder="••••••••"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? <EyeOff/> : <Eye/>}
              </button>
            }
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            onCopy={blockClipboard}
            onCut={blockClipboard}
            onPaste={blockClipboard}
            onDrop={blockClipboard}
            onDragStart={blockClipboard}
            onContextMenu={blockClipboard}
          />

          <div className="flex justify-end -mt-2">
            <Link href="/sifremi-unuttum" size="sm" className="text-primary-600 font-medium">
              Şifremi Unuttum
            </Link>
          </div>

          {/* SUBMIT */}
          <Button
            color="primary"
            type="submit"
            size="lg"
            isLoading={isLoading}
            isDisabled={isLoading}
            className="text-lg font-semibold"
          >
            Giriş Yap
          </Button>
        </form>

        <p className="text-small text-center mt-6">
          <Link href="/kayit-ol" size="sm" className="text-primary-600">
            Henüz hesabınız yok mu? Hemen Başlayın
          </Link>
        </p>
      </div>
    </div>
  );
}
