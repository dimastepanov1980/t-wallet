import React from 'react';

const services = [
  { name: 'Топливо', percent: 7, icon: '⛽️' },
  { name: 'Путешествия', percent: 10, icon: '✈️' },
  { name: 'Супермаркеты', percent: 15, icon: '🛒' },
  { name: 'Все сервисы', percent: null, icon: '🔲' },
];

const supermarkets = [
  {
    id: 1,
    logo: '🟢',
    percent: 15,
    time: '08:00 – 09:00',
    name: 'ВВ',
    products: [
      { name: 'Бананы', price: '200,2 ₽', img: '🍌' },
      { name: 'Молоко 3,2%, 1 л', price: '87 ₽', img: '🥛' },
      { name: 'Яйцо куриное', price: '144 ₽', img: '🥚' },
    ],
  },
  {
    id: 2,
    logo: '🔵',
    percent: 15,
    time: '11:55 – 13:55',
    name: 'ВкусВилл',
    products: [
      { name: 'Бананы', price: '200,2 ₽', img: '🍌' },
      { name: 'Молоко 3,2%, 1 л', price: '87 ₽', img: '🥛' },
      { name: 'Яйцо куриное', price: '144 ₽', img: '🥚' },
    ],
  },
];

export const CityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="flex items-center justify-between px-4 mb-2 mt-2">
        <div className="text-3xl font-bold">Москва <span className="text-lg">▼</span></div>
        <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2">
          <span role="img" aria-label="orders">📦</span> Заказы
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow flex items-center px-4 py-4 mb-4 mx-4 gap-4 overflow-x-auto">
        {services.map(s => (
          <div key={s.name} className="flex flex-col items-center min-w-[70px]">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-1">{s.icon}</div>
              {s.percent && <div className="absolute -top-2 -left-2 bg-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full">{s.percent}%</div>}
            </div>
            <div className="text-xs text-gray-700 mt-1">{s.name}</div>
          </div>
        ))}
      </div>
      <div className="px-4">
        <div className="text-xs text-gray-400 font-bold mb-1 mt-4">СУПЕРМАРКЕТЫ</div>
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <div className="font-bold text-lg mb-2">Доставка из магазинов</div>
          <div className="flex gap-4 mb-2">
            {supermarkets.map(m => (
              <div key={m.id} className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-2xl text-white">{m.logo}</div>
                  <div className="absolute -top-2 left-7 bg-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full">{m.percent}%</div>
                </div>
                <div className="text-xs text-gray-700 mt-1">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {supermarkets[0].products.map((p, idx) => (
              <div key={idx} className="min-w-[100px] bg-gray-50 rounded-xl p-2 flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center text-3xl mb-2">{p.img}</div>
                <div className="text-sm font-semibold">{p.price}</div>
                <div className="text-xs text-gray-500">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4">
        <div className="text-xs text-gray-400 font-bold mb-1 mt-4">ТОПЛИВО</div>
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <div className="font-bold text-lg mb-2">Заправка с онлайн-оплатой</div>
          {/* Здесь можно добавить аналогичные карточки */}
        </div>
      </div>
    </div>
  );
}; 