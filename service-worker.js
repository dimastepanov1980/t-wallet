const CACHE_NAME = 't-wallet-v1';

// Добавляем все возможные маршруты приложения
const ROUTES = [
  '/',
  '/login',
  '/password',
  '/home',
  '/top-up',
  '/card-transfer',
  '/payments',
  '/city',
  '/chat',
  '/more',
  '/add-account',
  '/add-account/new-account',
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Сначала кэшируем основные файлы
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          // Используем iOS иконки как основные
          '/ios/32.png',  // для favicon
          '/ios/72.png',
          '/ios/96.png',
          '/ios/128.png',
          '/ios/144.png',
          '/ios/152.png',
          '/ios/192.png',
          '/ios/256.png',
          '/ios/512.png',
          // Добавляем ссылку на favicon
          { '/favicon.ico': '/ios/32.png'}
        ]);
      })
      .then(async () => {
        // Затем пытаемся закэшировать все assets
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch('/asset-manifest.json');
          const assets = await response.json();
          const urlsToCache = Object.values(assets);
          console.log('asset-manifest', assets);
          return await cache.addAll(urlsToCache);

        } catch (error) {
          console.log('[ServiceWorker] No asset-manifest found');
        }
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Используем стратегию Cache First
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кэше, возвращаем его
        if (response) {
          return response;
        }

        // Если это навигационный запрос (HTML страница)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }

        // Иначе делаем запрос к серверу
        return fetch(event.request)
          .then((response) => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200) {
              return response;
            }

            // Кэшируем новый успешный ответ
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Если запрос не удался и это HTML страница
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // Для остальных ресурсов возвращаем "заглушку"
            return new Response('Offline');
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Добавляем обработчик удаления приложения
self.addEventListener('uninstall', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Очищаем кэш
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        // Очищаем локальное хранилище
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'APP_UNINSTALL'
          });
        });
      } catch (error) {
        console.error('Error during uninstall:', error);
      }
    })()
  );
}); 