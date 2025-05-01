import React from 'react';
import { Account, Currency } from '../types/account';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface AccountCardProps {
  account: Account;
}

// Определяем цвета для разных брендов карт
const cardBrandColors = {
  visa: 'bg-gradient-to-br from-[#1434CB] to-[#01579B]',
  mastercard: 'bg-gradient-to-br from-[#ED0006] to-[#F9A000]',
  mir: 'bg-gradient-to-br from-[#1F7A40] to-[#037F4C]',
  default: 'bg-gradient-to-br from-gray-600 to-gray-800'
};

// Функция для определения бренда карты по типу
const getCardBrand = (type: string) => {
  console.log('Card type:', type);
  switch (type.toLowerCase()) {
    case 'visa':
      return 'visa';
    case 'mastercard':
      return 'mastercard';
    case 'mir':
      return 'mir';
    default:
      return 'default';
  }
};

// Функция для получения пути к иконке
const getCardIcon = (brand: string) => {
  console.log('Card brand:', brand);
  const iconPath = (() => {
    switch (brand) {
      case 'visa':
        return '/card/svg-visa.svg';
      case 'mastercard':
        return '/card/svg-MC.svg';
      case 'mir':
        return '/card/svg-mir.svg';
      default:
        return null;
    }
  })();
  console.log('Icon path:', iconPath);
  return iconPath;
};

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
          {account.cards.map((card: any) => {
            const brand = getCardBrand(card.type);
            const iconPath = getCardIcon(brand);
            
            return (
            <div 
              key={card.id} 
              className={`${cardBrandColors[brand]} relative rounded-xl text-white h-[42px] min-w-[60px] overflow-auto flex-shrink-0`}
            >
              {/* Фоновый паттерн */}
              <div className="absolute inset-0 opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
              </div>

              <div className="relative h-full flex flex-col justify-end">
                {/* Нижняя часть карты */}
                <div className="flex justify-between items-center px-2 pb-2">
                  {/* Номер карты */}
                  <p className="text-[10px] font-medium">{card.cardNumber.slice(-4)}</p>
                  {/* Логотип */}
                  {iconPath && (
                    <img 
                      src={iconPath} 
                      alt={brand}
                      className="h-2 w-auto"
                    />
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
        </div>
        </div>
        
    </div>
  );
}; 