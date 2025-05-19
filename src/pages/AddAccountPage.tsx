import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Account } from '../types/account';
import { Header } from '../components/ui/Header';


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
    <Header title="Добавьте новый счет или карту" bgColor="white" textColor="gray-900" />

      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-[calc(env(safe-area-inset-top)+52px)]">
      
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
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {selectedAccount ? selectedAccount.name : 'Выберите счет'}
                </span>
                <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
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
            <div className="mt-4 space-y-4">
              <ul role="list" className="border-t-[1px] py-4 border-gray-200 divide-y divide-gray-200">
                {accounts.map((account: Account) => (
                  <li
                    key={account.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedAccount(account);
                      setIsAccountDropdownOpen(false);
                    }}
                  >
                    <div className="flex-1">
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <span className="text-gray-500">{formatBalance(account.balance)}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/add-account/new-account')}
                className="w-full h-14 flex justify-center items-center rounded-xl text-gray-600 bg-[#ffdd2d] hover:bg-[#ffd42d] disabled:opacity-50"
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
            <ul role="list" className="border-t-[1px] py-4 border-gray-200 divide-y divide-gray-200">

                {selectedAccount.cards.map(card => (
                  <li
                    key={card.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{card.name}</p>
                      <p className="text-gray-500">•••• {card.cardNumber.slice(-4)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(`/add-card/${selectedAccount.id}`)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#ffdd2d] hover:bg-[#ffd42d] text-gray-600"
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