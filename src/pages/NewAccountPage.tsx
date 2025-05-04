import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createAccount } from '../store/slices/accountSlice';
import { Currency } from '../types/account';
import { AppDispatch } from '../store';
import { Header } from '../components/ui/Header';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€'
};

const CURRENCY_NAMES: Record<Currency, string> = {
  RUB: 'Российский рубль',
  USD: 'Доллар США',
  EUR: 'Евро'
};

export const NewAccountPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    accountNumber: '',
    currency: 'RUB' as Currency
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'accountNumber') {
      // Удаляем все нецифровые символы
      const numbers = value.replace(/\D/g, '');
      
      // Ограничиваем длину до 20 цифр
      if (numbers.length <= 20) {
        setFormData(prev => ({
          ...prev,
          [name]: numbers
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Проверяем номер счета
    if (formData.accountNumber.length !== 20) {
      setError('Номер счета должен содержать 20 цифр');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(createAccount(formData)).unwrap();
      navigate('/add-account');
    } catch (err) {
      setError('Не удалось создать счет. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Добавить счет" />
      
      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Название счета</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Например: Основной счет"
                required
              />
            </label>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Владелец счета</span>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Введите имя владельца"
                required
              />
            </label>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Номер счета</span>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="20 цифр"
                required
                maxLength={20}
                pattern="\d{20}"
              />
              <span className="text-xs text-gray-500 mt-1">
                {formData.accountNumber.length}/20 цифр
              </span>
            </label>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Валюта счета</span>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-600"
                required
              >
                {Object.entries(CURRENCY_NAMES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({CURRENCY_SYMBOLS[code as Currency]})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full  bg-[#ffdd2d] hover:bg-[#ffd42d] text-gray-600 rounded-xl py-4 px-6 text-m font-light transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Создание счета...' : 'Создать счет'}
          </button>
        </form>
      </div>
    </div>
  );
}; 