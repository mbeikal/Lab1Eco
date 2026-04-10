import type { Station, Measurement } from "@/types/environment";


export const stations: Station[] = [
  {
    id: "st-001",
    name: "Київ — Хрещатик",
    coordinates: { lat: 50.4501, lng: 30.5234 },
    type: "urban",
  },
  {
    id: "st-002",
    name: "Київ — Промзона Дарниця",
    coordinates: { lat: 50.4268, lng: 30.6598 },
    type: "industrial",
  },
  {
    id: "st-003",
    name: "Київ — Голосіївський парк",
    coordinates: { lat: 50.3964, lng: 30.5167 },
    type: "background",
  },
  {
    id: "st-004",
    name: "Львів — Площа Ринок",
    coordinates: { lat: 49.8417, lng: 24.0316 },
    type: "urban",
  },
  {
    id: "st-005",
    name: "Одеса — Приморський бульвар",
    coordinates: { lat: 46.4882, lng: 30.7402 },
    type: "urban",
  },
  {
    id: "st-006",
    name: "Харків — Держпром",
    coordinates: { lat: 49.9935, lng: 36.2304 },
    type: "urban",
  },
  {
    id: "st-007",
    name: "Дніпро — Промзона",
    coordinates: { lat: 48.4647, lng: 35.0462 },
    type: "industrial",
  },
  {
    id: "st-008",
    name: "Запоріжжя — Металургійний район",
    coordinates: { lat: 47.8388, lng: 35.1396 },
    type: "industrial",
  },
  {
    id: "st-009",
    name: "Вінниця — Центральний парк",
    coordinates: { lat: 49.2331, lng: 28.4682 },
    type: "background",
  },
  {
    id: "st-010",
    name: "Полтава — Івана Мазепи",
    coordinates: { lat: 49.5883, lng: 34.5514 },
    type: "urban",
  },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const BASE_PROFILES: Record<Station["type"], { pm25: number; pm10: number; no2: number; co2: number }> = {
  urban: { pm25: 18, pm10: 35, no2: 20, co2: 430 },
  industrial: { pm25: 38, pm10: 70, no2: 32, co2: 470 },
  background: { pm25: 8, pm10: 15, no2: 8, co2: 410 },
};

function generateStationMeasurements(station: Station, hoursBack: number): Measurement[] {
  const profile = BASE_PROFILES[station.type];
  const data: Measurement[] = [];
  const baseTs = Date.UTC(2026, 3, 10, 12, 0, 0);

  for (let i = 0; i < hoursBack; i++) {
    const seed = hashCode(`${station.id}-${i}`);
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    const r3 = seededRandom(seed + 2);
    const r4 = seededRandom(seed + 3);

    const vary = (base: number, rand: number) =>
      Number((base * (0.6 + rand * 0.8)).toFixed(1));

    const timestamp = new Date(baseTs - i * 60 * 60 * 1000).toISOString();

    data.push({
      id: `m-${station.id}-${i}`,
      stationId: station.id,
      timestamp,
      data: {
        pm25: vary(profile.pm25, r1),
        pm10: vary(profile.pm10, r2),
        no2: vary(profile.no2, r3),
        co2: vary(profile.co2, r4),
      },
    });
  }

  return data;
}

const HOURS_OF_HISTORY = 168;

const globalForMocks = globalThis as unknown as {
  _measurements: Measurement[] | undefined;
};

function generateAllMeasurements(): Measurement[] {
  if (globalForMocks._measurements) return globalForMocks._measurements;

  const all: Measurement[] = [];
  for (const station of stations) {
    all.push(...generateStationMeasurements(station, HOURS_OF_HISTORY));
  }

  globalForMocks._measurements = all;
  return all;
}

export const measurements = generateAllMeasurements();
