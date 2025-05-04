import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Account } from '../types/interface';
import { BorderCard } from './ui/BorderCard';
import { DateRangePicker } from './DateRangePicker';

interface DateRange {
  from: Date;
  to: Date;
}

export const TransactionGenerator: React.FC = () => {
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [avgPaymentAmount, setAvgPaymentAmount] = useState<number>(0);
  const [deltaPercent, setDeltaPercent] = useState<number>(0);
  const [dailyAmount, setDailyAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [autoPayment, setAutoPayment] = useState<boolean>(false);
  const [desiredBalance, setDesiredBalance] = useState<number>(0);

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
            <label className="text-sm font-medium text-gray-700">Средняя сумма одного платежа</label>
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
              disabled={!selectedAccount}
            onClick={() => {
              // TODO: Implement generation logic
              console.log('Generating transactions...');
            }}
          >
            Сгенерировать транзакции
          </button>
        </div>
      
    </div>
  );
}; 