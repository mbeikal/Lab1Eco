"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { StationWithAQI, StationType } from "@/types/environment";
import { getPollutionColor, getPollutionLabel, POLLUTANT_META } from "@/lib/pollution";


const UKRAINE_CENTER: L.LatLngTuple = [48.5, 31.5];
const DEFAULT_ZOOM = 6;

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const MARKER_SIZE_DEFAULT = 14;
const MARKER_SIZE_ACTIVE = 20;


function createMarkerIcon(
  color: string,
  size: number,
  isActive: boolean,
): L.DivIcon {
  const pulseRing = isActive
    ? `<span class="marker-pulse" style="border-color:${color}"></span>`
    : "";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-dot" style="
        width:${size}px;
        height:${size}px;
        background:${color};
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        transition:all 0.3s ease;
      ">
        ${pulseRing}
      </div>
    `,
    iconSize: [size + 6, size + 6],
    iconAnchor: [(size + 6) / 2, (size + 6) / 2],
    popupAnchor: [0, -(size / 2 + 8)],
  });
}

function buildPopupHTML(station: StationWithAQI): string {
  const levelColor = getPollutionColor(station.pollutionLevel);
  const levelLabel = getPollutionLabel(station.pollutionLevel);
  const d = station.currentData;

  return `
    <div class="map-popup">
      <h3 class="map-popup__title">${station.name}</h3>
      <span class="map-popup__badge" style="background:${levelColor}20;color:${levelColor};border:1px solid ${levelColor}40;">
        ${levelLabel}
      </span>
      <div class="map-popup__grid">
        <div class="map-popup__metric">
          <span class="map-popup__metric-label">${POLLUTANT_META.pm25.label}</span>
          <span class="map-popup__metric-value">${d.pm25} ${POLLUTANT_META.pm25.unit}</span>
        </div>
        <div class="map-popup__metric">
          <span class="map-popup__metric-label">${POLLUTANT_META.pm10.label}</span>
          <span class="map-popup__metric-value">${d.pm10} ${POLLUTANT_META.pm10.unit}</span>
        </div>
        <div class="map-popup__metric">
          <span class="map-popup__metric-label">${POLLUTANT_META.no2.label}</span>
          <span class="map-popup__metric-value">${d.no2} ${POLLUTANT_META.no2.unit}</span>
        </div>
        <div class="map-popup__metric">
          <span class="map-popup__metric-label">${POLLUTANT_META.co2.label}</span>
          <span class="map-popup__metric-value">${d.co2 ?? "—"} ${POLLUTANT_META.co2.unit}</span>
        </div>
      </div>
    </div>
  `;
}


interface MonitoringMapProps {
  stations: StationWithAQI[];
  selectedStationId: string | null;
  filterType: StationType | "all";
  onStationSelect: (stationId: string) => void;
}


export default function MonitoringMap({
  stations,
  selectedStationId,
  filterType,
  onStationSelect,
}: MonitoringMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const filteredStations =
    filterType === "all"
      ? stations
      : stations.filter((s) => s.type === filterType);


  const onSelectRef = useRef(onStationSelect);
  onSelectRef.current = onStationSelect;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: UKRAINE_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    filteredStations.forEach((station) => {
      const isActive = station.id === selectedStationId;
      const color = getPollutionColor(station.pollutionLevel);
      const size = isActive ? MARKER_SIZE_ACTIVE : MARKER_SIZE_DEFAULT;
      const icon = createMarkerIcon(color, size, isActive);

      const marker = L.marker([station.coordinates.lat, station.coordinates.lng], {
        icon,
        zIndexOffset: isActive ? 1000 : 0,
      })
        .addTo(map)
        .bindPopup(buildPopupHTML(station), {
          className: "map-popup-container",
          maxWidth: 280,
        });

      marker.on("click", () => {
        onSelectRef.current(station.id);
      });

      if (isActive) {
        marker.openPopup();
      }

      markersRef.current.set(station.id, marker);
    });
  }, [filteredStations, selectedStationId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStationId) return;

    const station = stations.find((s) => s.id === selectedStationId);
    if (station) {
      map.flyTo([station.coordinates.lat, station.coordinates.lng], 8, {
        duration: 1,
      });
    }
  }, [selectedStationId, stations]);

  const handleResetView = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(UKRAINE_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  }, []);

  useEffect(() => {
    if (!selectedStationId) {
      handleResetView();
    }
  }, [selectedStationId, handleResetView]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" id="monitoring-map" />

      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200/50 text-xs font-semibold text-slate-600">
        {filteredStations.length} станцій
      </div>
    </div>
  );
}
