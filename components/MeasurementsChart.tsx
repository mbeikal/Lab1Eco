"use client";

import { Measurement } from "@/types/environment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MeasurementsChart({ history }: { history: Measurement[] }) {
  const chartData = [...history].reverse().map((m) => ({
    time: new Date(m.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    PM25: m.data.pm25,
    PM10: m.data.pm10,
  }));

  return (
    <div className="h-72 w-full mt-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Історія показників (останні 24 години)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line
            type="monotone"
            dataKey="PM25"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="PM10"
            stroke="#f43f5e"
            strokeWidth={3}
            dot={false}
          />
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
