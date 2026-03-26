"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFoundRedirect() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown === 0) {
            router.replace("https://ayarlio.com");
            return;
        }

        const timeout = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [countdown, router]);

    return (
        <p className="mt-6 text-sm text-gray-500 text-center">
            <span className="font-medium text-black">{countdown}</span>{" "}
            saniye içinde ana sayfaya yönlendiriliyorsunuz…
        </p>
    );
}