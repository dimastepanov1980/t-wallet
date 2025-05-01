import React from 'react';
import { Card } from '../components/ui/Card';

interface AccountCard {
  id: string;
  lastFourDigits: string;
  type: string;
}

interface AccountDetailsProps {
  accountName: string;
  balance: number;
  cards: AccountCard[];
  contractNumber: string;
  cashback: {
    accumulated: number;
    description: string;
  };
  bonuses: Array<{
    id: string;
    title: string;
    description: string;
    action?: string;
  }>;
}

export const AccountDetailsPage: React.FC<AccountDetailsProps> = ({
  accountName,
  balance,
  cards,
  contractNumber,
  cashback,
  bonuses,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header with back button */}
      <div className="flex items-center p-4 bg-white">
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Account name and balance */}
      <div className="p-4 bg-white">
        <h1 className="text-xl font-medium text-gray-800">{accountName}</h1>
        <p className="text-3xl font-bold mt-2">{balance.toLocaleString('ru-RU')} ₽</p>
      </div>

      {/* Cards list */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {cards.map((card) => (
          <div key={card.id} className="flex-shrink-0 w-16 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            •••• {card.lastFourDigits}
          </div>
        ))}
        <button className="flex-shrink-0 w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-white">
        <button className="flex flex-col items-center">
          <span className="text-blue-500">Оплатить</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="text-blue-500">Пополнить</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="text-blue-500">Перевести</span>
        </button>
      </div>

      {/* Account operations */}
      <Card className="m-4">
        <div className="p-4">
          <h2 className="text-lg font-medium">Операции по счету</h2>
          <div className="mt-2">
            <div className="h-2 bg-blue-100 rounded-full w-1/3"></div>
            <p className="text-sm text-gray-500 mt-2">Трат в мае 5 000 ₽</p>
          </div>
        </div>
      </Card>

      {/* Cashback */}
      <Card className="m-4">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Накоплено кэшбэка</h2>
            <span>{cashback.accumulated} ₽</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{cashback.description}</p>
        </div>
      </Card>

      {/* Bonuses */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Бонусы по Black</h2>
          <button className="text-blue-500 text-sm">Все</button>
        </div>
        <div className="grid gap-4">
          {bonuses.map((bonus) => (
            <Card key={bonus.id} className="p-4">
              <h3 className="font-medium">{bonus.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{bonus.description}</p>
              {bonus.action && (
                <button className="mt-2 px-4 py-2 bg-yellow-400 rounded-lg text-sm">
                  {bonus.action}
                </button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Account details */}
      <Card className="m-4">
        <div className="p-4">
          <h2 className="text-lg font-medium">Реквизиты</h2>
          <p className="text-sm text-gray-500 mt-2">Номер договора {contractNumber}</p>
        </div>
      </Card>

      {/* Additional account options */}
      <div className="space-y-4 p-4">
        <Card>
          <button className="w-full p-4 text-left">
            <span>Лимиты на переводы, снятия и пополнения</span>
          </button>
        </Card>
        <Card>
          <button className="w-full p-4 text-left">
            <span>Тариф</span>
          </button>
        </Card>
        <Card>
          <button className="w-full p-4 text-left">
            <span>Выписка по счету</span>
          </button>
        </Card>
        <Card>
          <button className="w-full p-4 text-left">
            <span>Заказать справку</span>
          </button>
        </Card>
        <Card>
          <button className="w-full p-4 text-left">
            <span>Защита карт</span>
          </button>
        </Card>
      </div>
    </div>
  );
}; 