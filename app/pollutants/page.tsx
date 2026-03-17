import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Довідник забруднювачів | EcoMon",
};

export default function PollutantsPage() {
  const pollutants = [
    {
      id: "pm25",
      name: "PM2.5",
      description:
        "Дрібнодисперсні зважені частинки діаметром менше 2.5 мікрометрів.",
      sources: "Вихлопні гази, промислові викиди, лісові пожежі.",
    },
    {
      id: "pm10",
      name: "PM10",
      description: "Зважені частинки діаметром менше 10 мікрометрів.",
      sources: "Пил від доріг, будівництво, сільське господарство.",
    },
    {
      id: "no2",
      name: "Діоксид азоту (NO2)",
      description: "Токсичний газ червоно-бурого кольору з різким запахом.",
      sources: "Спалювання викопного палива, автомобільні двигуни.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Довідник типів забруднювачів
      </h1>
      <div className="space-y-6">
        {pollutants.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {item.name}
            </h2>
            <p className="text-slate-600 mb-4">{item.description}</p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <strong className="text-sm text-slate-900 block mb-1">
                Основні джерела:
              </strong>
              <span className="text-sm text-slate-600">{item.sources}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
