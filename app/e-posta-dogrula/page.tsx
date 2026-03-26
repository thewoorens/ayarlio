"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const redirectExecutedRef = useRef(false);

  const startRedirect = useCallback(
    (type?: string) => {
      if (redirectExecutedRef.current) return;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          const newCount = prev - 1;
          if (newCount <= 0 && !redirectExecutedRef.current) {
            redirectExecutedRef.current = true;
            setTimeout(() => {
              if (type === "success") {
                router.replace("/giris-yap");
              } else {
                router.replace("/kayit-ol");
              }
            }, 0);
          }
          return newCount;
        });
      }, 1000);
    },
    [router],
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Geçersiz doğrulama linki.");
      startRedirect();
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          let errorMsg = data?.error || data?.message || "Doğrulama başarısız.";
          if (data?.errors && typeof data.errors === 'object') {
            const firstError = Object.values(data.errors).flat()[0];
            if (typeof firstError === 'string') errorMsg = firstError;
          }
          throw new Error(errorMsg);
        }

        setStatus("success");
        setMessage(data.message || "Email başarıyla doğrulandı!");
        startRedirect("success");
      } catch (err) {
        if (err instanceof Error) {
          setStatus("error");
          setMessage(err.message);
        } else {
          setStatus("error");
          setMessage("Beklenmeyen bir hata oluştu.");
        }
        startRedirect();
      }
    };

    verifyEmail();
  }, [token, startRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          {status === "loading" && (
            <Loader2 className="h-14 w-14 text-blue-500 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle className="h-14 w-14 text-green-500" />
          )}
          {status === "error" && <XCircle className="h-14 w-14 text-red-500" />}
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {status === "loading" && "Email Doğrulanıyor"}
          {status === "success" && "Doğrulama Başarılı"}
          {status === "error" && "Doğrulama Başarısız"}
        </h1>

        <p className="text-gray-600 mb-6">
          {message || "İşleminiz devam ediyor..."}
        </p>

        {status !== "loading" && (
          <p className="text-sm text-gray-500">
            {countdown} saniye içinde {status === "success" ? "giriş" : "ana"}{" "}
            sayfaya yönlendirileceksiniz.
          </p>
        )}

        {status !== "loading" && (
          <button
            onClick={() => {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              redirectExecutedRef.current = true;
              router.push(status === "success" ? "/giris-yap" : "/");
            }}
            className="mt-6 w-full rounded-xl bg-slate-900 text-white py-3 font-medium hover:bg-slate-800 transition cursor-pointer"
          >
            {status === "success" ? "Giriş Yap" : "Ana Sayfaya Git"}
          </button>
        )}
      </div>
    </div>
  );
}
