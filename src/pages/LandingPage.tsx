import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpOnSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { APP_IS_DEMO } from '../config';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const telegram = APP_IS_DEMO === 'true' ? 'https://t.me/dmsios' : 'https://t.me/dtvappvisa';

  const TITLE = APP_IS_DEMO === 'true'
  ? 'Финансовый симулятор'
  : 'Подтверди свой доход и получи визу DTV';
  const DESCRIPTION = APP_IS_DEMO === 'true'
  ? 'Установите приложение, протестируйте создание банковского счёта, введите свои данные и получите демонстрационный PDF-отчёт. Отлично подходит для презентаций, UX-тестов и обучения.'
  : 'Скачай приложение, создай счет с нужной суммой, распечатай справку о своих доходах, она поможет подтвердить твои доходы в любых ситуациях.';

  const PRICE = APP_IS_DEMO === 'true'
  ? 'Попробуй бесплатно'
  : 'Всего 3000 THB';

  // Блок 2: Анонимность
  const BLOCK_2_TITLE = 'Анонимность и безопасность!';
  const BLOCK_2_TEXT = 'Все данные хранятся в вашем устройстве, не передаются на серверы.';

  // Блок 3: Финансовые возможности
  const BLOCK_3_TITLE = APP_IS_DEMO === 'true'
    ? 'Тестируйте гибкость симуляции!'
    : 'Покажи свои финансовые возможности!';

  const BLOCK_3_TEXT = APP_IS_DEMO === 'true'
    ? 'Создавайте счета с разными параметрами и суммами для демонстрации в учебных или UX целях.'
    : 'Создавай любые счета и суммы, покажи свои финансовые возможности.';

  // Блок 4: Документы
  const BLOCK_4_TITLE = APP_IS_DEMO === 'true'
    ? 'Генерируйте демо-документы!'
    : 'Подготовь все необходимые документы о доходах!';

  const BLOCK_4_TEXT = APP_IS_DEMO === 'true'
    ? 'Создайте и скачайте демонстрационные справки о доходах и расходах для проверки или презентации.'
    : 'Будь готов к любым ситуациям, скачай справки о доходах и расходах, а также другие документы.';

  // Блок 5: Демонстрация
  const BLOCK_5_TITLE = APP_IS_DEMO === 'true'
    ? 'Презентуйте приложение в действии!'
    : 'Показывайте приложение!';

  const BLOCK_5_TEXT = APP_IS_DEMO === 'true'
    ? 'Используйте приложение в демо-режиме, чтобы визуально представить возможности финансового интерфейса.'
    : 'Если понадобится, вы всегда можете показать приложение с вашими доходами.';
    
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const iosStandalone = (window.navigator as any).standalone;
    const isPWA = standalone || iosStandalone;
    
    setIsStandalone(isPWA);
    
    if (isPWA) {
      console.log('App is running as PWA, redirecting to login');
      navigate('/login');
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('Received beforeinstallprompt event');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    window.addEventListener('appinstalled', () => {
      console.log('App was installed');
      setDeferredPrompt(null);
      setIsInstallable(false);
      // Даем время на завершение установки
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [navigate]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      
      <header className="px-6 pt-6 flex items-center gap-3">
          <img src={"/logos/Tb-Logo.png"} alt="Wallet" className="w-10 h-10" />
          <h1 className="text-3xl font-bold">Tь-Wallet</h1>
      </header>

      {/* Main content */}
      <main className="px-6 py-12">
        <div className="max-w-lg mx-auto space-y-8">
          <div className="bg-[#E2E8F0] rounded-xl backdrop-blur-lg space-y-4">
          <div className="px-10 pt-5 space-y-4">
            <h2 className="text-3xl font-bold">
            {TITLE}
            </h2>
            <p className="text-lg text-gray-500">
              {DESCRIPTION}
            </p>
            <p className="inline-block bg-[#ffdd2d] px-4 py-2 rounded-full text-lg font-medium text-gray-700 shadow-sm">
              {PRICE}
            </p>

            </div>
              
            <img src={"/logos/Head.avif"} alt="Tь-Wallet" className="w-full " />
          </div>

          <div className="bg-[#E2E8F0] rounded-xl backdrop-blur-lg space-y-4">
            <div className="px-10 pt-5 space-y-4">
              <h2 className="text-3xl font-bold">
              {BLOCK_2_TITLE}
              </h2>
              <p className="text-lg text-gray-500">
              {BLOCK_2_TEXT}
              </p>
            </div>
              <img src={"/logos/Private.avif"} className="w-full rounded-b-xl" />
          </div>


          <div className="bg-[#E2E8F0] rounded-xl backdrop-blur-lg space-y-4">
            <div className="px-10 pt-5 space-y-4">
              <h2 className="text-3xl font-bold">
              {BLOCK_3_TITLE}
              </h2>
              <p className="text-lg text-gray-500">
              {BLOCK_3_TEXT}
              </p>
             
            </div>
              <img src={"/logos/money.avif"} className="w-full h-full pb-5" />
          </div>

            <div className="bg-gradient-to-b from-[#f4f4b1] to-[#ffdd2d] rounded-xl backdrop-blur-lg space-y-4">
              <div className="px-10 pt-5 space-y-4">
                <h2 className="text-3xl font-bold">
                {BLOCK_4_TITLE}
                </h2>
                <p className="text-lg text-gray-700">
                {BLOCK_4_TEXT}
                </p>
              </div>
                <img src={"/logos/bank_statment.avif"} className="w-full h-full" />
            </div>

            <div className="bg-[#E2E8F0] rounded-xl backdrop-blur-lg space-y-4">
              <div className="px-10 pt-5 space-y-4">
                <h2 className="text-3xl font-bold">
                {BLOCK_5_TITLE}
                </h2>
                <p className="text-lg text-gray-500">
                {BLOCK_5_TEXT}
                </p>
              </div>
                <img src={"/logos/ShowApp.avif"} className="w-full px-10" />
            </div>
          {/* Features */}
         

          {/* Installation button */}
          {isInstallable && (
             <div className="bg-[#E2E8F0] rounded-xl backdrop-blur-lg space-y-4">
             <img src={"/logos/Tb-Wallet.png"} className="w-full p-4" />
           <div className="px-10 pb-10 space-y-4">
           <button
              onClick={handleInstallClick}
              className="w-full bg-[#ffdd2d] text-gray-800 p-4 rounded-full font-medium text-lg hover:bg-yellow-300 transition-colors"
            >
              Установить приложение
            </button>
           </div>
           </div>
    
           
          )}



          {/* Installation instructions */}
          {!isInstallable && !isStandalone && (
            <div className="bg-[#E2E8F0] rounded-xl backdrop-blur-lg space-y-4">
              <img src={"/logos/Tb-Wallet.png"} className="w-full p-4" />
            <div className="px-10 pb-10 space-y-4">
              <h2 className="text-3xl font-bold">
              Как установить приложение?
              </h2>
              <div className="space-y-2">
                
              <p>1. Нажмите на кнопку <ArrowUpOnSquareIcon className="w-6 h-6 text-gray-700 inline-block"/> в браузере</p>
              <p>2. Выберите "Добавить на главный экран" <PlusIcon className="w-6 h-6 text-gray-700 inline-block"/></p>
              <p>3. Готово! Используйте Tь-Wallet как обычное приложение</p>
            </div>
            </div>
          </div>
          )}
          <button
              onClick={() => window.open(telegram, "_blank")} 
              className="w-full bg-[#ffdd2d] text-gray-800 p-4 rounded-full font-medium text-lg hover:bg-yellow-300 transition-colors"
            >
              Остались вопросы?
            </button>
        </div>
      </main>
    </div>
  );
}; 