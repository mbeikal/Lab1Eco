"use client";

import { useMemo } from "react";
import type { PollutantData } from "@/types/environment";
import {
  POLLUTANT_META,
  CHART_COLORS,
  type PollutantKey,
  POLLUTANT_KEYS,
} from "@/lib/pollution";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PollutionStructureChartProps {
  data: PollutantData;
  stationName: string;
}

interface PieDataPoint {
  name: string;
  value: number;
  key: PollutantKey;
  unit: string;
  color: string;
}

function renderCustomLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (!percent || percent < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}


export function PollutionStructureChart({
  data,
  stationName,
}: PollutionStructureChartProps) {
  const pieData = useMemo<PieDataPoint[]>(() => {
    return POLLUTANT_KEYS.map((key) => ({
      name: POLLUTANT_META[key].label,
      value: data[key] ?? 0,
      key,
      unit: POLLUTANT_META[key].unit,
      color: CHART_COLORS[key],
    })).filter((d) => d.value > 0);
  }, [data]);

  if (pieData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-800">
          Структура забруднення
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{stationName}</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              animationDuration={600}
              animationBegin={0}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: "12px 16px",
                fontSize: "13px",
              }}

              formatter={((value: any, name: string) => {
                const entry = pieData.find((d) => d.name === name);
                return [`${value} ${entry?.unit ?? ""}`, name];
              }) as any}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
