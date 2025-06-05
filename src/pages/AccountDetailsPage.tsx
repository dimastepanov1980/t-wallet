import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BorderCard } from '../components/ui/BorderCard';
import { Header } from '../components/ui/Header';
import { RootState } from '../store';
import { Account, Transaction, Card as CardType } from '../types/interface';
import { CreditCardIcon } from '../components/CreditCardIcon';
import { ArrowRightIcon, ChevronRightIcon, PencilIcon } from '@heroicons/react/24/solid';
import { Operations } from '../components/Operations';
import { deleteAccount } from '../store/slices/accountSlice';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { AppDispatch } from '../store';

export const AccountDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const account = useSelector((state: RootState) => 
    state.accounts.accounts.find((acc: Account) => acc.id === accountId)
  );
  const { accounts } = useSelector((state: RootState) => ({
    accounts: state.accounts.accounts
  }));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

    // Helper function to get current month in Russian
  const getCurrentMonth = () => {
    return new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date()).toLowerCase();
  };

  // Helper function to calculate total expenses for current month 
  const calculateMonthlyExpenses = (accounts: Account[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return accounts.reduce((totalExpenses, account) => {
      const accountTransactions = account.cards.flatMap((card: CardType) => card.transactions);
      
      const accountExpenses = accountTransactions
        .filter((t: Transaction) => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && 
              date.getFullYear() === currentYear && 
                t.type === 'outgoing';
      })
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      return totalExpenses + accountExpenses;
    }, 0);
  };
  
  const monthlyExpenses = calculateMonthlyExpenses(accounts);


  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  
  if (!account) {
    return <div>Account not found</div>;
  }

  const handleDeleteAccount = async () => {
    if (!accountId) return;
    
    try {
      dispatch(deleteAccount(accountId));
      navigate('/add-account');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header  bgColor="gray-800" textColor="gray-100" />
      
      <div className="bg-gray-800 fixed top-0 left-0 right-0" style={{ 
        paddingTop: 'calc(max(env(safe-area-inset-top), 20px) + 50px)'
      }}>
        {/* Account name and balance */}
        <div className="p-4 bg-gray-800 text-gray-100">
         
          <div className="flex items-center mb-4">
            <h1 className="text-xl font-medium">{account.name}</h1>
            <button className="text-sm text-gray-100 bg-transparent" onClick={() => navigate(`/add-account/${account.id}`)}>
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-3xl font-bold mt-2">
            {account.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {account.currency === 'RUB' ? '₽' : account.currency}
          </p>
         
        </div>

        {/* Cards list */}
        <div className="flex gap-2 p-4 overflow-x-auto bg-gray-800">
          {account.cards.map((card: CardType) => (
            <CreditCardIcon
              key={card.id}
              cardNumber={card.cardNumber}
              type={card.type}
            />
          ))}
          <button 
            className="flex-shrink-0 w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
            onClick={() => navigate(`/add-card/${account.id}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

          
      <div style={{ marginTop: 'calc(env(safe-area-inset-top) + 180px)' }}>
        {/* Action buttons */}
        <div className="m-4 space-y-4">
        <BorderCard>
        <div className="grid grid-cols-3 gap-4">
    
          <button className="bg-transparent flex flex-col items-center space-y-1" onClick={() => navigate(`/card-transfer/${account.id}?type=outgoing`)}>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                </div>
            </div> 
            <span className="text-sm text-blue-500">Оплатить</span>
          </button>
          <button className="bg-transparent flex flex-col items-center space-y-1" 
            onClick={() => navigate(`/top-up/${account.id}`)}>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            </div> 
            <span className="text-sm text-blue-500">Пополнить</span>
          </button>
         
          <button className="bg-transparent flex flex-col items-center" onClick={() => navigate('/card-transfer')}>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-gray-100">
              <ArrowRightIcon className="w-5 h-5" />
            </div>
            <span className="text-sm text-blue-500">Перевести</span>
          </button>
        </div>
        </BorderCard>

        {/* Account operations */}
        <div className="grid grid-cols-2 gap-4">
        {/* Operations */}
        <Operations 
          currentMonth={getCurrentMonth()}
          monthlyExpenses={formatAmount(monthlyExpenses)}
          title="Все операции"
          navigate={() => navigate(`/transactions/${account.id}`)}
        />

        {/* ToDo: Create new component "Cashback"  */}
        <div className="bg-white rounded-2xl p-4 shadow-xl">
            <h2 className="text-lg font-medium">
              Кэшбэк<br />и бонусы
            </h2>
            <div className="flex gap-4 mt-3">
            {[1, 2, 3].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-gray-100" />
            ))}
            </div>
        </div>
      </div>
        

        {/* Bonuses */}
        <BorderCard>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold m-4 pt-4">Бонусы по {account.name}</h2>
            <button className=" bg-transparent text-blue-500 text-sm m-4">Все</button>
          </div>
          <div className="grid gap-4">
            <BorderCard className="p-4">
              <h3 className="font-medium">Повышенный кэшбэк на май</h3>
              <p className="text-sm text-gray-500 mt-1">До 30% за подписки</p>
              <button className="mt-2 px-4 py-2 bg-yellow-400 rounded-lg text-sm">
                Выбрать
              </button>
            </BorderCard>
          </div>
        </BorderCard>

        {/* Account details */}
        <BorderCard>
          
            <h2 className="text-lg font-bold m-4 pt-4">Реквизиты</h2>
            <p className="text-sm text-gray-500 m-4 pb-4">Номер договора {account.id}</p>
          
        </BorderCard>

        {/* Additional account options */}
        <div className="bg-gray-50 rounded-3xl">
          <h2 className="text-lg font-bold m-4 pt-4">Детали счета</h2>
          <button className="text-m font-light bg-transparent w-full flex items-center justify-between text-left"
          onClick={() => navigate('/transactions/generate')}>
          <span>Генерация транзакций, <br/>входящих и исходящих платежей</span>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </button>
          <button className="text-m font-light bg-transparent w-full flex items-center justify-between  text-left">
            <span>Тариф</span>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </button>
          <button className="text-m font-light bg-transparent w-full flex items-center justify-between text-left">
            <span>Выписка по счету</span>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </button>
          <button className="text-m font-light bg-transparent w-full flex items-center justify-between text-left"
          onClick={() => navigate(`/statement/${account.id}`)}>
            <span>Заказать справку</span>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </button>
          <div className="space-y-4">
            <button className="text-m font-light bg-transparent w-full flex items-center justify-between text-left">
              <span>Защита карт</span>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>

            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-m font-light bg-transparent w-full flex items-center justify-between text-left text-red-500"
            >
              <span>Удалить счет</span>
              <ChevronRightIcon className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Удалить счет?"
        message="Это действие нельзя отменить. Все карты и транзакции, связанные с этим счетом, будут удалены."
      />
    </div>
  );
}; 