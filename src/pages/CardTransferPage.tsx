import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { LocalStorageService } from '../services/localStorageService';
import { BankSelect } from '../components/BankSelect';

export const CardTransferPage = () => {
  const navigate = useNavigate();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  
  // Находим все карты рублевого счета
  const rubleAccount = accounts.find(acc => acc.currency === 'RUB');
  const cards = rubleAccount?.cards || [];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [senderName, setSenderName] = useState('');
  const [showSenderName, setShowSenderName] = useState(false);
  const [selectedBank, setSelectedBank] = useState<{ id: number; name: string; index: string } | null>(null);

  // Форматирование номера карты в формат **** **** **** ****
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // 16 цифр + 3 пробела
      setCardNumber(formatted);
      setShowSenderName(formatted.length === 19);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTransfer = async (type: 'incoming' | 'outgoing') => {
    if (!cardNumber || !amount || !senderName || !rubleAccount) return;

    const currentCard = cards[currentCardIndex];
    const now = new Date().toISOString();
    
    try {
      await LocalStorageService.getInstance().addTransaction(
        rubleAccount.id,
        currentCard.id,
        {
          amount: parseFloat(amount),
          type: type,
          counterpartyName: senderName,
          date: now,
          cardNumber: cardNumber.replace(/\s/g, ''),
          description: `Пополнение с карты ${cardNumber}`,
          processingDate: now,
          currency: 'RUB',
          bankName: selectedBank?.name,
          cardCurrency: 'RUB'
        }
      );

      // Возвращаемся назад после успешного перевода
      navigate(-1);
    } catch (error) {
      console.error('Error making transfer:', error);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(balance);
  };

  const handleCardSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else if (direction === 'right' && currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="ml-2 text-xl">По номеру карты</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-20">
        {/* Card input section */}
        <div className="bg-white rounded-2xl p-4">
          <input
            type="text"
            placeholder="Номер карты"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none"
            maxLength={19}
          />
        </div>

        {/* Bank select */}


        <div className="bg-white rounded-2xl p-4">
            <label className="block">
              <span className="text-sm text-gray-500">Банк отправителя</span>
              <div className="bg-white rounded-3xl shadow-sm">
          <BankSelect
            onSelect={(bank) => setSelectedBank(bank)}
            className="bg-white w-full"
          />
        </div>
            </label>
          </div>
       

        {/* Sender name input (показывается после ввода номера карты) */}
        {showSenderName && (
          <div className="bg-white rounded-2xl p-4">
            <input
              type="text"
              placeholder="ФИО отправителя"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none"
            />
          </div>
        )}

        {/* Balance display */}
        {cards.length > 0 && (
          <div 
            className="bg-gray-900 text-white rounded-3xl p-6"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startX = touch.clientX;
              const handleTouchEnd = (e: TouchEvent) => {
                const endX = e.changedTouches[0].clientX;
                if (endX - startX > 50) {
                  handleCardSwipe('right');
                } else if (startX - endX > 50) {
                  handleCardSwipe('left');
                }
              };
              document.addEventListener('touchend', handleTouchEnd, { once: true });
            }}
          >
            <p className="text-gray-400 text-sm">на {cards[currentCardIndex].name}</p>
            <p className="text-2xl font-medium mt-1">{formatBalance(cards[currentCardIndex].balance)}</p>
          </div>
        )}

        {/* Card indicators */}
        {cards.length > 0 && (
          <div className="flex justify-center gap-2">
            {cards.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentCardIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Amount input */}
        <div className="bg-white rounded-2xl p-4">
          <input
            type="text"
            placeholder="Сумма, ₽"
            value={amount}
            onChange={handleAmountChange}
            className="w-full bg-gray-50 rounded-xl p-4 text-lg outline-none"
          />
        </div>

        {/* Transfer button */}
        <button 
          className={`rounded-xl py-4 px-6 text-lg font-medium mt-auto ${
            cardNumber && amount && (!showSenderName || senderName)
              ? 'bg-yellow-400 text-black'
              : 'bg-gray-200 text-gray-500'
          }`}
          disabled={!cardNumber || !amount || (showSenderName && !senderName)}
          onClick={() => handleTransfer('incoming')}
        >
          Перевести
        </button>
      </div>
    </div>
  );
}; 