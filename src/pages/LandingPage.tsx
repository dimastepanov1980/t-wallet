import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
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
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      {/* Header */}
      <header className="p-6">
        <h1 className="text-3xl font-bold">T-Wallet</h1>
      </header>

      {/* Main content */}
      <main className="px-6 py-12">
        <div className="max-w-lg mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">
              Управляйте финансами в любой валюте
            </h2>
            <p className="text-xl text-blue-100">
              Удобное приложение для управления счетами и картами с поддержкой нескольких валют
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-6">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-lg">
              <h3 className="font-semibold text-xl mb-2">🌍 Мультивалютность</h3>
              <p>Поддержка рублей, долларов и евро</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-lg">
              <h3 className="font-semibold text-xl mb-2">💳 Управление картами</h3>
              <p>Добавляйте карты Visa, Mastercard и МИР</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-lg">
              <h3 className="font-semibold text-xl mb-2">📊 Аналитика</h3>
              <p>Отслеживайте расходы и доходы</p>
            </div>
          </div>

          {/* Installation button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="w-full bg-yellow-400 text-black p-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              Установить приложение
            </button>
          )}

          {/* Installation instructions */}
          {!isInstallable && !isStandalone && (
            <div className="bg-yellow-400 text-black p-6 rounded-xl space-y-4">
              <h3 className="text-xl font-bold">Установите приложение</h3>
              <div className="space-y-2">
                <p>1. Нажмите на кнопку "Поделиться" в браузере</p>
                <p>2. Выберите "Добавить на главный экран"</p>
                <p>3. Готово! Используйте T-Wallet как обычное приложение</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}; 