"use client";

import { useSettings } from "@/features/settings/hooks/useSettings";
import { Button, Spinner } from "@heroui/react";
import { CircleArrowUp, HelpCircle, ShieldCheck } from "lucide-react";

export default function SuspendGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data, isLoading } = useSettings();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="lg" label="Yükleniyor..." />
            </div>
        );
    }

    const pathName = new URLSearchParams(window.location.pathname);

    const isExpired =
        data?.trialEndsAt &&
        new Date(data.trialEndsAt) < new Date();

    if (isExpired && !pathName.has("yukselt")) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl p-8 text-center">

                    <img
                        src="/ayarlio-logo.png"
                        alt="Ayarlio Logo"
                        className="mx-auto mb-6 h-24"
                    />

                    <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                        Deneme Süreniz Sona Erdi
                    </h1>

                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Ayarlio’yu kullanmaya devam etmek için planınızı yükseltmeniz gerekiyor.
                        Hesabınız şu anda pasif durumda.
                    </p>

                    {/* Güven mesajı */}
                    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                        <ShieldCheck className="text-green-600 mt-1" size={64} />
                        <div>
                            <p className="text-sm font-semibold text-green-700">
                                Verileriniz Ayarlio ile güvende
                            </p>
                            <p className="text-sm text-green-600">
                                Tüm verileriniz saklanmaya devam ediyor. Planınızı yükselttiğinizde
                                kaldığınız yerden devam edebilirsiniz.
                            </p>
                        </div>

                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            className="font-semibold"
                            color="primary"
                            size="lg"
                            endContent={<CircleArrowUp size={18} />}
                            onClick={() => (window.location.href = "/yukselt")}
                        >
                            Planınızı Yükseltin
                        </Button>

                        <Button
                            className="font-semibold"
                            color="secondary"
                            size="lg"
                            variant="flat"
                            endContent={<HelpCircle size={18} />}
                            onClick={() => (window.location.href = "https://ayarlio.com/yardim-merkezi")}
                        >
                            Destek Al
                        </Button>
                    </div>

                    {/* Alt bilgi */}
                    <p className="text-xs text-gray-400 mt-6">
                        Sorularınız mı var? Destek ekibimiz size yardımcı olmaktan memnuniyet duyar.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}