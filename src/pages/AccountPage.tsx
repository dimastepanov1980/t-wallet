import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAccount, updateAccount } from '../store/slices/accountSlice';
import { Account, Currency } from '../types/interface';  
import { AppDispatch, RootState } from '../store';
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

export const AccountPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { accountId } = useParams();
  const account = useSelector((state: RootState) => 
    state.accounts.accounts.find((acc: Account) => acc.id === accountId)
  );

  const { full_name } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    ownerName: full_name || '',
    accountNumber: '',
    dateСreation: '',
    currency: 'RUB' as Currency,
    contractNumber: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (account) {
      setFormData({
        id: account.id,
        name: account.name,
        ownerName: account.ownerName,
        accountNumber: account.accountNumber,
        dateСreation: account.dateСreation,
        currency: account.currency,
        contractNumber: account.contractNumber
      });
    }
  }, [account]);

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

    // Проверяем номер счета
    if (formData.accountNumber.length !== 20) {
      setError('Номер счета должен содержать 20 цифр');
      return;
    }

    try {
      if (accountId) {
        await dispatch(updateAccount({ 
          accountId, 
          data: formData
        })).unwrap();
      } else {
        await dispatch(createAccount(formData)).unwrap();
      }
      navigate('/add-account');
    } catch (err) {
      setError('Не удалось создать счет. Пожалуйста, попробуйте снова.');
    }
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={accountId ? 'Редактировать счет' : 'Добавить счет'} />
      
      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          
        <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Владелец счета</span>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Указать имя владельца"
                required
              />
            </label>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Название счета</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Указать название счета"
                required
              />
            </label>
          </div>


          <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Дата открытия счета</span>
              <input
                type="text"
                name="dateСreation"
                value={formData.dateСreation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="дд.мм.гггг"
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
                placeholder="Указать номер счета"
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
              <span className="text-sm text-gray-500">Номер договора</span>
              <input
                type="text"
                name="contractNumber"
                value={formData.contractNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl bg-gray-50 border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Введите 12 цифр"
                required
                maxLength={12}
                pattern="\d{12}"
              />
            </label>
          </div>

          {!accountId &&
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
          }
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
                        <div className="px-4 text-xs text-gray-500">

              <span>
                Важно: Укажите ваши данные, эти данные будут использоваться для выписки по счету.
                <br/>
                * Все данные хранятся только на вашем устройстве.
              </span>
            </div>
              
          <button
            type="submit"
            className="w-full  bg-[#ffdd2d] hover:bg-[#ffd42d] text-gray-600 rounded-xl py-4 px-6 text-m font-light transition-colors disabled:opacity-50"
          >
            {accountId ? 'Сохранить' : 'Создать счет'}
          </button>
        </form>
      </div>
    </div>
  );
}; 