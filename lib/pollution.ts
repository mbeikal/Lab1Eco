import type { PollutantData, PollutionLevel } from "@/types/environment";


const PM25_THRESHOLDS: readonly { max: number; level: PollutionLevel }[] = [
  { max: 12, level: "good" },
  { max: 35, level: "moderate" },
  { max: 55, level: "unhealthy" },
  { max: Infinity, level: "hazardous" },
] as const;

export function calculatePollutionLevel(data: PollutantData): PollutionLevel {
  const pm25 = data.pm25;
  const tier = PM25_THRESHOLDS.find((t) => pm25 <= t.max);
  return tier?.level ?? "hazardous";
}

const POLLUTION_COLORS: Record<PollutionLevel, string> = {
  good: "#22c55e",
  moderate: "#f59e0b",
  unhealthy: "#ef4444",
  hazardous: "#7c3aed",
};

export function getPollutionColor(level: PollutionLevel): string {
  return POLLUTION_COLORS[level];
}

const POLLUTION_LABELS: Record<PollutionLevel, string> = {
  good: "Добре",
  moderate: "Помірно",
  unhealthy: "Шкідливо",
  hazardous: "Небезпечно",
};

export function getPollutionLabel(level: PollutionLevel): string {
  return POLLUTION_LABELS[level];
}

const POLLUTION_BADGE_CLASSES: Record<PollutionLevel, string> = {
  good: "bg-green-100 text-green-800 border-green-200",
  moderate: "bg-amber-100 text-amber-800 border-amber-200",
  unhealthy: "bg-red-100 text-red-800 border-red-200",
  hazardous: "bg-purple-100 text-purple-800 border-purple-200",
};

export function getPollutionBadgeClass(level: PollutionLevel): string {
  return POLLUTION_BADGE_CLASSES[level];
}

export const POLLUTANT_META = {
  pm25: { label: "PM2.5", unit: "µg/m³", criticalThreshold: 25 },
  pm10: { label: "PM10", unit: "µg/m³", criticalThreshold: 50 },
  no2: { label: "NO₂", unit: "µg/m³", criticalThreshold: 25 },
  co2: { label: "CO₂", unit: "ppm", criticalThreshold: 1000 },
} as const;

export type PollutantKey = keyof typeof POLLUTANT_META;

export const POLLUTANT_KEYS = Object.keys(POLLUTANT_META) as PollutantKey[];

export const CHART_COLORS: Record<PollutantKey, string> = {
  pm25: "#10b981",
  pm10: "#f43f5e",
  no2: "#3b82f6",
  co2: "#8b5cf6",
};
