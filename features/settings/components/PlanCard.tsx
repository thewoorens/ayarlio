import {Button} from "@heroui/react";
import { CircleArrowUp } from "lucide-react";

type Props = {
    plan: "standard" | "pro" | "enterprise";
    trialEndsAt?: string;
};

const planNames = {
    standard: "Standart",
    pro: "Pro",
    enterprise: "Enterprise",
};

const planColors = {
    standard: "#6B7280",
    pro: "#2563EB",
    enterprise: "#7C3AED",
};

export default function PlanCard({plan, trialEndsAt}: Props) {
    const remainingDays = trialEndsAt
        ? Math.max(
            0,
            Math.ceil(
                (new Date(trialEndsAt).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
        )
        : null;

    return (
        <div
            style={{
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                background: "#fff",
            }}
        >
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    <div style={{fontSize: 13, color: "#6B7280"}}>
                        Mevcut Plan
                    </div>

                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: planColors[plan],
                        }}
                    >
                        {planNames[plan]}
                    </div>

                    {remainingDays !== null && remainingDays > 0 && (
                        <div style={{fontSize: 12, color: "#F59E0B", marginTop: 4}}>
                            Deneme süresi: {remainingDays} gün kaldı
                        </div>
                    )}

                    {remainingDays === 0 && (
                        <div style={{fontSize: 12, color: "#EF4444", marginTop: 4}}>
                            Deneme süresi doldu
                        </div>
                    )}
                </div>

                {plan !== "enterprise" && (
                    <Button
                        className={"text-center my-auto font-bold"}
                        color={"primary"}
                        size={"lg"}
                        endContent={<CircleArrowUp />}
                    >Planınızı Yükseltin</Button>
                )}
            </div>
        </div>
    );
}