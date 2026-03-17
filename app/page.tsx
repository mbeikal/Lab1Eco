// app/page.tsx
import { StationCard } from "@/components/StationCard";
import { getStationsData } from "@/services/stationService";
import { measurements } from "@/data/mockData";

export default async function HomePage() {
  const stations = await getStationsData(1, 10);

  const latestMeasurements = stations.map((s) =>
    measurements.find((m) => m.stationId === s.id),
  );
  const validPm25 = latestMeasurements
    .map((m) => m?.data.pm25)
    .filter((val): val is number => val !== undefined);
  const avgPm25 = validPm25.length
    ? (validPm25.reduce((a, b) => a + b, 0) / validPm25.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400 tracking-tight">
          Екологічний моніторинг
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
          Система контролю якості повітря нового покоління. Відстежуйте
          показники з сертифікованих станцій у реальному часі.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Мережева статистика
        </h2>
        <div className="flex gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
            <p className="text-sm text-slate-500">Середній PM2.5 (зараз)</p>
            <p className="text-3xl font-black text-emerald-600">
              {avgPm25} <span className="text-sm text-slate-400">µg/m³</span>
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
            <p className="text-sm text-slate-500">Активних станцій</p>
            <p className="text-3xl font-black text-slate-800">
              {stations.length}
            </p>
          </div>
        </div>
      </div>

      {stations.length === 0 ? (
        <div className="p-6 bg-amber-50/50 border border-amber-200 text-amber-800 rounded-2xl backdrop-blur-sm">
          Дані про станції наразі відсутні. Спробуйте пізніше.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
}
