"use client";

import { Card, CardBody, Chip, Tooltip } from "@heroui/react";
import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
  subtitle?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  accent,
  subtitle = "/ aylık",
}: StatsCardProps) {
  return (
    <Card
      shadow="none"
      isPressable
      disableRipple
      className="relative overflow-hidden border border-[#e8eaf0] bg-white transition-transform duration-200 hover:-translate-y-0.5"
      style={{ borderRadius: 16 }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: accent,
          opacity: 0.06,
          filter: "blur(28px)",
          transform: "translate(30%,-30%)",
        }}
      />

      <CardBody className="p-5 gap-0">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 38,
              height: 38,
              background: accent + "18",
              color: accent,
            }}
          >
            {icon}
          </div>
        </div>

        <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>

        <div className="flex items-end gap-1">
          <p
            className="text-2xl font-bold text-gray-900"
            style={{ letterSpacing: "-0.03em" }}
          >
            {value}
          </p>
          <p className="text-xs text-gray-400 mb-0.5">{subtitle}</p>
        </div>
      </CardBody>
    </Card>
  );
}
