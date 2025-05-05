import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Account, Card, Transaction } from '../types/interface';
import { BorderCard } from './ui/BorderCard';
import { DateRangePicker } from './DateRangePicker';
import { setAccounts } from '../store/slices/accountSlice';
import users from '../../users.json';

interface DateRange {
  from: Date;
  to: Date;
}

export const TransactionGenerator: React.FC = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [avgPaymentAmount, setAvgPaymentAmount] = useState<number>(0);
  const [deltaPercent, setDeltaPercent] = useState<number>(0);
  const [dailyAmount, setDailyAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [autoPayment, setAutoPayment] = useState<boolean>(false);
  const [desiredBalance, setDesiredBalance] = useState<number>(0);

  // Получаем карты выбранного счета
  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
  const cards = selectedAccountData?.cards || [];

  // Сброс выбранной карты при смене счета
  useEffect(() => {
    setSelectedCard('');
  }, [selectedAccount]);

  // Расчет подсказки для ежемесячной суммы
  const monthlyAmount = dailyAmount * 30;

  const handleDateSelect = (range: DateRange) => {
    setStartDate(range.from);
    setEndDate(range.to);
    setShowDatePicker(false);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      
        <div className="flex flex-col gap-4">
        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <label className="text-sm font-medium text-gray-700">Выберите счет</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500"
              value={selectedAccount}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAccount(e.target.value)}
            >
              <option value="">Выберите счет</option>
              {accounts.map((account: Account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
          </div>
        </BorderCard>
        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <label className="text-sm font-medium text-gray-700">Выберите карту</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500"
              value={selectedCard}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCard(e.target.value)}
              disabled={!selectedAccount}
            >
              <option value="">Выберите карту</option>
              {cards.map((card: Card) => (
                <option key={card.id} value={card.id}>
                  {card.name} (*{card.cardNumber.slice(-4)})
                </option>
              ))}
            </select>
          </div>
        </BorderCard>
        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <label className="text-sm font-medium text-gray-700">Сумма ежедневных поступлений</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="bg-white w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              value={dailyAmount === 0 ? '' : dailyAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, '');
                setDailyAmount(value === '' ? 0 : Number(value));
              }}
            />
            <small className="text-gray-500">В среднем {monthlyAmount}₽ в месяц</small>
          </div>
        </BorderCard>
        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <label className="text-sm font-medium text-gray-700">Сумма одного поступления</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="bg-white w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              value={avgPaymentAmount === 0 ? '' : avgPaymentAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, '');
                setAvgPaymentAmount(value === '' ? 0 : Number(value));
              }}
            />
            <small className="text-gray-500">
              Сумма каждого платежа будет от {avgPaymentAmount - (avgPaymentAmount * deltaPercent / 100)}₽ 
              до {avgPaymentAmount + (avgPaymentAmount * deltaPercent / 100)}₽
            </small>
          </div>
        </BorderCard>
        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <label className="text-sm font-medium text-gray-700">Дельта платежа (%)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="bg-white w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              min="0"
              max="100"
              value={deltaPercent === 0 ? '' : deltaPercent}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, '');
                setDeltaPercent(value === '' ? 0 : Number(value));
              }}
            />
            <small className="text-gray-500">Разброс суммы платежа в процентах</small>
          </div>
        </BorderCard>
       

        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <label className="text-sm font-medium text-gray-700">Период генерации</label>
            <button 
              className="w-full p-3 border border-gray-200 rounded-xl text-left bg-white disabled:bg-gray-100 disabled:text-gray-500"
              onClick={() => setShowDatePicker(true)} 
              disabled={autoPayment}
            >
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </button>
            {showDatePicker && (
              <DateRangePicker
                onSelect={handleDateSelect}
                onClose={() => setShowDatePicker(false)}
                initialRange={{ from: startDate, to: endDate }}
              />
            )}
          </div>
        </BorderCard>
        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2">
            <input
        type="checkbox"
        className={`
            w-5 h-5 rounded-sm appearance-none 
            border border-gray-300 bg-white
            checked:bg-white checked:border-white
            checked:before:content-['✔'] checked:before:text-black 
            checked:before:block checked:before:text-center 
            checked:before:leading-5
        `}
        checked={autoPayment}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoPayment(e.target.checked)}
        />
              <label className="text-sm font-medium text-gray-700">
                Автоматическое пополнение ежедневно
              </label>
            </div>
            <small className="text-gray-500">Если включено, транзакции будут генерироваться до текущей даты</small>
          </div>
        </BorderCard>
        <BorderCard>
          <div className="flex flex-col gap-2 p-4">
            <label className="text-sm font-medium text-gray-700">Желаемая сумма остатка в месяц</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="bg-white w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              value={desiredBalance === 0 ? '' : desiredBalance}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, '');
                setDesiredBalance(value === '' ? 0 : Number(value));
              }}
            />
            <small className="text-gray-500">
              Фактический остаток может быть от {
                Math.round(desiredBalance * (1 - deltaPercent / 100))
              }₽ до {
                Math.round(desiredBalance * (1 + deltaPercent / 100))
              }₽
            </small>
          </div>
        </BorderCard>

          <button
              className="w-full h-14 flex justify-center items-center rounded-xl text-m font-light text-black bg-[#ffdd2d] hover:bg-[#ffd42d] disabled:opacity-50"
              disabled={!selectedAccount || !selectedCard || !avgPaymentAmount || !dailyAmount}
              onClick={() => {
                const account = accounts.find(acc => acc.id === selectedAccount);
                if (!account) return;

                const card = account.cards.find(c => c.id === selectedCard);
                if (!card) return;

                const newTransactions: Transaction[] = [];
                let currentDate = new Date(startDate);
                let currentBalance = card.balance;

                const roundTo50 = (val: number) => Math.round(val / 50) * 50;
                const desiredDaily = desiredBalance > 0 ? desiredBalance / 30 : 0;
                const dailyOutgoingTarget = roundTo50(Math.max(0, dailyAmount - desiredDaily));

                while (currentDate <= endDate) {
                  // Calculate number of incoming payments required
                  const paymentsNeeded = Math.ceil(dailyAmount / avgPaymentAmount);
                  let totalIncoming = 0;
                  const paymentBase = avgPaymentAmount;

                  for (let i = 0; i < paymentsNeeded; i++) {
                    const user = users[Math.floor(Math.random() * users.length)];

                    let amount = paymentBase;
                    if (deltaPercent > 0 && i !== paymentsNeeded - 1) {
                      const delta = paymentBase * deltaPercent / 100;
                      amount += (Math.random() * 2 - 1) * delta; // +/- delta
                    }

                    amount = roundTo50(amount);
                    // Ensure we don't exceed dailyAmount
                    if (i === paymentsNeeded - 1) {
                      amount = roundTo50(dailyAmount - totalIncoming);
                    }
                    totalIncoming += amount;

                    const randDate = new Date(currentDate);
                    randDate.setHours(Math.floor(Math.random()*24), Math.floor(Math.random()*60), 0, 0);
                    newTransactions.push({
                      id: `tr-${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                      amount,
                      type: 'incoming',
                      counterpartyName: user.name,
                      date: randDate.toISOString(),
                      cardNumber: user.cardNumber,
                      description: `Пополнение от ${user.name}`,
                      processingDate: randDate.toISOString(),
                      currency: account.currency,
                      bankName: user.bankName,
                      cardCurrency: account.currency
                    });
                    currentBalance += amount;
                  }

                  // --------- Генерация исходящих платежей -------------
                  if (dailyOutgoingTarget > 0) {
                    const outgoingNeeded = dailyOutgoingTarget;
                    const outPaymentsNeeded = Math.ceil(outgoingNeeded / avgPaymentAmount);
                    let totalOutgoing = 0;

                    for (let j = 0; j < outPaymentsNeeded; j++) {
                      const userOut = users[Math.floor(Math.random() * users.length)];

                      let amountOut = avgPaymentAmount;
                      if (deltaPercent > 0 && j !== outPaymentsNeeded - 1) {
                        const delta = avgPaymentAmount * deltaPercent / 100;
                        amountOut += (Math.random() * 2 - 1) * delta;
                      }

                      amountOut = roundTo50(amountOut);
                      if (j === outPaymentsNeeded - 1) {
                        amountOut = roundTo50(outgoingNeeded - totalOutgoing);
                      }
                      totalOutgoing += amountOut;

                      const randDateOut = new Date(currentDate);
                      randDateOut.setHours(Math.floor(Math.random()*24), Math.floor(Math.random()*60), 0, 0);
                      newTransactions.push({
                        id: `tr-${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                        amount: amountOut,
                        type: 'outgoing',
                        counterpartyName: userOut.name,
                        date: randDateOut.toISOString(),
                        cardNumber: userOut.cardNumber,
                        description: `Оплата ${userOut.name}`,
                        processingDate: randDateOut.toISOString(),
                        currency: account.currency,
                        bankName: userOut.bankName,
                        cardCurrency: account.currency
                      });
                      currentBalance -= amountOut;
                    }
                  }
                  // Next day
                  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
                }

                const updatedAccounts = accounts.map(acc => {
                  if (acc.id === selectedAccount) {
                    return {
                      ...acc,
                      cards: acc.cards.map(c => {
                        if (c.id === selectedCard) {
                          return {
                            ...c,
                            transactions: [...c.transactions, ...newTransactions],
                            balance: currentBalance
                          };
                        }
                        return c;
                      }),
                      balance: acc.balance + (currentBalance - card.balance)
                    };
                  }
                  return acc;
                });

                dispatch(setAccounts(updatedAccounts));
              }}
          >
            Сгенерировать транзакции
          </button>
        </div>
      
    </div>
  );
}; 