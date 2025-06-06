import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts } from '../store/slices/accountSlice';
import { RootState, AppDispatch } from '../store';
import { useDeviceId } from '../hooks/useDeviceId';
import { useSession } from '../hooks/useSession';
import { storageService } from '../services/storageService';
import { setUser, setPassword, setIsLoggedIn } from '../store/slices/authSlice';


// Импортируем все страницы
import { LoginPage } from '../pages/LoginPage';
import { PasswordPage } from '../pages/PasswordPage';
import { HomePage } from '../pages/HomePage';
import { TopUpPage } from '../pages/TopUpPage';
import { CardTransferPage } from '../pages/CardTransferPage';
import { MorePage } from '../pages/MorePage';
import { AddAccountPage } from '../pages/AddAccountPage';
import { AccountPage } from '../pages/AccountPage';
import { NewCardPage } from '../pages/NewCardPage';
import { LandingPage } from '../pages/LandingPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { Layout } from './Layout';
import { AccountDetailsPage } from '../pages/AccountDetailsPage';
import { TransactionGenerator } from '../pages/TransactionGenerator';
import { StatementPage } from '../pages/StatementPage';
import { StatementCreatedPage } from '../pages/StatementCreatedPage';
import { ChatPage } from '../pages/ChatPage';
import { CityPage } from '../pages/CityPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { HowToBuy } from '../pages/HowToBuy';
import { UserProfile } from '../pages/UserProfile';
import { PromotionCards } from '../components/PromotionCards';

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
  const location = useLocation();
  const { isLoggedIn, demoMode } = useSelector((state: RootState) => state.auth);
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

        const [storedDeviceId, storedUserId, storedIsLoggedIn, storedPhone, storedPassword, storedFullName, storedAddress, storedEmail, licenseValid] = await Promise.all([
        storageService.getItem<string>('deviceId'),
        storageService.getItem<string>('userId'),
        storageService.getItem<boolean>('isLoggedIn'),
        storageService.getItem<string>('phone'),
        storageService.getItem<string>('password'),
        storageService.getItem<string>('full_name'),
        storageService.getItem<string>('address'),
        storageService.getItem<string>('email'),
        storageService.getItem<boolean>('license_valid')
      ]);

      console.log('Initializing app with state:', {
        storedDeviceId,
        storedUserId,
        storedIsLoggedIn,
        storedPhone,
        storedPassword,
        storedFullName,
        licenseValid,
        currentDeviceId: deviceId,
        currentIsLoggedIn: isLoggedIn
      });

      // Если пользователь уже авторизован в Redux, не делаем ничего
      if (isLoggedIn) {
        setIsInitialized(true);
        return;
      }
     
      // Если лицензии нет и не demoMode, и мы не на /login и не на /how-to-buy — редиректим на /login
      if (!licenseValid && !demoMode && location.pathname !== '/login' && location.pathname !== '/how-to-buy') {
        setIsInitialized(true);
        
        navigate('/login');

        return;
      }

      
      // Если у нас есть сохраненные данные пользователя
      if (storedDeviceId && licenseValid) {
        // Проверяем, что deviceId совпадает
        if (storedDeviceId === deviceId) {
          // Данные валидны, загружаем пользователя в Redux
            dispatch(setUser({ 
              id: storedUserId || '', 
              phone: storedPhone || '', 
              deviceId: storedDeviceId || '',
              full_name: storedFullName || '',
              email: storedEmail || '',
              address: storedAddress || ''
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
        }
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
  }, [dispatch, deviceId, navigate, isLoggedIn, demoMode, location.pathname]);

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
      <Route path="/how-to-buy" element={<HowToBuy />} />
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
        <Route path="add-account/new-account" element={isLoggedIn ? <AccountPage /> : <Navigate to="/password" />} />
        <Route path="add-account/:accountId" element={isLoggedIn ? <AccountPage /> : <Navigate to="/password" />} />
        <Route path="add-card/:accountId" element={isLoggedIn ? <NewCardPage /> : <Navigate to="/password" />} />
        <Route path="account/:accountId" element={isLoggedIn ? <AccountDetailsPage /> : <Navigate to="/password" />} />
        <Route path="statement/:accountId" element={isLoggedIn ? <StatementPage /> : <Navigate to="/password" />} />
        <Route path="statement-created" element={isLoggedIn ? <StatementCreatedPage onSendEmail={()=>{}} onDone={()=>{}} /> : <Navigate to="/password" />} />
        <Route path="chat" element={isLoggedIn ? <ChatPage /> : <Navigate to="/password" />} />
        <Route path="user-profile" element={isLoggedIn ? <UserProfile /> : <Navigate to="/password" />} />
        <Route path="promotions" element={isLoggedIn ? <PromotionCards /> : <Navigate to="/password" />} />
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