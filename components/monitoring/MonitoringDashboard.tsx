"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import type { StationWithAQI, Measurement, StationType } from "@/types/environment";
import {
  getPollutionColor,
  getPollutionLabel,
  getPollutionBadgeClass,
} from "@/lib/pollution";
import { GlobalErrorBoundary } from "@/components/providers/GlobalErrorBoundary";

const TimeSeriesChart = dynamic(
  () => import("./TimeSeriesChart").then((mod) => mod.TimeSeriesChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] bg-slate-50/50 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">Завантаження графіка...</span>
      </div>
    ),
  }
);

const StationComparisonChart = dynamic(
  () => import("./StationComparisonChart").then((mod) => mod.StationComparisonChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] bg-slate-50/50 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">Завантаження порівняння...</span>
      </div>
    ),
  }
);

const PollutionStructureChart = dynamic(
  () => import("./PollutionStructureChart").then((mod) => mod.PollutionStructureChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] bg-slate-50/50 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">Завантаження структури...</span>
      </div>
    ),
  }
);



const MonitoringMap = dynamic(() => import("./MonitoringMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
      <span className="text-slate-400 text-sm font-medium">
        Завантаження карти…
      </span>
    </div>
  ),
});


const STATION_TYPE_FILTERS: { value: StationType | "all"; label: string }[] = [
  { value: "all", label: "Усі станції" },
  { value: "urban", label: "Міські" },
  { value: "industrial", label: "Промислові" },
  { value: "background", label: "Фонові" },
];


interface MonitoringDashboardProps {
  stations: StationWithAQI[];
  measurements: Measurement[];
}


export function MonitoringDashboard({
  stations,
  measurements,
}: MonitoringDashboardProps) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<StationType | "all">("all");


  const selectedStation = useMemo(
    () => stations.find((s) => s.id === selectedStationId) ?? null,
    [stations, selectedStationId],
  );

  const selectedStationHistory = useMemo(() => {
    if (!selectedStationId) return [];
    return measurements
      .filter((m) => m.stationId === selectedStationId)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }, [measurements, selectedStationId]);


  const handleStationSelect = useCallback(
    (stationId: string) => {
      setSelectedStationId((prev) => (prev === stationId ? null : stationId));
    },
    [],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedStationId(null);
  }, []);

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="flex gap-1.5 flex-wrap">
          {STATION_TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${filterType === filter.value
                ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {selectedStation && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getPollutionBadgeClass(selectedStation.pollutionLevel)}`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{
                  backgroundColor: getPollutionColor(selectedStation.pollutionLevel),
                }}
              />
              {selectedStation.name} — {getPollutionLabel(selectedStation.pollutionLevel)}
            </div>
            <button
              onClick={handleClearSelection}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Скинути вибір"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>


      <div className="h-[400px] lg:h-[500px]">
        <MonitoringMap
          stations={stations}
          selectedStationId={selectedStationId}
          filterType={filterType}
          onStationSelect={handleStationSelect}
        />
      </div>


      {selectedStation ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: getPollutionColor(selectedStation.pollutionLevel),
              }}
            />
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {selectedStation.name}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedStation.coordinates.lat.toFixed(4)},{" "}
                {selectedStation.coordinates.lng.toFixed(4)} · Тип:{" "}
                {selectedStation.type}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="lg:col-span-2 bg-white/60 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <GlobalErrorBoundary componentName="TimeSeriesChart">
                <TimeSeriesChart history={selectedStationHistory} />
              </GlobalErrorBoundary>
            </div>

            <div className="bg-white/60 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <GlobalErrorBoundary componentName="StationComparisonChart">
                <StationComparisonChart
                  stations={stations}
                  measurements={measurements}
                  selectedStationId={selectedStationId}
                />
              </GlobalErrorBoundary>
            </div>

            <div className="bg-white/60 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <GlobalErrorBoundary componentName="PollutionStructureChart">
                <PollutionStructureChart
                  data={selectedStation.currentData}
                  stationName={selectedStation.name}
                />
              </GlobalErrorBoundary>
            </div>
          </div>
        </div>
      ) : (

        <div className="bg-white/40 backdrop-blur-sm border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            Оберіть станцію на карті
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Клікніть на маркер моніторингової станції, щоб переглянути детальні
            графіки та аналітику забруднення.
          </p>
        </div>
      )}
    </div>
  );
}
