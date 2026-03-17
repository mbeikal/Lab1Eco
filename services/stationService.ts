import { stations, measurements } from "@/data/mockData";
import { Station, Measurement } from "@/types/environment";

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
