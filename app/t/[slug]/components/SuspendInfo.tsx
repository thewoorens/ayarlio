import { Button } from "@heroui/react";

export default function SuspendInfo({ tenantName, tenantPhone, tenantEmail }: { tenantName: any; tenantPhone: string; tenantEmail: string }) {

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl p-8 text-center">

                <img
                    src="https://ayarlio.com/ayarlio-logo.png"
                    alt="Ayarlio Logo"
                    className="mx-auto mb-6 h-24"
                />

                <h1 className="text-md md:text-2xl font-bold mb-3 text-gray-900">
                    "{tenantName}" kısa süreliğine askıya alındı
                </h1>

                <p className="text-gray-700 mb-6">
                    Merhaba, {tenantName} işletmesi şu anda askıya alınmış durumdadır.
                </p>

                {/* Alt bilgi */}
                <div className="mt-6 flex items-center gap-2 mx-auto justify-center">
                    <Button color="secondary" variant="flat" href={`tel:${tenantPhone}`}>
                        İşletme Telefon Numarası: {tenantPhone}
                    </Button>
                </div>

                <div className="mt-4 flex items-center gap-2 mx-auto justify-center">
                    <p className="text-sm text-gray-500">
                        Daha fazla bilgi için: <a href="https://ayarlio.com" className="text-sm text-blue-500 underline" target="_blank" rel="noopener noreferrer">ayarlio.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}