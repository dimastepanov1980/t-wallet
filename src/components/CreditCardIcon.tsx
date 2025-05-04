import React from 'react';

interface CreditCardIconProps {
  cardNumber: string;
  type: string;
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
};

export const CreditCardIcon: React.FC<CreditCardIconProps> = ({ cardNumber, type }) => {
  const brand = getCardBrand(type);
  const iconPath = getCardIcon(brand);

  return (
    <div 
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
          <p className="text-[10px] font-medium">{cardNumber.slice(-4)}</p>
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
}; 