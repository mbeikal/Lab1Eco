export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  co2?: number;
}

export type StationType = "urban" | "industrial" | "background";

export type PollutionLevel = "good" | "moderate" | "unhealthy" | "hazardous";

export interface Station {
  id: string;
  name: string;
  coordinates: Coordinates;
  type: StationType;
}

export interface StationWithAQI extends Station {
  pollutionLevel: PollutionLevel;
  currentData: PollutantData;
}

export interface Measurement {
  id: string;
  stationId: string;
  timestamp: string;
  data: PollutantData;
}
