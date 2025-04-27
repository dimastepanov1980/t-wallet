import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../services/firebase';
import { setUser, clearAuth, setIsLoggedIn } from '../store/slices/authSlice';
import { RootState } from '../store';
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
import { Layout } from './Layout';

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
  return typeof window !== 'undefined' && !(window.navigator as any).standalone;
};

export const AppRoutes = () => {
  const dispatch = useDispatch();
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

      const [storedDeviceId, storedUserId, storedIsLoggedIn, storedPhone] = await Promise.all([
        storageService.getItem<string>('deviceId'),
        storageService.getItem<string>('userId'),
        storageService.getItem<boolean>('isLoggedIn'),
        storageService.getItem<string>('phone')
      ]);

      console.log('Initializing app with state:', {
        storedDeviceId,
        storedUserId,
        storedIsLoggedIn,
        storedPhone,
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
          dispatch(setUser({ id: storedUserId, phone: storedPhone, deviceId: storedDeviceId }));
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

      setIsInitialized(true);
    };

    init();
  }, [dispatch, deviceId, navigate, isLoggedIn]);

  // Показываем лоадер, пока приложение инициализируется
  if (!isInitialized) {
    return null;
  }

  // Если это браузер, показываем только лендинг
  if (isBrowser()) {
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
        <Route path="top-up" element={isLoggedIn ? <TopUpPage /> : <Navigate to="/password" />} />
        <Route path="card-transfer" element={isLoggedIn ? <CardTransferPage /> : <Navigate to="/password" />} />
        <Route path="payments" element={isLoggedIn ? <PaymentsPage /> : <Navigate to="/password" />} />
        <Route path="city" element={isLoggedIn ? <CityPage /> : <Navigate to="/password" />} />
        <Route path="chat" element={isLoggedIn ? <ChatPage /> : <Navigate to="/password" />} />
        <Route path="more" element={isLoggedIn ? <MorePage /> : <Navigate to="/password" />} />
        <Route path="add-account" element={isLoggedIn ? <AddAccountPage /> : <Navigate to="/password" />} />
        <Route path="add-account/new-account" element={isLoggedIn ? <NewAccountPage /> : <Navigate to="/password" />} />
        <Route path="add-card/:accountId" element={isLoggedIn ? <NewCardPage /> : <Navigate to="/password" />} />
        
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