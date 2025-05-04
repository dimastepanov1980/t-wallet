import React from 'react';
import { Account, Currency } from '../types/account';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon } from './CreditCardIcon';

interface AccountCardProps {
  account: Account;
}


export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const navigate = useNavigate();

  const formatBalance = (balance: number, currency: Currency) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol'
    }).format(balance);
  };

  const getCurrencySymbol = (currency: Currency) => {
    switch (currency) {
      case 'RUB':
        return '₽';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return currency;
    }
  };

  return (
    <div 
      className="bg-white shadow-lg rounded-2xl py-2 px-4 cursor-pointer hover:bg-gray-50"
      onClick={() => navigate(`/account/${account.id}`)}
    >
      {/* Информация о счете */}
      <div className="flex items-start pt-4 gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-lg font-medium">
              {getCurrencySymbol(account.currency)}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold">{formatBalance(account.balance, account.currency)}</p>
          <h3 className="text-gray-400">{account.name}</h3>
          
          {/* Карты */}
          {account.cards.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {account.cards.map((card) => (
                <CreditCardIcon
                  key={card.id}
                  cardNumber={card.cardNumber}
                  type={card.type}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 