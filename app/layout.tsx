// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { TransitionProvider } from "@/components/providers/TransitionProvider"; // <-- Додаємо імпорт
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Eco Monitoring App",
  description: "System for monitoring ecological data and air quality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="h-full bg-slate-50">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-slate-100`}
      >
        <Navigation />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </main>
      </body>
    </html>
  );
}