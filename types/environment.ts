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

export interface Station {
  id: string;
  name: string;
  coordinates: Coordinates;
  type: "urban" | "industrial" | "background";
}

export interface Measurement {
  id: string;
  stationId: string;
  timestamp: string;
  data: PollutantData;
}
