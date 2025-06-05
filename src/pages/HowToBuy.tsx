import { useEffect, useState } from "react";
import { storageService } from "../services/storageService";
import { Header } from "../components/ui/Header";
import { APP_IS_DEMO } from "../config";

export const HowToBuy = () => {
  const [deviceId, setDeviceId] = useState<string>("");
  const [showCopied, setShowCopied] = useState(false);
  const telegram = APP_IS_DEMO === 'true' ? 'https://t.me/dmsios' : 'https://t.me/dtvappvisa';

  useEffect(() => {
    storageService.getItem<string>("deviceId").then(id => setDeviceId(id || ""));
  }, []);

  const handleCopy = async () => {
    if (deviceId) {
      try {
        // Создаем временный input элемент
        const tempInput = document.createElement('input');
        tempInput.value = deviceId;
        document.body.appendChild(tempInput);
        
        // Выбираем текст
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // Для мобильных устройств
        
        // Пытаемся скопировать
        const successful = document.execCommand('copy');
        
        // Удаляем временный элемент
        document.body.removeChild(tempInput);
        
        if (successful) {
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 1000);
        }
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Как купить лицензию Tь-Wallet" />
      
      <div className="flex-1 p-12 mt-16 pb-24">
        <ol className="list-decimal space-y-4 mb-4 text-sm">
          <li className="relative">
            Скопируйте ваш UID:
              <span 
                className="font-mono bg-gray-200 px-2 py-1 rounded break-all cursor-pointer hover:bg-gray-300 transition-colors" 
                onClick={handleCopy}
              >
                {deviceId}
              </span>
              {showCopied && (
                <div className="absolute top-8 z-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm">
                  Скопировано
                </div>
              )}
          </li>
          <li>
            Отправьте нам скопированный UID
          </li>
          <li>
            Получите номер кошелька для оплаты в Monero
          </li>
          <li>
            Оплатите лицензию
          </li>
          <li>
            Отправьте скриншот оплаты
          </li>
          <li>
            Получите код и введите его на предыдущем экране. 
          </li>
        </ol>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gray-50">
        <button 
          onClick={() => window.open(telegram, "_blank")} 
          className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-[#ffdd2d] hover:bg-[#ffd42d]"
        >
          Написать нам
        </button>
      </div>
    </div>
  );
}; 