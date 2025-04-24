import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export const CardTransferPage = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');

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
          <h1 className="ml-2 text-xl">По номеру карты</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-20">
        {/* Card input section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <input
            type="text"
            placeholder="Номер карты"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none"
            maxLength={19}
          />
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 opacity-40"></div>
          </div>
        </div>

        {/* Balance display */}
        <div className="bg-gray-900 text-white rounded-3xl p-6">
          <p className="text-gray-400 text-sm">на Black</p>
          <p className="text-2xl font-medium mt-1">88 765,86 ₽</p>
        </div>

        {/* Amount input */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <input
            type="text"
            placeholder="Сумма, ₽"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none"
          />
        </div>

        {/* Transfer button */}
        <button 
          className="bg-yellow-400 text-black rounded-xl py-4 px-6 text-lg font-medium mt-auto"
          disabled={!cardNumber || !amount}
        >
          Перевести
        </button>
      </div>
    </div>
  );
}; 