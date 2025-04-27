import React, { useState } from 'react';
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Account } from '../types/account';

export const AddAccountPage = () => {
  const navigate = useNavigate();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(balance);
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
          <h1 className="ml-2 text-xl">Добавьте новый счет или карту</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-20">
        {/* Step indicator */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Шаг 1 из 3</span>
        </div>

        {/* Account selector */}
        <div className="bg-white rounded-2xl p-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
          >
            <div>
              <p className="text-sm text-gray-500">Выберите счет</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {selectedAccount ? selectedAccount.name : 'Выберите счет'}
                </span>
                {selectedAccount && (
                  <span className="text-gray-500">{formatBalance(selectedAccount.balance)}</span>
                )}
              </div>
            </div>
            {isAccountDropdownOpen ? (
              <ChevronUpIcon className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Account dropdown */}
          {isAccountDropdownOpen && (
            <div className="mt-4 space-y-2">
              {accounts.map((account: Account) => (
                <div
                  key={account.id}
                  className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedAccount(account);
                    setIsAccountDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-gray-500">{formatBalance(account.balance)}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/add-account/new-account')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-blue-600"
              >
                <span className="flex items-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  Добавить счет
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Cards list */}
        {selectedAccount && (
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-lg font-medium mb-4">Карты</h3>
            <div className="space-y-4">
              {selectedAccount.cards.map(card => (
                <div key={card.id} className="flex items-center justify-between p-2">
                  <div>
                    <p className="font-medium">{card.name}</p>
                    <p className="text-gray-500">•••• {card.cardNumber.slice(-4)}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate(`/add-card/${selectedAccount.id}`)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 text-white"
              >
                <PlusIcon className="w-5 h-5" />
                Добавить карту
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 