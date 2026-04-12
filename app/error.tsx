"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {

    console.error("Next.js Application Error Caught:", error);
    trackEvent("error_caught", {
      component: "App_Error_Boundary",
      errorMessage: error.message,
      digest: error.digest
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center px-4">
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4 border-4 border-rose-50 shadow-sm">
        <span className="text-4xl text-rose-500">⚠</span>
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Щось пішло не так!</h2>
      <p className="text-slate-500 max-w-md mx-auto text-lg">
        Сталася помилка при завантаженні або обробці даних екологічного моніторингу. Наші інженери вже повідомлені.
      </p>


      <div className="bg-slate-100 rounded-lg p-4 mt-4 max-w-lg w-full text-left overflow-hidden border border-slate-200">
        <p className="text-xs font-mono text-slate-700 break-all">
          <span className="font-bold text-slate-900">Помилка: </span>
          {error.message || "Невідома помилка"}
        </p>
        {error.digest && (
          <p className="text-xs font-mono text-slate-500 mt-2">
            Digest: {error.digest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
        >
          Спробувати знову
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-white text-slate-700 border border-slate-300 font-semibold rounded-xl hover:bg-slate-50 transition"
        >
          На головну
        </button>
      </div>
    </div>
  );
}
