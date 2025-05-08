import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearAuth, setPassword, setIsLoggedIn } from '../store/slices/authSlice';
import { fetchAccounts } from '../store/slices/accountSlice';
import { RootState, AppDispatch } from '../store';
import { useDeviceId } from '../hooks/useDeviceId';
import { useSession } from '../hooks/useSession';
import { storageService } from '../services/storageService';

// Импортируем все страницы
import { LoginPage } from '../pages/LoginPage';
import { PasswordPage } from '../pages/PasswordPage';
import { HomePage } from '../pages/HomePage';
import { TopUpPage } from '../pages/TopUpPage';
import { CardTransferPage } from '../pages/CardTransferPage';
import { MorePage } from '../pages/MorePage';
import { AddAccountPage } from '../pages/AddAccountPage';
import { NewAccountPage } from '../pages/NewAccountPage';
import { NewCardPage } from '../pages/NewCardPage';
import { LandingPage } from '../pages/LandingPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { Layout } from './Layout';
import { AccountDetailsPage } from '../pages/AccountDetailsPage';
import { TransactionGenerator } from './TransactionGenerator';
import { StatementPage } from '../pages/StatementPage';
import { StatementCreatedPage } from '../pages/StatementCreatedPage';

// Временные компоненты для табов
const PaymentsPage = () => <div className="p-4">Страница платежей</div>;
const CityPage = () => <div className="p-4">Страница города</div>;
const ChatPage = () => <div className="p-4">Страница чата</div>;

// Временные компоненты для меню
const AtmsPage = () => <div className="p-4">Страница банкоматов</div>;
const SecurityPage = () => <div className="p-4">Страница безопасности</div>;
const OrdersPage = () => <div className="p-4">Страница заказов</div>;
const CertificatesPage = () => <div className="p-4">Страница справок</div>;
const SupportPage = () => <div className="p-4">Страница обращений</div>;
const SettingsPage = () => <div className="p-4">Страница настроек</div>;
const SharedAccessPage = () => <div className="p-4">Страница совместного доступа</div>;
const ServicesPage = () => <div className="p-4">Страница сервисов</div>;

// Функция для определения, запущено ли приложение в браузере
const isBrowser = () => {
  // В режиме разработки всегда показываем полное приложение
/*  if (import.meta.env.DEV) {
    return false;
  }
*/

  // Проверяем все возможные признаки PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone;
  const isPWA = isStandalone || isIOSStandalone;
  
  // Если это НЕ PWA - значит это браузер
  return !isPWA;
};

