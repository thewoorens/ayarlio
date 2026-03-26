"use client";

import React, { useState } from "react";
import { Button, Input, Link, Alert } from "@heroui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                let errorMsg = result?.message || result?.error || "Şifre sıfırlama e-postası gönderilemedi.";
                if (result?.errors && typeof result.errors === 'object') {
                    const firstError = Object.values(result.errors).flat()[0];
                    if (typeof firstError === 'string') errorMsg = firstError;
                }
                setMessage({
                    text: errorMsg,
                    type: "danger",
                });
                return;
            }

            setMessage({
                text: result?.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
                type: "success",
            });
        } catch (error) {
            setMessage({
                text: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
                type: "danger",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full md:p-8 p-1">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold mb-2">Şifrenizi mi Unuttunuz?</h1>
                    <p className="text-slate-500 text-sm">
                        E-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
                    </p>
                </div>

                {message && (
                    <Alert color={message.type} variant="flat" className="mb-6">
                        {message.text}
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
                        autoComplete="email"
                        isRequired
                        label="E-Posta Adresiniz"
                        labelPlacement="outside"
                        placeholder="ornek@ayarlio.com"
                        variant="bordered"
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                        startContent={<Mail className="text-slate-400 w-5 h-5" />}
                    />

                    {/* SUBMIT */}
                    <Button
                        color="primary"
                        type="submit"
                        size="lg"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        className="text-lg font-semibold mt-2"
                    >
                        Sıfırlama Bağlantısı Gönder
                    </Button>
                </form>

                <p className="text-small text-center mt-6">
                    <Link href="/giris-yap" size="sm" className="text-primary-600">
                        Giriş ekranına dön
                    </Link>
                </p>
            </div>
        </div>
    );
}
