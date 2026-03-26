"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { useMemo } from "react";

const visitData = [
  { month: "Oca", visits: 2 },
  { month: "Şub", visits: 4 },
  { month: "Mar", visits: 3 },
  { month: "Nis", visits: 6 },
  { month: "May", visits: 5 },
  { month: "Haz", visits: 8 },
];

interface Props {
  visitHistory: any[],
  serviceDistribution: any[]
}

export function CustomerCharts({ visitHistory, serviceDistribution }: Props) {

  // Format visitHistory to match the chart requirements
  // We need to count visits per month.
  const chartVisitData = useMemo(() => {
    if (!visitHistory || visitHistory.length === 0) return [];

    const monthCounts: Record<string, number> = {};
    const trMonths = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

    visitHistory.forEach((visit) => {
      if (visit.serviceDetails) {
        const d = new Date(visit.serviceDetails);
        const monthName = trMonths[d.getMonth()];
        monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
      }
    });

    // Convert to array format for Recharts
    return Object.keys(monthCounts).map(month => ({
      month,
      visits: monthCounts[month]
    }));
  }, [visitHistory]);


  return (
    <div className="flex flex-col gap-10">

      {/* Ziyaret geçmişi */}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Ziyaret Geçmişi
        </h3>

        <div className="h-[220px] w-full">
          <ResponsiveContainer>
            <LineChart data={chartVisitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hizmet dağılımı */}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Hizmet Dağılımı
        </h3>

        <div className="h-[220px] w-full">
          <ResponsiveContainer>
            <BarChart data={serviceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
