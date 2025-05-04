import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Transaction } from '../types/account';
import { DateRangePicker } from '../components/DateRangePicker';
import { Header } from '../components/ui/Header';
import { TransactionCard } from '../components/TransactionCard';
import { useParams } from 'react-router-dom';
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    currencyDisplay: 'symbol'
  }).format(amount);
};

const formatDateRange = (from: Date, to: Date) => {
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
    return new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(from);
  }
  return `${new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(from)} - ${new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(to)}`;
};

export const TransactionsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'accounts' | 'no-transfers'>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  });
  // ToDo: Давай будем отображать транзакции по текущему счету
  const { accountId } = useParams<{ accountId: string }>();
  
  //const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const { accounts } = useSelector((state: RootState) => state.accounts);
  const account = accounts.find(acc => acc.id === accountId);

  // Получаем все транзакции из всех карт всех счетов
  const allTransactions = account
  ? account.cards.flatMap(card => card.transactions)
  : [];

  // Фильтрация транзакций по выбранному диапазону дат
  const filteredTransactions = allTransactions.filter(t => {
    const transactionDate = new Date(t.date);
    const startOfDay = new Date(dateRange.from);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateRange.to);
    endOfDay.setHours(23, 59, 59, 999);
    return transactionDate >= startOfDay && transactionDate <= endOfDay;
  });

  const expenses = filteredTransactions
    .filter(t => t.type === 'outgoing')
    .reduce((sum, t) => sum + t.amount, 0);

  const income = filteredTransactions
    .filter(t => t.type === 'incoming')
    .reduce((sum, t) => sum + t.amount, 0);

  // Группировка транзакций по дате
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header title='Операции'/>
      {/* Search */}
      <div className="flex flex-col gap-4 p-4 pt-[calc(env(safe-area-inset-top))]">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск"
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-white text-gray-600 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        <button
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            selectedFilter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700'
          }`}
          onClick={() => setShowDatePicker(true)}
        >
          {formatDateRange(dateRange.from, dateRange.to)}
          <ChevronDownIcon className="w-5 h-5" />
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedFilter === 'accounts' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedFilter('accounts')}
        >
          Счета и карты
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedFilter === 'no-transfers' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedFilter('no-transfers')}
        >
          Без переводов
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded-2xl p-4">
          <div className="text-gray-600">Траты</div>
          <div className="text-xl font-medium mt-1">{formatAmount(expenses)}</div>
          <div className="h-1.5 bg-blue-100 rounded-full mt-2">
            <div className="h-full w-3/4 bg-blue-500 rounded-full" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <div className="text-gray-600">Доходы</div>
          <div className="text-xl font-medium mt-1">{formatAmount(income)}</div>
          <div className="h-1.5 bg-green-100 rounded-full mt-2">
            <div className="h-full w-1/2 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-4">
        {Object.entries(groupedTransactions)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, transactions]) => (
            <div key={date} className="mb-6">
              <div className="text-xl font-bold text-gray-8 00 mb-2">
                {new Date(date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id} 
                    transaction={transaction}
                    navigate={() => {}}
                    formatAmount={formatAmount}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateRangePicker
          initialMonth={dateRange.from}
          initialRange={dateRange}
          onClose={() => setShowDatePicker(false)}
          onSelect={(range) => {
            setDateRange(range);
            setShowDatePicker(false);
          }}
        />
      )}
    </div>
  );
}; 