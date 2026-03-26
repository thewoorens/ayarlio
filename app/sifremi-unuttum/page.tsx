import React from "react";
import Image from "next/image";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen w-full bg-background justify-between select-none">
            <div className="mx-auto w-full max-w-md">
                <a href="https://ayarlio.com">
                    <Image
                        src="/ayarlio-logo.png"
                        width={200}
                        height={100}
                        alt="Ayarlio Logo"
                        className="mx-auto mt-5"
                        priority
                    />
                </a>
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
