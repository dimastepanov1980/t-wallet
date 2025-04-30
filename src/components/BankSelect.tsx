import React, { useState } from 'react';

interface Bank {
  id: number;
  name: string;
  index: string;
}

const banks: Bank[] = [
  { id: 1, name: 'Сбербанк', index: 'SBER' },
  { id: 2, name: 'ВТБ', index: 'VTBR' },
  { id: 3, name: 'Газпромбанк', index: 'GAZP' },
  { id: 4, name: 'Альфа-Банк', index: 'ALFA' },
  { id: 5, name: 'Россельхозбанк', index: 'RSHB' },
  { id: 6, name: 'Московский кредитный банк (МКБ)', index: 'MKB' },
  { id: 7, name: 'Т-Банк', index: 'TINK' },
  { id: 8, name: 'Совкомбанк', index: 'SVCB' },
  { id: 9, name: 'Райффайзен Банк', index: 'RAIF' },
];

interface BankSelectProps {
  onSelect?: (bank: Bank) => void;
  className?: string;
}

export const BankSelect: React.FC<BankSelectProps> = ({ onSelect, className = '' }) => {
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const bank = banks.find(b => b.id === Number(event.target.value));
    if (bank) {
      setSelectedBank(bank);
      onSelect?.(bank);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedBank?.id || ''}
        onChange={handleChange}
        className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-600"
      >
        <option value="">Выберите банк</option>
        {banks.map((bank) => (
          <option key={bank.id} value={bank.id}>
            {bank.name} ({bank.index})
          </option>
        ))}
      </select>
    </div>
  );
}; 