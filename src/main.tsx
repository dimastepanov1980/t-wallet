import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('ServiceWorker registration failed: ', registrationError);
      });
  });
}
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    })
      .then((registration) => {
        console.log('ServiceWorker registration successful', registration);
        
        // Слушаем событие удаления приложения
        window.addEventListener('appinstalled', () => {
          console.log('PWA was installed');
        });

        window.addEventListener('beforeinstallprompt', () => {
          console.log('PWA install prompt');
        });
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}
