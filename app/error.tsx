// app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Щось пішло не так!</h2>
      <p className="text-slate-500">
        Помилка завантаження даних екологічного моніторингу.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Спробувати знову
      </button>
    </div>
  );
}
