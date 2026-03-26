import { TrendingUp } from "lucide-react";

type Props = {
  active?: boolean;
  payload?: any[];
  label?: string;
  maxVal: number;
  mode: "weekly" | "monthly";
};

export default function ChartTooltip({
  active,
  payload,
  label,
  maxVal,
  mode,
}: Props) {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0].value;

  const isPeak = maxVal > 0 && value === maxVal;

  const peakText = mode === "weekly" ? "En yoğun gün" : "En yoğun ay";

  return (
    <div
      className="bg-white border rounded-lg px-3 py-2"
      style={{
        borderColor: "#e8eaf0",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>

      {isPeak && (
        <p className="text-[10px] text-blue-500 mb-0.5 flex items-center gap-2">{peakText}<TrendingUp size={16}/></p>
      )}

      <p className="text-[14px] font-bold text-gray-800">{value} randevu</p>
    </div>
  );
}
