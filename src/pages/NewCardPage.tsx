import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCard } from '../store/slices/accountSlice';
import { CardType } from '../types/account';

export const NewCardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accountId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    holderName: '',
    cardNumber: '',
    type: 'mastercard' as CardType,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) {
      console.error('Account ID is missing');
      return;
    }
    
    dispatch(addCard({ accountId, card: formData }));
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
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
            className="w-full bg-yellow-400 text-black rounded-xl py-4 px-6 text-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            Создать карту
          </button>
        </form>
      </div>
    </div>
  );
}; 