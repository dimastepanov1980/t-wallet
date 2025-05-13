import { useEffect, useState } from "react";
import { storageService } from "../services/storageService";

export const HowToBuy = () => {
  const [deviceId, setDeviceId] = useState<string>("");

  useEffect(() => {
    storageService.getItem<string>("deviceId").then(id => setDeviceId(id || ""));
  }, []);

  const handleCopy = () => {
    if (deviceId) {
      navigator.clipboard.writeText(deviceId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Как купить лицензию</h2>
        <ol className="list-decimal pl-5 mb-4 text-sm">
          <li>
            Скопируйте ваш код устройства:
            <div className="flex items-center mt-2 mb-2">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded break-all">{deviceId}</span>
              <button onClick={handleCopy} className="ml-2 text-blue-600 underline">Скопировать</button>
            </div>
          </li>
          <li>
            Отправьте <b>0.1 XMR</b> на адрес:<br />
            <span className="font-mono text-xs break-all">48asfA... (Monero-адрес)</span>
          </li>
          <li>
            Отправьте UID и подтверждение оплаты разработчику в <a href="https://t.me/your_telegram" className="text-blue-600 underline">Telegram</a>
          </li>
          <li>
            Получите лицензионный код и введите его на предыдущем экране
          </li>
        </ol>
        <button onClick={() => window.history.back()} className="w-full bg-gray-200 text-black py-2 rounded">Назад</button>
      </div>
    </div>
  );
}; 