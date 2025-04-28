import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './components/AppRoutes';
import { clearAllData } from './store/slices/authSlice';

const App = () => {

  // Слушаем сообщения от service worker
  useEffect(() => {
    // Проверяем поддержку Service Worker перед использованием
    if ('serviceWorker' in navigator && navigator.serviceWorker) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'APP_UNINSTALL') {
          console.log('Application is being uninstalled');
          // Очищаем данные только при реальном удалении
          store.dispatch(clearAllData());
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
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