export const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const deviceId = useDeviceId();
  const [isInitialized, setIsInitialized] = useState(false);

  // Используем хук для управления сессией
  useSession();

  useEffect(() => {
    const init = async () => {
      // Если это браузер, не инициализируем приложение
      if (isBrowser()) {
        setIsInitialized(true);
        return;
      }

      try {
        // Загружаем счета
        await dispatch(fetchAccounts()).unwrap();

        const [storedDeviceId, storedUserId, storedIsLoggedIn, storedPhone, storedPassword, storedFullName] = await Promise.all([
        storageService.getItem<string>('deviceId'),
        storageService.getItem<string>('userId'),
        storageService.getItem<boolean>('isLoggedIn'),
        storageService.getItem<string>('phone'),
          storageService.getItem<string>('password'),
          storageService.getItem<string>('full_name')
      ]);

      console.log('Initializing app with state:', {
        storedDeviceId,
        storedUserId,
        storedIsLoggedIn,
        storedPhone,
        storedPassword,
          storedFullName,
        currentDeviceId: deviceId,
        currentIsLoggedIn: isLoggedIn
      });

      // Если пользователь уже авторизован в Redux, не делаем ничего
      if (isLoggedIn) {
        setIsInitialized(true);
        return;
      }

      // Если у нас есть сохраненные данные пользователя
      if (storedDeviceId && storedUserId && storedPhone) {
        // Проверяем, что deviceId совпадает
        if (storedDeviceId === deviceId) {
          // Данные валидны, загружаем пользователя в Redux
            dispatch(setUser({ 
              id: storedUserId, 
              phone: storedPhone, 
              deviceId: storedDeviceId,
              full_name: storedFullName || '' 
            }));
            
            // Если есть сохраненный пароль, передаем его в Redux
            if (storedPassword) {
              dispatch(setPassword(storedPassword));
            }
            
            if (storedIsLoggedIn) {
              dispatch(setIsLoggedIn(true));
            } else {
            // Если пользователь не авторизован, запрашиваем пароль
            navigate('/password');
            }
        } else {
          // Если deviceId не совпадает, сбрасываем авторизацию
          dispatch(clearAuth());
          navigate('/login');
        }
      } else {
        // Если нет сохраненных данных, показываем страницу входа
        navigate('/login');
      }
      } catch (error) {
        console.error('Error initializing app:', error);
        // В случае ошибки показываем страницу входа
        navigate('/login');
      } finally {
      setIsInitialized(true);
      }
    };

    init();
  }, [dispatch, deviceId, navigate, isLoggedIn]);

  // Показываем лоадер, пока приложение инициализируется
  if (!isInitialized) {
    return null;
  }

  // Если это браузер, показываем только лендинг
  if (isBrowser()) {
    console.log('Running in browser, showing landing page');
    return (
      <Routes>
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  }

  // Для мобильного приложения показываем все маршруты
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/home" />} />
      <Route path="/password" element={!isLoggedIn ? <PasswordPage /> : <Navigate to="/home" />} />
      
      {/* Защищенные маршруты */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={isLoggedIn ? <HomePage /> : <Navigate to="/password" />} />
        <Route path="top-up/:accountId" element={isLoggedIn ? <TopUpPage /> : <Navigate to="/password" />} />
        <Route path="card-transfer/:accountId" element={isLoggedIn ? <CardTransferPage /> : <Navigate to="/password" />} />
        <Route path="transactions/generate" element={isLoggedIn ? <TransactionGenerator /> : <Navigate to="/password" />} />
        <Route path="transactions/:accountId" element={isLoggedIn ? <TransactionsPage /> : <Navigate to="/password" />} />
        <Route path="payments" element={isLoggedIn ? <PaymentsPage /> : <Navigate to="/password" />} />
        <Route path="city" element={isLoggedIn ? <CityPage /> : <Navigate to="/password" />} />
        <Route path="chat" element={isLoggedIn ? <ChatPage /> : <Navigate to="/password" />} />
        <Route path="more" element={isLoggedIn ? <MorePage /> : <Navigate to="/password" />} />
        <Route path="add-account" element={isLoggedIn ? <AddAccountPage /> : <Navigate to="/password" />} />
        <Route path="add-account/new-account" element={isLoggedIn ? <NewAccountPage /> : <Navigate to="/password" />} />
        <Route path="add-card/:accountId" element={isLoggedIn ? <NewCardPage /> : <Navigate to="/password" />} />
        <Route path="account/:accountId" element={isLoggedIn ? <AccountDetailsPage /> : <Navigate to="/password" />} />
        <Route path="statement/:accountId" element={isLoggedIn ? <StatementPage /> : <Navigate to="/password" />} />
        <Route path="statement-created" element={isLoggedIn ? <StatementCreatedPage onSendEmail={()=>{}} onDone={()=>{}} /> : <Navigate to="/password" />} />
        
        {/* Новые маршруты для меню */}
        <Route path="atms" element={isLoggedIn ? <AtmsPage /> : <Navigate to="/password" />} />
        <Route path="security" element={isLoggedIn ? <SecurityPage /> : <Navigate to="/password" />} />
        <Route path="orders" element={isLoggedIn ? <OrdersPage /> : <Navigate to="/password" />} />
        <Route path="certificates" element={isLoggedIn ? <CertificatesPage /> : <Navigate to="/password" />} />
        <Route path="support" element={isLoggedIn ? <SupportPage /> : <Navigate to="/password" />} />
        <Route path="settings" element={isLoggedIn ? <SettingsPage /> : <Navigate to="/password" />} />
        <Route path="shared-access" element={isLoggedIn ? <SharedAccessPage /> : <Navigate to="/password" />} />
        <Route path="services" element={isLoggedIn ? <ServicesPage /> : <Navigate to="/password" />} />
      </Route>

      {/* Редирект на страницу входа для неизвестных маршрутов */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}; 