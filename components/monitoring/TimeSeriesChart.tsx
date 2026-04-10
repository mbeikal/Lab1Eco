"use client";

import { useState, useMemo } from "react";
import type { Measurement } from "@/types/environment";
import {
  POLLUTANT_META,
  CHART_COLORS,
  type PollutantKey,
  POLLUTANT_KEYS,
} from "@/lib/pollution";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TimeSeriesChartProps {
  history: Measurement[];

  maxPoints?: number;
}

interface ChartDataPoint {
  time: string;
  fullTime: string;
  [key: string]: string | number;
}

export function TimeSeriesChart({ history, maxPoints = 48 }: TimeSeriesChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Set<PollutantKey>>(
    () => new Set(POLLUTANT_KEYS),
  );

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const sorted = [...history]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-maxPoints);

    return sorted.map((m) => ({
      time: new Date(m.timestamp).toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      }),
      fullTime: new Date(m.timestamp).toLocaleString("uk-UA"),
      pm25: m.data.pm25,
      pm10: m.data.pm10,
      no2: m.data.no2,
      co2: m.data.co2 ?? 0,
    }));
  }, [history, maxPoints]);

  const toggleSeries = (key: PollutantKey) => {
    setVisibleSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {

        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">
          Динаміка показників
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {POLLUTANT_KEYS.map((key) => {
            const meta = POLLUTANT_META[key];
            const isVisible = visibleSeries.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleSeries(key)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all duration-200 ${isVisible
                    ? "border-transparent text-white shadow-sm"
                    : "border-slate-200 text-slate-400 bg-white hover:border-slate-300"
                  }`}
                style={
                  isVisible
                    ? { backgroundColor: CHART_COLORS[key] }
                    : undefined
                }
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: "12px 16px",
                fontSize: "13px",
              }}
              labelFormatter={(label) => `🕐 ${label}`}

              formatter={((value: any, name: string) => {
                const key = name as PollutantKey;
                const meta = POLLUTANT_META[key];
                return meta ? [`${value} ${meta.unit}`, meta.label] : [value, name];
              }) as any}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              onClick={(e) => {
                if (e.dataKey) toggleSeries(e.dataKey as PollutantKey);
              }}
            />
            {POLLUTANT_KEYS.map((key) =>
              visibleSeries.has(key) ? (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={CHART_COLORS[key]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={600}
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
