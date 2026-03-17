import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про проєкт | EcoMon",
  description: "Інформація про систему екологічного моніторингу",
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl prose prose-slate mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Про проєкт</h1>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          EcoMon — це сучасна платформа для моніторингу якості повітря та
          екологічних показників у режимі реального часу.
        </p>
        <p>
          Наша мета — надати громадськості, дослідникам та органам місцевого
          самоврядування доступ до достовірних даних про стан навколишнього
          середовища. Система агрегує дані з мережі сертифікованих
          моніторингових станцій.
        </p>
        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
          Технологічний стек
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Next.js (App Router)</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Server-Side Rendering (SSR) & Static Site Generation (SSG)</li>
        </ul>
      </div>
    </article>
  );
}
