import { Station, Measurement } from "@/types/environment";

export const stations: Station[] = [
  {
    id: "st-001",
    name: "Центральна площа",
    coordinates: { lat: 50.4501, lng: 30.5234 },
    type: "urban",
  },
  {
    id: "st-002",
    name: "Промислова зона",
    coordinates: { lat: 50.46, lng: 30.6 },
    type: "industrial",
  },
  {
    id: "st-003",
    name: "Лісопарк",
    coordinates: { lat: 50.47, lng: 30.58 },
    type: "background",
  },
  {
    id: "st-004",
    name: "Автомагістраль",
    coordinates: { lat: 50.43, lng: 30.51 },
    type: "urban",
  },
  {
    id: "st-005",
    name: "Житловий масив",
    coordinates: { lat: 50.4, lng: 30.65 },
    type: "urban",
  },
];

const globalForMocks = globalThis as unknown as {
  _measurements: Measurement[];
};

function generateMeasurements(): Measurement[] {
  if (globalForMocks._measurements) return globalForMocks._measurements;

  const data: Measurement[] = [];
  const now = new Date();

  stations.forEach((station) => {
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(
        now.getTime() - i * 60 * 60 * 1000,
      ).toISOString();
      data.push({
        id: `m-${station.id}-${i}`,
        stationId: station.id,
        timestamp,
        data: {
          pm25: Number((Math.random() * 50).toFixed(1)),
          pm10: Number((Math.random() * 100).toFixed(1)),
          no2: Number((Math.random() * 40).toFixed(1)),
          co2: Number((400 + Math.random() * 100).toFixed(1)),
        },
      });
    }
  });

  globalForMocks._measurements = data;
  return data;
}

export const measurements = generateMeasurements();
