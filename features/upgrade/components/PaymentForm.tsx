"use client"

import { Button, Card, CardBody, Input } from "@heroui/react";
import { ShieldCheck, TurkishLira } from "lucide-react";

export default function PaymentForm({ planName, yearly, pricing }: { planName: string; yearly: boolean, pricing: any; }) {
    return (
        <div className="max-w-xl mx-auto">
            <Card className="p-6 rounded-2xl shadow-xl">
                <CardBody className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">Ödeme Bilgileri</h2>

                    <Input label="Kart Üzerindeki İsim" placeholder="Ad Soyad" />
                    <Input label="Kart Numarası" placeholder="1234 5678 9012 3456" />

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Son Kullanma" placeholder="MM/YY" />
                        <Input label="CVC" placeholder="123" />
                    </div>

                    <Button color="primary" size="lg" className="mt-4">
                        Ödemeyi Tamamla ({planName}/{yearly ? "Yıllık" : "Aylık"} - {pricing}₺)
                    </Button>

                    <div className="flex mx-auto gap-3 text-gray-500 text-sm">
                        <ShieldCheck size={18} /> 256-Bit PayTR Güvenli Ödeme Sistemi
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
