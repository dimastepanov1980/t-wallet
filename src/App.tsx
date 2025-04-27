import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './components/AppRoutes';
import { storageService } from './services/storageService';
import { setIsLoggedIn, setUser, clearAllData } from './store/slices/authSlice';
import { fetchAccounts } from './store/slices/accountSlice';

const App = () => {
  useEffect(() => {
    const initApp = async () => {
      try {
        // Проверяем состояние авторизации и данные пользователя
        const [isLoggedIn, userId, phone, deviceId] = await Promise.all([
          storageService.getItem<boolean>('isLoggedIn'),
          storageService.getItem<string>('userId'),
          storageService.getItem<string>('phone'),
          storageService.getItem<string>('deviceId')
        ]);

        console.log('Initializing app with user data:', {
          isLoggedIn,
          userId,
          phone,
          deviceId
        });

        // Если нет сохраненных данных, очищаем все хранилища
        if (!userId && !phone) {
          console.log('No saved data found, clearing all storages');
          await storageService.clearAllStorages();
          return;
        }

        // Восстанавливаем состояние авторизации
        if (isLoggedIn && userId && phone) {
          store.dispatch(setIsLoggedIn(true));
          store.dispatch(setUser({ id: userId, phone, deviceId: deviceId || '' }));
        }

        // Загружаем счета независимо от состояния авторизации
        store.dispatch(fetchAccounts());
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initApp();
  }, []);

  // Обработка удаления приложения
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Проверяем, является ли это удалением приложения
      if (document.visibilityState === 'hidden') {
        store.dispatch(clearAllData());
      }
    };

    // Добавляем обработчик события beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Очищаем обработчик при размонтировании
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;