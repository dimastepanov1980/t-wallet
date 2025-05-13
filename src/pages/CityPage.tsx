import React from 'react';

const services = [
  { name: 'Супермаркеты', percent: 7, icon: (
    <img
      src="/logos/Basket.png"
      className="w-16 h-16 bg-[#edf8f2] p-4"
    />
  )},
  { name: 'Топливо', percent: 10, icon: (
    <img
      src="/logos/Gasoline.png"
      className="w-16 h-16 bg-[#f2f6ff] p-4"
    />
  )},
  { name: 'Афиша', percent: 20, icon: (
    <img
      src="/logos/Theatr.png"
      className="w-16 h-16 bg-[#f9eef2] p-4"
    />
  )},
  { name: 'Путешествия', percent: 10, icon: (
    <img
      src="/logos/Plain.png"
      className="w-16 h-16 bg-[#eef9fb] p-4"
    />
  )},
  { name: 'Купить аввто', percent: null, icon: (
    <img
      src="/logos/car.png"
      className="w-16 h-16 bg-[#edf8f2] p-4"
    />
  )},
  { name: 'Шопинг', percent: 10, icon: (
    <img
      src="/logos/Bag.png"
      className="w-16 h-16 bg-[#f4f2ff] p-4"
    />
  )},
  { name: 'T-Shop', percent: null, icon: (
    <img
      src="/logos/tShop.png"
      className="w-16 h-16 bg-[#f2f6f9] p-4"
    />
  )},
  { name: 'Все сервисы', percent: null, icon: (
    <img
      src="/logos/more.png"
      className="w-16 h-16 bg-[#f7f7f7] p-4"
    />
  )},
  
];

const supermarkets = [
  {
    id: 1,
    logo: (
      <img
        src="/logos/As.png" 
        className="w-16 h-16"
      />
    ),
    percent: 15,
    time: '08:00 – 09:00',
    name: 'ВВ',
    products: [
      { name: 'Бананы, 1кг', price: '200₽', img: (
        <img
          src="/logos/banana.webp" 
          
        />
      ) },
      { name: 'Молоко 3,2%, 1 л', price: '87 ₽', img: (
        <img
          src="/logos/milk.webp" 
          
        />
      ) },
      { name: 'Яйцо куриное', price: '154 ₽', img: (
        <img
          src="/logos/Egg.webp" 
          className="w-full h-full object-contain"
        />
      ) },
      { name: 'Айран', price: '90 ₽', img: (
        <img
          src="/logos/airan.webp" 
               
        />
      ) },
    ],
  },
  {
    id: 2,
    logo: (
      <img
        src="/logos/OK.png" 
        className="w-16 h-16"
      />
    ),
    percent: 15,
    time: '11:55 – 13:55',
    name: 'ВкусВилл',
    products: [

    ],
  },
  {
    id: 3,
    logo: (
      <img
      src="/logos/BB.png" 
      className="w-16 h-16"
    />
  ),
  percent: 15,
  time: '120 МИН.',
  name: 'ВкусВилл',
  products: [
  
  ],
},
];

const hotels = [
      { name: 'Гостиница Украина', price: 'от 12 000₽/сутки', img: (
        <img
          src="/logos/h1.jpg" 
          
        />
      ) },
      { name: 'Гостиница Мариот', price: 'от 22 000₽/сутки', img: (
        <img
          src="/logos/h2.jpg" 
          
        />
      ) },
      { name: 'Гостиница Four Seasons', price: 'от 44 000₽/сутки', img: (
        <img
          src="/logos/h3.jpg" 
          className="w-full h-full object-contain"
        />
      ) },
      { name: 'Гостиница Москва', price: 'от 15 000₽/сутки', img: (
        <img
          src="/logos/h4.jpg" 
               
        />
      ) },
    ]

export const CityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="flex items-center justify-between px-4 mb-2 mt-2">
        <div className="text-3xl font-bold">Москва <span className="text-lg">▼</span></div>
        <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2">
          <span role="img" aria-label="orders">📦</span> Заказы
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow grid grid-cols-4 sm:grid-cols-5 gap-x-4 gap-y-4 px-4 py-4 mb-4 mx-4">
  {services.map(s => (
    <div key={s.name} className="flex flex-col items-center min-w-[70px]">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-2xl relative overflow-hidden">
          {s.icon}
          {s.percent && (
            <div className="absolute -top-2 -right-8 w-20 h-8 rotate-45 bg-yellow-300 text-black text-[10px] font-bold text-center flex items-start justify-center pt-2">
              {s.percent}%
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-700 mt-1">{s.name}</div>
    </div>
  ))}
</div>
      <div className="px-4">
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
        <div className="text-xs text-gray-400 font-bold mb-1">СУПЕРМАРКЕТЫ</div>

          <div className="font-bold text-lg mb-2">Доставка из магазинов</div>
          <div className="flex gap-4 mb-2">
            {supermarkets.map(m => (
              <div key={m.id} className="flex flex-col items-center p-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-2xl text-white overflow-hidden">{m.logo}</div>
                  <div className="absolute -top-0 left-10 bg-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full border border-white">{m.percent}%</div>
                </div>
                <div className="text-xs text-gray-700 mt-1">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {supermarkets[0].products.map((p, idx) => (
              <div key={idx}>
                <div className="min-w-[140px] max-w-[140px] bg-gray-50 rounded-2xl flex flex-col items-center overflow-hidden shadow">
                <div className="w-full h-[180px] overflow-hidden flex items-center justify-center bg-white">
                  {React.isValidElement(p.img) ?
                    React.cloneElement(
                      p.img as React.ReactElement<any>,
                      {
                        className: (((p.img as React.ReactElement<any>).props.className || '') + ' w-[180px] h-[180px] object-cover').trim()
                      }
                    ) : p.img}
                </div>
                </div>
                <div className="w-full px-3 pb-2 pt-2 flex flex-col items-start">
                  <div className="text-base font-semibold leading-tight">{p.price}</div>
                  <div className="text-xs text-gray-500 leading-tight">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      <div className="px-4">
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
        <div className="text-xs text-gray-400 font-bold mb-1">ПУТЕШЕСТВИЯ</div>

          <div className="font-bold text-lg mb-2">Популярные направления</div>
          <div className="flex gap-4 overflow-x-auto">
            {hotels.map((h) => (
              <div className="min-w-[300px] rounded-2xl flex flex-col items-center overflow-hidden shadow">
                <div className="w-full h-[420px] overflow-hidden flex items-center justify-center bg-white relative">
                  {React.isValidElement(h.img)
                    ? React.cloneElement(
                        h.img as React.ReactElement<any>,
                        {
                          className: (((h.img as React.ReactElement<any>).props.className || '') + ' w-[300px] h-[420px] object-cover').trim()
                        }
                      )
                    : h.img}
                  <div className="absolute left-0 bottom-0 w-full px-3 py-4 bg-gradient-to-t from-gray-600/50 to-transparent">
                    <div className="text-base font-semibold text-white leading-tight">{h.price}</div>
                    <div className="text-xs text-white leading-tight">{h.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
      </div>
    </div>
  );
}; 