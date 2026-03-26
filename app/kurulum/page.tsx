"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Building2, Phone, Briefcase, Loader2, ArrowRight} from "lucide-react";
import {Alert, Button} from "@heroui/react";

const tenantSetupSchema = z.object({
  tenantName: z
    .string()
    .min(2, "Firma adı en az 2 karakter olmalıdır")
    .max(100, "Firma adı en fazla 100 karakter olabilir"),
  industry: z.string().min(2, "Sektör alanı zorunludur"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
});

type TenantSetupInput = z.infer<typeof tenantSetupSchema>;

export default function SetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<TenantSetupInput>({
    resolver: zodResolver(tenantSetupSchema),
    mode: "onTouched",
  });

  const showAlert = (text: string, type: "success" | "danger") => {
    setAlert({text, type});
    setTimeout(() => setAlert(null), 4000);
  };

  const onSubmit = async (data: TenantSetupInput) => {
    setIsLoading(true);
    setAlert(null);

    try {
      const response = await fetch("/api/tenant/setup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMsg = result?.message || "Kurulum başarısız oldu";

        switch (response.status) {
          case 400:
            errorMsg = result?.message || "Form verisi hatalı veya kurulum zaten yapılmış.";
            break;
          case 401:
            errorMsg = "Giriş yapmanız gerekiyor.";
            break;
          case 403:
            errorMsg = "E-posta adresiniz doğrulanmamış.";
            break;
          case 404:
            errorMsg = "Kullanıcı bulunamadı.";
            break;
          case 500:
            errorMsg = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
            break;
        }

        if (result?.errors && typeof result.errors === "object") {
          const firstError = Object.values(result.errors).flat()[0];
          if (typeof firstError === "string") errorMsg = firstError;
        }

        showAlert(errorMsg, "danger");
        return;
      }

      showAlert("İşletmeniz başarıyla oluşturuldu! Yönlendiriliyorsunuz...", "success");
      setTimeout(() => router.push("/pano"), 1500);
    } catch (err) {
      showAlert("Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">İşletmenizi Kurun</h1>
          <p className="text-slate-500 text-lg">
            Ayarlio'yu kullanmaya başlamak için şirket bilgilerinizi girin.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg">
          {alert && (
            <Alert color={alert.type} variant="flat" className="mb-6">
              {alert.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Firma Adı</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400"/>
                </div>
                <input
                  type="text"
                  placeholder="Ayarlio A.Ş."
                  {...register("tenantName")}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition bg-slate-50
                    ${errors.tenantName ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}
                    focus:outline-none focus:ring-4 focus:bg-white text-slate-900`}
                />
              </div>
              {errors.tenantName && (
                <p className="mt-2 text-sm text-red-500 flex items-center">{errors.tenantName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sektör / Endüstri</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400"/>
                </div>
                <input
                  type="text"
                  placeholder="Yazılım, Danışmanlık vb."
                  {...register("industry")}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition bg-slate-50
                    ${errors.industry ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}
                    focus:outline-none focus:ring-4 focus:bg-white text-slate-900`}
                />
              </div>
              {errors.industry && (
                <p className="mt-2 text-sm text-red-500 flex items-center">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">İşletme Telefonu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400"/>
                </div>
                <input
                  type="tel"
                  placeholder="850 123 45 67"
                  {...register("phone")}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition bg-slate-50
                    ${errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}
                    focus:outline-none focus:ring-4 focus:bg-white text-slate-900`}
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-500 flex items-center">{errors.phone.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full flex items-center justify-center space-x-2 rounded-2xl"
              color="primary"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin"/>
                  Kurulum Yapılıyor...
                </>
              ) : (
                <>
                  Kurulumu Tamamla
                  <ArrowRight className="h-5 w-5"/>
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          *Bu bilgiler müşterileriniz tarafından görüntülenecektir.
        </p>
      </div>
    </div>
  );
}
