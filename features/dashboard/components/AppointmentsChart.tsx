"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { Button, ButtonGroup } from "@heroui/react";
import ChartTooltip from "./ChartTooltip";

type ChartItem = {
  day: string;
  value: number;
};

type Props = {
  charts: {
    weekly: ChartItem[];
    monthly: ChartItem[];
  };
};

export default function AppointmentsChart({ charts }: Props) {
  const [chartMode, setChartMode] = useState<"weekly" | "monthly">("weekly");

  const barData = chartMode === "weekly" ? charts.weekly : charts.monthly;

  const maxValue = useMemo(() => {
    if (!barData.length) return 0;
    return Math.max(...barData.map((d) => d.value));
  }, [barData]);

  return (
    <div
      className="xl:col-span-2 xl:grid-cols-3 gap-4 bg-white rounded-xl"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
    >
      <div className="xl:col-span-2 p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[15px] font-bold text-gray-800">
              {chartMode === "weekly"
                ? "Haftalık Randevu Dağılımı"
                : "Aylık Randevu Dağılımı"}
            </h2>

            <p className="text-[12px] mt-0.5 text-gray-400">
              {chartMode === "weekly" ? "Son 7 gün" : "Son 12 ay"}
            </p>
          </div>

          <ButtonGroup size="sm" className="shadow-2xl hidden sm:block">
            <Button
              onPress={() => setChartMode("weekly")}
              className={
                chartMode === "weekly"
                  ? "bg-white text-blue-400 font-semibold  border-1 border-gray-200"
                  : "bg-gray-100 border-1 border-gray-200 text-gray-400 font-semibold"
              }
            >
              Haftalık
            </Button>

            <Button
              onPress={() => setChartMode("monthly")}
              className={
                chartMode === "monthly"
                  ? "bg-white text-blue-400 font-semibold  border-1 border-gray-200"
                  : "bg-gray-100 border-1 border-gray-200 text-gray-400 font-semibold"
              }
            >
              Aylık
            </Button>
          </ButtonGroup>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#f0f2f7" />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              tickCount={4}
            />

            <Tooltip
              cursor={{ fill: "#f8fafc", radius: 6 }}
              content={<ChartTooltip maxVal={maxValue} mode={chartMode} />}
            />

            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {barData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.value === maxValue ? "#3b82f6" : "#e8eaf0"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
