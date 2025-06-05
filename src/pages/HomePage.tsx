import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MagnifyingGlassIcon, QrCodeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { AccountCard } from '../components/AccountCard';
import { Account, Card, Transaction } from '../types/interface';
import { Operations } from '../components/Operations';
import { getRandomLogos } from '../components/ui/CachBack';
import { AddIcon } from '../components/ui/Add';
import { SbrIcon } from '../components/ui/SBP';
import { TransferIcon } from '../components/ui/Transfer';


// Helper function to get current month in Russian
const getCurrentMonth = () => {
  return new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date()).toLowerCase();
};

// Helper function to calculate total expenses for current month 
const calculateMonthlyExpenses = (accounts: Account[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return accounts.reduce((totalExpenses, account) => {
    const accountTransactions = account.cards.flatMap((card: Card) => card.transactions);
    
    const accountExpenses = accountTransactions
      .filter((t: Transaction) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
               t.type === 'outgoing';
    })
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    return totalExpenses + accountExpenses;
  }, 0);
};

const promoBlocks = [
  { title: 'Горный Алтай осенью', image: 
    (
      <img
        src="/logos/mountain.jpg" 
        
      />
    ) },
  { title: 'Разоблачите оператора связи?', image: 
    (
      <img
        src="/logos/phone.jpg" 
        
      />
    ) },
  { title: 'Оставляете чаевые?', image: 
    (
      <img
        src="/logos/tips.webp" 
        
      />
    ) },
  { title: 'Тест о римской экономике', image: 
    (
      <img
        src="/logos/rome.jpg" 
        
      />
    ) },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const {full_name } = useSelector((state: RootState) => state.auth);

  const { accounts } = useSelector((state: RootState) => ({
    accounts: state.accounts.accounts
  }));

  const rubleAccount = accounts.find(account => account.currency === 'RUB') || accounts[0];
  const accountName = rubleAccount?.name || 'счет';

  const monthlyExpenses = calculateMonthlyExpenses(accounts);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const randomLogos = useMemo(() => getRandomLogos(4), []);

  return (
    <div className="flex flex-col gap-8 p-4 bg-gray-50">
      {/* Header with avatar and name */}
      <div className="flex items-center gap-3" onClick={() => navigate('/user-profile')}>
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xl font-medium text-gray-600">
            {full_name?.[0] || 'N'}
          </span>
        </div>
        <span className="text-lg font-medium">{full_name || 'Name'}</span>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        
      </div>

      {/* Search bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск"
          className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-100 text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* Promo blocks */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {promoBlocks.map((block, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-28 h-28 rounded-2xl bg-blue-100 relative overflow-hidden"
            style={{ minWidth: '6rem' }}
          >
            {/* Изображение на весь блок */}
            {React.isValidElement(block.image)
              ? React.cloneElement(
                  block.image as React.ReactElement<any>,
                  {
                    className:
                      (((block.image as React.ReactElement<any>).props.className || '') +
                        ' absolute inset-0 w-full h-full object-cover z-0').trim()
                  }
                )
              : block.image}

            {/* Оверлей для затемнения */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />

            {/* Текст поверх изображения */}
            <span className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white z-20 line-clamp-2">
              {block.title}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Operations */}
        <Operations 
          currentMonth={getCurrentMonth()}
          monthlyExpenses={formatAmount(monthlyExpenses)}
          title="Все операции"
          navigate={() => navigate(`/transactions/${rubleAccount.id}`)}
        />

        {/* ToDo: Create new component "Cashback"  */}
        <div className="bg-white rounded-2xl p-4 shadow-xl"
        onClick={() => navigate('/promotions')}        >
          
            <h2 className="text-lg font-medium">
              Кэшбэк<br />и бонусы
            </h2>
            <div className="flex gap-4 mt-3">
              {randomLogos.map((item) => (
                <div key={item.id} className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                  {item.logo}
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center gap-3"
        onClick={() => navigate(`/card-transfer/${rubleAccount.id}?type=outgoing`)}>
          <div className="w-full h-8 rounded-lg bg-gradient-to-br from-red-100/50 to-gray-200/50 flex items-center justify-center">
          <SbrIcon className="w-6 h-6" />  
            
          </div>
          <span className="text-xs text-center text-gray-900">Перевести<br />по телефону</span>
        </div>
        <div className="flex flex-col items-center gap-2"
        onClick={() => navigate(`/top-up/${rubleAccount.id}?type=incoming`)}>
          <div className="w-full h-10 rounded-lg bg-gray-200/50 flex items-center justify-center">
          <AddIcon className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs text-center text-gray-900">Пополнить<br />{accountName}</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-full h-10 rounded-lg bg-gray-200/50 flex items-center justify-center">
            <TransferIcon className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs text-center text-gray-900">Между<br />счетами</span>
        </div>
        <div className="flex flex-col items-center gap-3">
        <div className="w-full h-10 rounded-lg bg-gray-200/50 flex items-center justify-center">
        <QrCodeIcon className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs text-center text-gray-900">Сканировать<br />QR-код</span>
        </div>
      </div>

      {/* Accounts list */}
      <div className="space-y-4">
        {accounts.map(account => (
          <AccountCard key={account.id} account={account} />
        ))}
            <button 
              onClick={() => navigate('/add-account')}
              className="w-full h-14 flex justify-center items-center rounded-xl text-m font-light text-black bg-[#ffdd2d] hover:bg-[#ffd42d] disabled:opacity-50"

            >
              Новый счет или продукт
            </button>
        
      </div>
    </div>
  );
}; 