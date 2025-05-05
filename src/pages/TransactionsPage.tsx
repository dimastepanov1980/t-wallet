import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { MagnifyingGlassIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Transaction, Card, Account } from '../types/interface';
import { DateRangePicker } from '../components/DateRangePicker';
import { Header } from '../components/ui/Header';
import { TransactionCard } from '../components/TransactionCard';
import { useParams } from 'react-router-dom';
import { getBankLogoPath } from '../utils/getBankLogoFileName';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
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
  
  const { accounts } = useSelector((state: RootState) => state.accounts as { accounts: Account[] });
  const account = accounts.find(acc => acc.id === accountId);

  // Получаем все транзакции из всех карт всех счетов
  const allTransactions = account
    ? account.cards.flatMap((card: Card) => card.transactions)
    : [];

  // Фильтрация транзакций по выбранному диапазону дат
  const filteredTransactions = allTransactions.filter((t: Transaction) => {
    const transactionDate = new Date(t.date);
    const startOfDay = new Date(dateRange.from);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateRange.to);
    endOfDay.setHours(23, 59, 59, 999);
    return transactionDate >= startOfDay && transactionDate <= endOfDay;
  });

  const expenses = filteredTransactions
    .filter((t: Transaction) => t.type === 'outgoing')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const income = filteredTransactions
    .filter((t: Transaction) => t.type === 'incoming')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  // Группировка транзакций по дате
  const groupedTransactions: Record<string, Transaction[]> = filteredTransactions.reduce((groups: Record<string, Transaction[]>, transaction: Transaction) => {
    const date = new Date(transaction.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [sheetDragStart, setSheetDragStart] = useState<number | null>(null);
  const [sheetTranslate, setSheetTranslate] = useState<number>(0);

  // smooth open animation
  useEffect(()=>{
    if(detailTx){
      // start below viewport then animate to 0
      const start = window.innerHeight;
      setSheetTranslate(start);
      requestAnimationFrame(()=>setSheetTranslate(0));
    }
  },[detailTx]);

  useEffect(() => {
    let scrollY = 0;
    if (detailTx) {
      scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      const y = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      if (y) window.scrollTo(0, -parseInt(y || '0'));
    }
  }, [detailTx]);

  const dispatch = useDispatch();

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
          .map(([date, transactions]: [string, Transaction[]]) => (
            <div key={date} className="mb-6">
              <div className="text-xl font-bold text-gray-800 mb-2">
                {new Date(date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
              <div className="space-y-3">
                {transactions.map((transaction: Transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onSelect={(t)=>setDetailTx(t)}
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

      {detailTx && (
        <div className="fixed inset-0 z-50" onClick={()=>setDetailTx(null)}>
          <div className="absolute inset-0 bg-black/40 transition-opacity" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80%] overflow-y-auto transition-transform duration-300"
            style={{transform:`translateY(${sheetTranslate}px)`}}
            onClick={e=>e.stopPropagation()}
            onTouchStart={e=>setSheetDragStart(e.touches[0].clientY)}
            onTouchMove={e=>{
              if(sheetDragStart!==null){
                const diff=e.touches[0].clientY-sheetDragStart;
                if(diff>0) setSheetTranslate(diff);
              }
            }}
            onTouchEnd={()=>{
              if(sheetTranslate>100){
                setDetailTx(null);
              }else{
                setSheetTranslate(0);
              }
              setSheetDragStart(null);
            }}
          >
            <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mb-4" />
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                {getBankLogoPath(detailTx.bankName) && (
                  <img src={getBankLogoPath(detailTx.bankName)!} alt={detailTx.counterpartyName} className="w-20 h-20 rounded-full overflow-hidden "/>
                )}
              </div>
              <div className="text-lg font-medium">{detailTx.counterpartyName}</div>
              <div className="text-gray-500">Переводы</div>
              <div className={`text-3xl font-semibold mt-2 ${detailTx.type==='incoming'?'text-green-600':'text-red-600'}`}>{detailTx.type==='incoming' ? '+' : '−'}{formatAmount(Math.abs(detailTx.amount))}</div>
            </div>
            <div className="w-full flex justify-center mb-6">
              <button
                className="bg-blue-50 rounded-xl flex flex-col items-center justify-center"
                onClick={() => {
                  if (!detailTx) return;
                  // Найти аккаунт и карту
                  const accIdx = accounts.findIndex(acc => acc.cards.some(card => card.transactions.some(t => t.id === detailTx.id)));
                  if (accIdx === -1) return setDetailTx(null);
                  const cardIdx = accounts[accIdx].cards.findIndex(card => card.transactions.some(t => t.id === detailTx.id));
                  if (cardIdx === -1) return setDetailTx(null);
                  // Удалить транзакцию
                  const updatedAccounts = accounts.map((acc, i) =>
                    i === accIdx ? {
                      ...acc,
                      cards: acc.cards.map((card, j) =>
                        j === cardIdx ? {
                          ...card,
                          transactions: card.transactions.filter(t => t.id !== detailTx.id)
                        } : card
                      )
                    } : acc
                  );
                  // Обновить store
                  import('../store/slices/accountSlice').then(({ setAccounts }) => {
                    dispatch(setAccounts(updatedAccounts));
                    setDetailTx(null);
                  });
                }}
              >
                <span className="text-2xl">
                  <ArrowUturnLeftIcon className="w-6 h-6 text-blue-500 drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                </span>
                <div className="text-sm p-2 text-blue-500">Вернуть</div>
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-medium mb-2">{detailTx.type==='incoming'?'Пополнение':'Списание'}</div>
                <div className="flex items-center gap-2"><span className="text-sm">Дебетовая карта</span></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-medium mb-2">Реквизиты</div>
                <div className="text-sm text-gray-500">Отправитель</div>
                <div>{detailTx.counterpartyName}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 