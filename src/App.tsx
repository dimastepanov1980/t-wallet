import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './components/AppRoutes';
import { clearAllData } from './store/slices/authSlice';
import { SplashScreen } from './pages/SplashScreen';

const App = () => {
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

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;