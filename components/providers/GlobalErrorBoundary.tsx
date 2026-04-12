"use client";

import { ErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import { trackEvent } from "@/lib/analytics";
import { ReactNode } from "react";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-rose-600"
          fill="none"
          viewBox="0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Не вдалося завантажити компонент</h3>
      <p className="text-sm text-slate-600 mb-6 max-w-sm">
        {error instanceof Error ? error.message : "Сталася непередбачувана помилка при рендерингу цієї частини інтерфейсу."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition shadow-sm"
      >
        Спробувати знову
      </button>
    </div>
  );
}

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
}

export function GlobalErrorBoundary({ children, componentName = "unknown" }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {

        console.error(`Error in component [${componentName}]:`, error, info);

        trackEvent("error_caught", {
          component: componentName,
          errorMessage: error instanceof Error ? error.message : String(error)
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
