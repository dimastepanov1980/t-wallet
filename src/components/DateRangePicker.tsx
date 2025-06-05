import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DateRangePickerProps {
  onClose: () => void;
  onSelect: (range: { from: Date; to: Date }) => void;
  initialMonth?: Date;
  initialRange?: { from: Date; to: Date };
}

export const DateRangePicker = ({ 
  onClose, 
  onSelect, 
  initialMonth = new Date(),
  initialRange
}: DateRangePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>(initialRange || {});
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    const now = new Date();

    // Корректировка для недели, начинающейся с понедельника
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Добавляем дни предыдущего месяца
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isDisabled: day > now
      });
    }

    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({
        date: day,
        isCurrentMonth: true,
        isDisabled: day > now
      });
    }

    // Добавляем дни следующего месяца
    const remainingDays = 42 - days.length; // 6 недель по 7 дней
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isDisabled: day > now
      });
    }

    return days;
  };

  const handleDayClick = (date: Date) => {
    console.log('Current selectedRange:', selectedRange);
    console.log('Clicked date:', date);

    if (!selectedRange.from) {
      // Первый клик - устанавливаем начальную дату
      console.log('Setting initial date', date);

      setSelectedRange({ from: date });
    } else if (!selectedRange.to) {
      console.log('Setting end date', date);

      const isDateAfter = date > selectedRange.from;
      setSelectedRange({
        from: isDateAfter ? selectedRange.from : date,
        to: isDateAfter ? date : selectedRange.from
      });
    } else {
      // Если обе даты уже выбраны, начинаем новый выбор
      console.log('Resetting range with new initial date');
      setSelectedRange({ from: date });
    }
  };

  const handleMonthClick = (monthIndex: number) => {
    const year = currentMonth.getFullYear();
    const from = new Date(year, monthIndex, 1);
    const to = new Date(year, monthIndex + 1, 0);
    const now = new Date();
    
    // Проверяем, не является ли выбранный месяц будущим
    if (from > now) {
      return;
    }
    
    setSelectedRange({ from, to });
    setCurrentMonth(from);
    setShowMonthPicker(false);
  };

  const handleReset = () => {
    setSelectedRange({});
  };

  const handleApply = () => {
    if (selectedRange.from) {
      onSelect({
        from: selectedRange.from,
        to: selectedRange.to || selectedRange.from
      });
      onClose();
    }
  };

  const isInRange = (date: Date) => {
    if (!selectedRange.from || !selectedRange.to) return false;
    
    // Нормализуем даты, убирая время
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedFrom = new Date(
      selectedRange.from.getFullYear(),
      selectedRange.from.getMonth(),
      selectedRange.from.getDate()
    );
    const normalizedTo = new Date(
      selectedRange.to.getFullYear(),
      selectedRange.to.getMonth(),
      selectedRange.to.getDate()
    );

    // Определяем начальную и конечную даты диапазона
    const start = normalizedFrom < normalizedTo ? normalizedFrom : normalizedTo;
    const end = normalizedFrom < normalizedTo ? normalizedTo : normalizedFrom;

    return normalizedDate >= start && normalizedDate <= end;
  };

  const isSelected = (date: Date) => {
    if (!selectedRange.from && !selectedRange.to) return false;

    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedFrom = selectedRange.from && new Date(
      selectedRange.from.getFullYear(),
      selectedRange.from.getMonth(),
      selectedRange.from.getDate()
    );
    const normalizedTo = selectedRange.to && new Date(
      selectedRange.to?.getFullYear(),
      selectedRange.to?.getMonth(),
      selectedRange.to?.getDate()
    );

    return (
      normalizedFrom?.getTime() === normalizedDate.getTime() ||
      normalizedTo?.getTime() === normalizedDate.getTime()
    );
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1);
    const now = new Date();
    
    // Проверяем, не пытаемся ли мы перейти к будущему месяцу
    if (newMonth > now) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-2xl p-4 w-[340px] max-w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className='bg-white focus:outline-none'>
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={() => setShowMonthPicker(!showMonthPicker)} 
            className="bg-white text-lg font-medium px-4 py-1 rounded-full focus:outline-none"
          >
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </button>
          <button onClick={() => changeMonth(1)} className='bg-white focus:outline-none'>
            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {showMonthPicker ? (
          <div className="mb-4">
            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((month, index) => {
                const year = currentMonth.getFullYear();
                const monthDate = new Date(year, index, 1);
                const now = new Date();
                const isFutureMonth = monthDate > now;
                
                return (
                  <button
                    key={month}
                    onClick={() => !isFutureMonth && handleMonthClick(index)}
                    disabled={isFutureMonth}
                    className={`
                      p-2 rounded-xl text-sm focus:outline-none
                      ${currentMonth.getMonth() === index ? 'bg-[#ffd42d] text-gray-900' : 'bg-white text-gray-500 hover:bg-[#ffd42d]'}
                      ${isFutureMonth ? 'opacity-30 cursor-not-allowed' : ''}
                    `}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Week days */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map(({ date, isCurrentMonth, isDisabled }, index) => (
                <button
                  key={index}
                  onClick={() => !isDisabled && handleDayClick(date)}
                  disabled={isDisabled}
                  className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-xs focus:outline-none
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    ${
                      isSelected(date)
                        ? 'bg-[#ffd42d] text-gray-900 font-medium'
                        : isInRange(date)
                        ? 'bg-[#fff3b0] text-gray-900'
                        : 'bg-white'
                    }
                    ${!selectedRange.from && !isCurrentMonth ? 'opacity-50' : ''}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#ffd42d] transition-colors'}
                  `}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        {!showMonthPicker && (
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white text-gray-600 hover:bg-gray-200 rounded focus:outline-none"
            >
              Сбросить
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedRange.from}
              className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-[#ffd42d] focus:outline-none disabled:opacity-50 disabled:hover:bg-white"
            >
              Готово
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 