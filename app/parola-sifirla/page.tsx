"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Loader2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | form | success | error
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

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
                router.replace("/parola-sifirla");
              }
            }, 0);
          }
          return newCount >= 0 ? newCount : 0;
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
      setMessage("Geçersiz şifre sıfırlama linki.");
      startRedirect();
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          let errorMsg = data?.error || data?.message || "Geçersiz veya süresi dolmuş link.";
          if (data?.errors && typeof data.errors === 'object') {
            const firstError = Object.values(data.errors).flat()[0];
            if (typeof firstError === 'string') errorMsg = firstError;
          }
          throw new Error(errorMsg);
        }

        setStatus("form");
        setMessage("Yeni şifrenizi belirleyin");
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

    validateToken();
  }, [token, startRedirect]);

  const validatePassword = useCallback((pass: string) => {
    if (!pass || pass.length < 8) {
      return "Şifre en az 8 karakter olmalıdır";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Şifre en az bir büyük harf içermelidir";
    }
    if (!/[0-9]/.test(pass)) {
      return "Şifre en az bir rakam içermelidir";
    }
    return "";
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    setFormError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!password || !confirmPassword) {
      setFormError("Lütfen şifrenizi girin ve onaylayınız.");
      return;
    }
    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      setFormError(validationError);
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Şifreler eşleşmiyor.");
      return;
    }

    setStatus("loading");
    setMessage("Şifreniz güncelleniyor...");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMsg = data?.error || data?.message || "Şifre güncellenirken bir hata oluştu.";
        if (data?.errors && typeof data.errors === 'object') {
          const firstError = Object.values(data.errors).flat()[0];
          if (typeof firstError === 'string') errorMsg = firstError;
        }
        throw new Error(errorMsg);
      }

      setStatus("success");
      setMessage(data.message || "Şifreniz başarıyla güncellendi!");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 ">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-lg p-8 ">
        <div className="text-center mb-8 ">
          <div className="flex justify-center mb-4 ">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-600 " />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-600 " />
            )}
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 mb-1 cursor-pointer">
            {status === "loading" && "Doğrulanıyor"}
            {status === "form" && "Yeni Şifre Belirle"}
            {status === "success" && "Şifre Güncellendi"}
            {status === "error" && "İşlem Başarısız"}
          </h1>

          <p className="text-slate-600 text-sm cursor-pointer">
            {message || "Lütfen bekleyin..."}
          </p>
        </div>

        {status === "form" && (
          <form onSubmit={handleSubmit} className="space-y-5 ">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 ">
                Yeni Şifre
              </label>
              <div className="relative ">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 " />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="En az 8 karakter"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300
                           text-slate-900 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Yeni Şifre (Tekrar)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Şifreyi tekrar girin"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300
                           text-slate-900 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {password && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p className="font-medium text-slate-700 mb-2">
                  Şifre gereksinimleri
                </p>
                <ul className="space-y-1 text-slate-600">
                  <li>• En az 6 karakter</li>
                  <li>• En az 1 büyük harf</li>
                  <li>• En az 1 rakam</li>
                </ul>
              </div>
            )}

            {(passwordError || formError) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {passwordError || formError}
              </div>
            )}

            <button
              type="submit"
              disabled={!password || !confirmPassword || !!passwordError}
              className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white
                       hover:bg-blue-700 transition
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Şifreyi Güncelle
            </button>
          </form>
        )}

        {status !== "loading" && status !== "form" && (
          <>
            <p className="text-sm text-slate-500 text-center mt-4">
              {countdown} saniye içinde yönlendirileceksiniz.
            </p>

            <button
              onClick={() =>
                router.push(
                  status === "success" ? "/giris-yap" : "/parola-sifirla",
                )
              }
              className="mt-4 w-full rounded-xl bg-slate-900 text-white py-3 font-medium hover:bg-slate-800"
            >
              {status === "success" ? "Giriş Yap" : "Tekrar Dene"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
