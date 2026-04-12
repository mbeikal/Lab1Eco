"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Fatal Global Error:", error);
    trackEvent("error_caught", { 
      component: "Global_Error_Boundary", 
      errorMessage: error.message 
    });
  }, [error]);

  return (
    <html lang="uk">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-rose-100">
          <div className="w-24 h-24 bg-rose-100/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🚨</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Фатальна помилка</h1>
          <p className="text-slate-500 mb-8">
            Наш додаток зупинив роботу через критичну помилку. Спробуйте оновити сторінку або зачекайте кілька хвилин.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Перезапустити додаток
          </button>
        </div>
      </body>
    </html>
  );
}
