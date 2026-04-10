"use client";

import { useMemo } from "react";
import type { StationWithAQI } from "@/types/environment";
import type { Measurement } from "@/types/environment";
import { getPollutionColor, CHART_COLORS } from "@/lib/pollution";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StationComparisonChartProps {
  stations: StationWithAQI[];
  measurements: Measurement[];
  selectedStationId: string | null;
}

interface ComparisonDataPoint {
  name: string;
  shortName: string;
  stationId: string;
  pm25: number;
  pm10: number;
  no2: number;
  isSelected: boolean;
  pollutionColor: string;
}

export function StationComparisonChart({
  stations,
  measurements,
  selectedStationId,
}: StationComparisonChartProps) {
  const chartData = useMemo<ComparisonDataPoint[]>(() => {
    return stations.map((station) => {
      const stationMeasurements = measurements.filter(
        (m) => m.stationId === station.id,
      );

      const avgPm25 =
        stationMeasurements.length > 0
          ? Number(
            (
              stationMeasurements.reduce((sum, m) => sum + m.data.pm25, 0) /
              stationMeasurements.length
            ).toFixed(1),
          )
          : 0;

      const avgPm10 =
        stationMeasurements.length > 0
          ? Number(
            (
              stationMeasurements.reduce((sum, m) => sum + m.data.pm10, 0) /
              stationMeasurements.length
            ).toFixed(1),
          )
          : 0;

      const avgNo2 =
        stationMeasurements.length > 0
          ? Number(
            (
              stationMeasurements.reduce((sum, m) => sum + m.data.no2, 0) /
              stationMeasurements.length
            ).toFixed(1),
          )
          : 0;

      const shortName = station.name.split("—")[0]?.trim() ?? station.name;

      return {
        name: station.name,
        shortName,
        stationId: station.id,
        pm25: avgPm25,
        pm10: avgPm10,
        no2: avgNo2,
        isSelected: station.id === selectedStationId,
        pollutionColor: getPollutionColor(station.pollutionLevel),
      };
    });
  }, [stations, measurements, selectedStationId]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-800">
        Порівняння станцій (середній PM2.5)
      </h3>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            barCategoryGap="20%"
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="shortName"
              stroke="#94a3b8"
              fontSize={11}
              tickMargin={8}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              label={{
                value: "µg/m³",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#94a3b8" },
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: "12px 16px",
                fontSize: "13px",
              }}

              formatter={((value: any) => [`${value} µg/m³`, "PM2.5"]) as any}
              labelFormatter={(label) => `📍 ${label}`}
            />
            <Bar dataKey="pm25" radius={[6, 6, 0, 0]} animationDuration={600}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.stationId}
                  fill={
                    entry.isSelected
                      ? CHART_COLORS.pm25
                      : entry.isSelected === false && selectedStationId
                        ? "#cbd5e1"
                        : entry.pollutionColor
                  }
                  opacity={
                    selectedStationId && !entry.isSelected ? 0.5 : 1
                  }
                  stroke={entry.isSelected ? CHART_COLORS.pm25 : "none"}
                  strokeWidth={entry.isSelected ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
