import { notFound } from "next/navigation";
import { getStationById } from "@/services/stationService";
import { MeasurementsChart } from "@/components/MeasurementsChart";
import { StationViewTracker } from "@/components/monitoring/StationViewTracker";

export default async function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = await getStationById(id);

  if (!station) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <StationViewTracker stationId={station.id} stationName={station.name} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider">
              {station.type}
            </span>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              ID: {station.id}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">
            {station.name}
          </h1>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        <h2 className="text-xl font-semibold mb-8 text-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Поточні показники якості повітря
        </h2>

        {station.currentMeasurement ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricBox
              label="PM2.5"
              value={station.currentMeasurement.data.pm25}
              unit="µg/m³"
              isCritical={station.currentMeasurement.data.pm25 > 25}
            />
            <MetricBox
              label="PM10"
              value={station.currentMeasurement.data.pm10}
              unit="µg/m³"
              isCritical={station.currentMeasurement.data.pm10 > 50}
            />
            <MetricBox
              label="NO2"
              value={station.currentMeasurement.data.no2}
              unit="µg/m³"
              isCritical={station.currentMeasurement.data.no2 > 25}
            />
            <MetricBox
              label="CO2"
              value={station.currentMeasurement.data.co2}
              unit="ppm"
              isCritical={(station.currentMeasurement.data.co2 ?? 0) > 1000}
            />
          </div>
        ) : (
          <p className="text-slate-500 italic p-4 bg-slate-50/50 rounded-xl">
            Дані вимірювань тимчасово недоступні.
          </p>
        )}

        { }
        {station.history && station.history.length > 0 && (
          <MeasurementsChart history={station.history} />
        )}
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  unit,
  isCritical,
}: {
  label: string;
  value?: number;
  unit: string;
  isCritical: boolean;
}) {
  if (value === undefined) return null;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 ${isCritical ? "bg-rose-50/50 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]" : "bg-slate-50/50 border-slate-100 hover:shadow-md"}`}
    >
      <p className="text-sm font-semibold text-slate-500 mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <p
          className={`text-3xl font-black tracking-tight ${isCritical ? "text-rose-600" : "text-slate-900"}`}
        >
          {value.toFixed(1)}
        </p>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
