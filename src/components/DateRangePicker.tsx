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

    // Корректировка для недели, начинающейся с понедельника
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Добавляем дни предыдущего месяца
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Добавляем дни следующего месяца
    const remainingDays = 42 - days.length; // 6 недель по 7 дней
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handleDayClick = (date: Date) => {
    if (!selectedRange.from) {
      // Первый клик - устанавливаем начальную дату
      setSelectedRange({ from: date });
    } else if (!selectedRange.to) {
      // Второй клик - устанавливаем конечную дату
      // Определяем, какая дата раньше, а какая позже
      const isDateAfter = date > selectedRange.from;
      setSelectedRange({
        from: isDateAfter ? selectedRange.from : date,
        to: isDateAfter ? date : selectedRange.from
      });
    } else {
      // Если обе даты уже выбраны, начинаем новый выбор
      setSelectedRange({ from: date });
    }
  };

  const handleMonthClick = (monthIndex: number) => {
    const year = currentMonth.getFullYear();
    const from = new Date(year, monthIndex, 1);
    const to = new Date(year, monthIndex + 1, 0);
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
    const minDate = selectedRange.from < selectedRange.to ? selectedRange.from : selectedRange.to;
    const maxDate = selectedRange.from < selectedRange.to ? selectedRange.to : selectedRange.from;
    return date >= minDate && date <= maxDate;
  };

  const isSelected = (date: Date) => {
    return selectedRange.from?.getTime() === date.getTime() ||
           selectedRange.to?.getTime() === date.getTime();
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 w-[340px] max-w-full">
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
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthClick(index)}
                  className={`
                    p-2 rounded-xl text-sm focus:outline-none
                    ${currentMonth.getMonth() === index ? 'bg-[#ffd42d] text-gray-900' : 'bg-white text-gray-500 hover:bg-[#ffd42d]'}
                  `}
                >
                  {month}
                </button>
              ))}
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
              {getDaysInMonth(currentMonth).map(({ date, isCurrentMonth }, index) => (
                <button
                  key={index}
                  onClick={() => handleDayClick(date)}
                  className={`
                    h-10 w-10 bg-white rounded-full flex items-center justify-center text-sm focus:outline-none
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    ${isSelected(date) ? 'bg-[#ffd42d] text-gray-900' : ''}
                    ${isInRange(date) ? 'bg-[#ffd42d]' : ''}
                    ${!selectedRange.from && !isCurrentMonth ? 'opacity-50' : ''}
                    hover:bg-[#ffd42d]
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