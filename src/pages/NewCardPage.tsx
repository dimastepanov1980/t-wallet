import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCardToAccount } from '../store/slices/accountSlice';
import { CardType } from '../types/account';
import { AppDispatch } from '../store';

export const NewCardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  
  const [formData, setFormData] = useState({
    name: '',
    holderName: '',
    cardNumber: '',
    type: 'mastercard' as CardType,
    balance: 0
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Форматирование номера карты в формат **** **** **** ****
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value);
      if (formatted.length <= 19) { // 16 цифр + 3 пробела
        setFormData(prev => ({
          ...prev,
          [name]: formatted
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

    // Проверяем только длину номера карты
    const cardNumberWithoutSpaces = formData.cardNumber.replace(/\s/g, '');
    if (cardNumberWithoutSpaces.length !== 16) {
      setError('Номер карты должен содержать 16 цифр');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(addCardToAccount({
        accountId: accountId!,
        card: {
          ...formData,
          cardNumber: cardNumberWithoutSpaces
        }
      })).unwrap();
      navigate('/add-account');
    } catch (err) {
      setError('Не удалось добавить карту. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="ml-2 text-xl">Добавить карту</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Название карты</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Например: Основная карта"
                required
              />
            </label>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Имя держателя</span>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Как указано на карте"
                required
              />
            </label>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Номер карты</span>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="XXXX XXXX XXXX XXXX"
                required
                maxLength={19}
              />
            </label>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Тип карты</span>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="mastercard">Mastercard</option>
                <option value="visa">Visa</option>
                <option value="mir">МИР</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ffdd2d] text-gray-600 rounded-xl py-4 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Создание...' : 'Создать карту'}
          </button>

          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}; 