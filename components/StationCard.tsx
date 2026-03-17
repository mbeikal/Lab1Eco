import Link from "next/link";
import { Station } from "@/types/environment";

export function StationCard({ station }: { station: Station }) {
  return (
    <div className="group relative bg-white/60 backdrop-blur-lg border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
            {station.type}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
          {station.name}
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-8">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {station.coordinates.lat.toFixed(3)},{" "}
            {station.coordinates.lng.toFixed(3)}
          </span>
        </div>
      </div>

      <Link
        href={`/stations/${station.id}`}
        className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-300 group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
      >
        Детальніше
      </Link>
    </div>
  );
}
