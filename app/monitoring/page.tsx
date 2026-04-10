import type { Metadata } from "next";
import { MonitoringDashboard } from "@/components/monitoring/MonitoringDashboard";
import { getStationsWithAQI, getAllMeasurements } from "@/services/stationService";

export const metadata: Metadata = {
  title: "Моніторинг | EcoMon",
  description:
    "Інтерактивна карта моніторингових станцій та графіки якості повітря в Україні",
};

export default async function MonitoringPage() {
  const [stations, measurements] = await Promise.all([
    getStationsWithAQI(),
    getAllMeasurements(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400 tracking-tight">
          Інтерактивний моніторинг
        </h1>
        <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
          Карта моніторингових станцій з візуалізацією даних про якість повітря.
          Оберіть станцію для перегляду детальної аналітики.
        </p>
      </div>

      <MonitoringDashboard stations={stations} measurements={measurements} />
    </div>
  );
}
