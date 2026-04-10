import { stations, measurements } from "@/data/mockData";
import type { Station, Measurement, StationWithAQI } from "@/types/environment";
import { calculatePollutionLevel } from "@/lib/pollution";

export type StationWithMeasurement = Station & {
  currentMeasurement?: Measurement;
  history: Measurement[];
};

export async function getTotalStationsCount(): Promise<number> {
  return stations.length;
}

export async function getStationsData(
  page = 1,
  limit = 10,
): Promise<Station[]> {
  const startIndex = (page - 1) * limit;
  return stations.slice(startIndex, startIndex + limit);
}

export async function getAllStations(): Promise<Station[]> {
  return stations;
}

export async function getStationById(
  id: string,
): Promise<StationWithMeasurement | null> {
  const station = stations.find((s) => s.id === id);
  if (!station) return null;

  const history = measurements.filter((m) => m.stationId === id);

  history.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const currentMeasurement = history.length > 0 ? history[0] : undefined;

  return { ...station, currentMeasurement, history };
}


export async function getStationsWithAQI(): Promise<StationWithAQI[]> {
  return stations.map((station) => {
    const latest = measurements
      .filter((m) => m.stationId === station.id)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )[0];

    const currentData = latest?.data ?? { pm25: 0, pm10: 0, no2: 0, co2: 0 };
    const pollutionLevel = calculatePollutionLevel(currentData);

    return { ...station, pollutionLevel, currentData };
  });
}

export async function getStationMeasurements(
  stationId: string,
  limit?: number,
): Promise<Measurement[]> {
  const history = measurements
    .filter((m) => m.stationId === stationId)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

  return limit ? history.slice(-limit) : history;
}

export async function getAllMeasurements(): Promise<Measurement[]> {
  return measurements;
}
