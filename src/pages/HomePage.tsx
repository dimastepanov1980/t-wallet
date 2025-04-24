import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { MagnifyingGlassIcon, QrCodeIcon, ArrowPathIcon, PlusIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { AccountCard } from '../components/AccountCard';

// Helper function to get current month in Russian
const getCurrentMonth = () => {
  return new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date()).toLowerCase();
};

// Helper function to calculate total expenses for current month
const calculateMonthlyExpenses = (transactions: any[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             t.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

const promoBlocks = [
  { title: 'Горный Алтай осенью', image: 'mountain.jpg' },
  { title: 'Разоблачите оператора связи?', image: 'phone.jpg' },
  { title: 'Оставляете чаевые?', image: 'tips.jpg' },
  { title: 'Тест о римской экономике', image: 'rome.jpg' },
];

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, transactions, accounts } = useSelector((state: RootState) => ({
    user: state.user,
    transactions: state.transactions.transactions,
    accounts: state.accounts.accounts
  }));

  const monthlyExpenses = calculateMonthlyExpenses(transactions);

  return (
    <div className="flex flex-col gap-8 p-4 bg-gray-50">
      {/* Header with avatar and name */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xl font-medium text-gray-600">
            {user?.full_name?.[0] || 'Д'}
          </span>
        </div>
        <span className="text-lg font-medium">{user?.full_name || 'Дмитрий'}</span>
      </div>

      {/* Search bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск"
          className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-100 text-gray-600 placeholder-gray-400"
          disabled
        />
      </div>

      {/* Promo blocks */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {promoBlocks.map((block, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-28 h-28 rounded-2xl bg-blue-100 flex items-end p-3 relative overflow-hidden"
            style={{ minWidth: '6rem' }}
          >
            <span className="text-sm font-medium text-white z-10 line-clamp-2">
              {block.title}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Operations card */}
        <div className="bg-white rounded-2xl p-4 shadow-xl">
            <h2 className="text-lg font-medium">Все операции</h2>
            <p className="text-gray-600">Трат в {getCurrentMonth()}</p>
            <p className="text-2xl font-medium mt-2">{monthlyExpenses.toLocaleString('ru-RU')} ₽</p>
            <div className="h-2 bg-gray-100 rounded-full mt-3">
            <div className="h-full w-3/4 bg-blue-500 rounded-full" />
            </div>
        </div>

        {/* Cashback card */}
        <div className="bg-white rounded-2xl p-4 shadow-xl">
            <h2 className="text-lg font-medium">
              Кэшбэк<br />и бонусы
            </h2>
            <div className="flex gap-4 mt-3">
            {[1, 2, 3].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-gray-100" />
            ))}
            </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <PhoneIcon className="w-8 h-8 text-blue-600" />
          </div>
          <span className="text-sm text-center text-gray-900">Перевести<br />по телефону</span>
        </div>
        <div className="flex flex-col items-center gap-3" onClick={() => navigate('/top-up')}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <PlusIcon className="w-8 h-8 text-blue-600" />
          </div>
          <span className="text-sm text-center text-gray-900">Пополнить<br />Black</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 text-blue-600" />
          </div>
          <span className="text-sm text-center text-gray-900">Между<br />счетами</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <QrCodeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <span className="text-sm text-center text-gray-900">Сканировать<br />QR-код</span>
        </div>
      </div>

      {/* Accounts list */}
      <div className="space-y-4">
        {accounts.map(account => (
          <AccountCard key={account.id} account={account} />
        ))}
        {accounts.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            У вас пока нет счетов. 
            <button 
              onClick={() => navigate('/add-account/new')}
              className="text-blue-600 ml-1 hover:underline"
            >
              Добавить первый счет
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 