import { ArrowsRightLeftIcon, PhoneIcon, CreditCardIcon, BanknotesIcon, ArrowPathIcon, ArrowDownCircleIcon, DocumentTextIcon, DevicePhoneMobileIcon, HomeIcon, UserGroupIcon, ArrowDownTrayIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const favorites = [
  { label: 'Платеж по кредитной', icon: <ArrowsRightLeftIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
  { label: 'Мобильная связь', icon: <PhoneIcon className='w-10 h-10 bg-green-500 rounded-full text-white p-2' /> },
  {   label: 'Кредит',
    icon: (
      <img
        src="/logos/raiffeisen.svg"
        className="w-10 h-10 bg-yellow-300 rounded-full p-1"
      />
    ), },
  { label: 'Сбербанк', icon: (
      <img
        src="/logos/sberbank.svg"
        className="w-10 h-10 bg-green-300 rounded-full"
      />
    ),
  },
  { label: 'Себе на счет', icon: <ArrowDownTrayIcon className='w-10 h-10 bg-gray-500 rounded-full text-white p-2' /> },
];

const transfers = [
  { label: 'Из другого банка', icon: <BanknotesIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
  { label: 'Между счетами', icon: <ArrowPathIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
  { label: 'По номеру карты', icon: <CreditCardIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
  { label: 'По номеру договора', icon: <DocumentTextIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
];

const payments = [
  { label: 'Мобильная связь', icon: <DevicePhoneMobileIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
  { label: 'ЖКХ', icon: <HomeIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
  { label: 'Госуслуги', icon: <UserGroupIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
  { label: 'Погашение кредитов', icon: <CreditCardIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
];

const actions = [
  { label:<> Запросить<br /> деньги</>, icon: <ArrowDownCircleIcon className='w-10 h-10 bg-blue-500 rounded-full text-white p-2' /> },
];

const contacts = [
  { initials: 'С', name: 'Себе' },
  { initials: 'АХ', name: 'Василий Химсейл' },
  { initials: 'АБ', name: 'Александр Бали' },
  { initials: 'АХ', name: 'Артур Хестанов' },
  { initials: 'АС', name: 'Александр Евсеев' },
];

export const PaymentsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="text-3xl font-bold px-4 mb-4 mt-2">Платежи</div>
      <div className="px-4 mb-4">
        <input className="w-full rounded-xl bg-gray-100 px-4 py-3 text-lg outline-none" placeholder="Поиск" />
      </div>
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg">Избранное</div>
            <button className="bg-transparent text-blue-600 text-sm font-medium">Все</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {favorites.map((f, i) => (
              <div key={i} className="flex flex-col items-center min-w-[90px] bg-gray-50 rounded-xl p-2">
                <div className="flex items-center justify-center text-2xl mb-1">{f.icon}</div>
                <div className="text-xs text-gray-700 text-center">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white shadow-lg text-gray-800 rounded-xl font-medium">
              <DocumentTextIcon className='w-6 h-6 text-blue-600' />
              <span>На оплату</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white shadow-lg text-gray-800 rounded-xl font-medium">
              <QrCodeIcon className='w-6 h-6 text-blue-600' />
              <span>Сканировать</span>
            </button>
          </div>
      </div>
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-2">
          <div className="font-bold text-lg mb-2">Перевод по телефону <span className='ml-1'></span></div>
          <input className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base outline-none mb-2" placeholder="Имя или номер" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {contacts.map((c, i) => (
              <div key={i} className="flex flex-col items-center min-w-[60px]">
                <div className="w-10 h-10 text-white rounded-full bg-gray-300 flex items-center justify-center text-base font-bold mb-1 border border-gray-300">{c.initials}</div>
                <div className="text-xs text-gray-700 text-center truncate w-full">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg">Переводы</div>
            <button className="bg-transparent text-blue-600 text-sm font-medium">Все</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {transfers.map((t, i) => (
              <div key={i} className="flex flex-col items-center min-w-[90px] bg-gray-50 rounded-xl p-2">
                <div className="w-10 h-10 flex items-center justify-center text-2xl mb-1">{t.icon}</div>
                <div className="text-xs text-gray-700 text-center">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg">Платежи</div>
            <button className="bg-transparent text-blue-600 text-sm font-medium">Все</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {payments.map((p, i) => (
              <div key={i} className="flex flex-col items-center min-w-[90px] bg-gray-50 rounded-xl p-2">
                <div className="w-10 h-10 flex items-center justify-center text-2xl mb-1">{p.icon}</div>
                <div className="text-xs text-gray-700 text-center">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-2">
          <div className="font-bold text-lg mb-2">Действия</div>
          <div className="flex gap-2">
            {actions.map((a, i) => (
              <div key={i} className="flex flex-col items-center min-w-[120px] bg-gray-50 rounded-xl p-2">
                <div className="w-10 h-10 flex items-center justify-center text-2xl mb-1">{a.icon}</div>
                <div className="text-xs text-gray-700 text-center">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 