import React from 'react';
import { Account, Currency } from '../types/account';

interface AccountCardProps {
  account: Account;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€'
};

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const formatBalance = (balance: number, currency: Currency) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol'
    }).format(balance);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white font-medium">{CURRENCY_SYMBOLS[account.currency]}</span>
        </div>
        <div>
          <p className="text-2xl font-medium">{formatBalance(account.balance, account.currency)}</p>
          <p className="text-gray-600">{account.name}</p>
        </div>
      </div>
      {account.cards.length > 0 && (
        <div className="flex gap-2 mt-4">
          {account.cards.map((card) => (
            <div 
              key={card.id} 
              className="bg-gray-900 text-white px-3 py-1 rounded text-sm"
              title={`${card.name} (${card.type.toUpperCase()}) • ${account.currency}`}
            >
              {card.cardNumber.slice(-4)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 