"use client";

import { useState } from "react";
import { Button, Card, CardBody, Switch } from "@heroui/react";
import { Check, XIcon } from "lucide-react";
import { PLAN_CONFIG } from "@/lib/plan/planConfig";
import PaymentForm from "./PaymentForm";

const plans = [
    { key: "standard", name: "Standard", monthly: 499, yearly: 4788, highlight: false },
    { key: "pro", name: "Profesyonel", monthly: 799, yearly: 7668, highlight: true },
    { key: "enterprise", name: "Kurumsal", monthly: 999, yearly: 9588, highlight: false },
];

export default function PlanList() {
    const [yearly, setYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{
        name: string;
        pricing: number | null;
    } | null>(null);

    if (selectedPlan) {
        return (
            <PaymentForm
                planName={selectedPlan.name}
                yearly={yearly}
                pricing={selectedPlan.pricing}
            />
        );
    }

    return (
        <div>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <span className={!yearly ? "font-semibold" : "text-gray-500"}>Aylık</span>
                <Switch isSelected={yearly} onValueChange={setYearly} />
                <span className={yearly ? "font-semibold" : "text-gray-500"}>
                    Yıllık (%20 indirim)
                </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const config = PLAN_CONFIG[plan.key as keyof typeof PLAN_CONFIG];

                    const price =
                        plan.monthly === null
                            ? "İletişime geç"
                            : yearly
                                ? `₺${plan.yearly} / yıl`
                                : plan.monthly === 0
                                    ? "Ücretsiz"
                                    : `₺${plan.monthly} / ay`;

                    return (
                        <Card
                            key={plan.key}
                            className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-2xl ${plan.highlight ? "border-primary scale-105" : "border-gray-300"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
                                    En Popüler
                                </div>
                            )}

                            <CardBody className="p-0 flex flex-col py-12">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {plan.name}
                                    </h2>
                                    <p className="text-2xl font-bold mt-2">{price}</p>
                                </div>

                                <ul className="space-y-3 text-sm text-gray-600 flex-1">
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-green-400" />
                                        {config.maxStaff} Personel
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-green-400" />
                                        {config.maxBookingsPerMonth.toLocaleString()} Randevu
                                    </li>
                                    <li className="flex items-center gap-2">
                                        {config.analytics ? <Check size={16} className="text-green-400" /> : <XIcon size={16} className="text-red-400" />}
                                        Analitik
                                    </li>
                                    <li className="flex items-center gap-2">
                                        {config.smsReminder ? <Check size={16} className="text-green-400" /> : <XIcon size={16} className="text-red-400" />}
                                        SMS
                                    </li>
                                    <li className="flex items-center gap-2">
                                        {config.whatsapp ? <Check size={16} className="text-green-400" /> : <XIcon size={16} className="text-red-400" />}
                                        WhatsApp
                                    </li>
                                    <li className="flex items-center gap-2">
                                        {config.visitorPay ? <Check size={16} className="text-green-400" /> : <XIcon size={16} className="text-red-400" />}
                                        Ödeme
                                    </li>
                                </ul>

                                <Button
                                    color={plan.highlight ? "primary" : "default"}
                                    size="lg"
                                    className="mt-6 font-semibold"
                                    onPress={() =>
                                        setSelectedPlan({
                                            name: plan.name,
                                            pricing: yearly ? plan.yearly : plan.monthly,
                                        })
                                    }
                                >
                                    Seç
                                </Button>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}