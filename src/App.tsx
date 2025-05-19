import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './components/AppRoutes';
import { clearAllData } from './store/slices/authSlice';
import { SplashScreen } from './pages/SplashScreen';
import { RootState } from './store';

const App = () => {
  const dispatch = useDispatch();
  const isDemoMode = useSelector((state: RootState) => state.auth.demoMode);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'APP_UNINSTALL') {
          store.dispatch(clearAllData());
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Показываем splash 2 секунды при старте
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isDemoMode) return;

    // Очистка данных при закрытии/перезагрузке страницы
    const handleUnload = () => {
      dispatch(clearAllData());
    };

    // Очистка данных при сворачивании окна
    const handleVisibilityChange = () => {
      if (document.hidden) {
        dispatch(clearAllData());
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isDemoMode, dispatch]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        {showSplash && <SplashScreen />}
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;