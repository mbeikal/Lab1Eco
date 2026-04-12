"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 drop-shadow-sm">
        404
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-2 tracking-tight">
        Сторінку не знайдено
      </h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
        Можливо, сторінка була видалена, перейменована, або ви ввели неправильну адресу.
      </p>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/"
          className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
        >
          На головну
        </Link>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.history.back();
            }
          }}
          className="px-8 py-3 bg-white text-slate-700 border border-slate-300 font-semibold rounded-xl hover:bg-slate-50 transition"
        >
          Повернутися
        </button>
      </div>
    </div>
  );
}
