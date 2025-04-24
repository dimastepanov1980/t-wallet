# T-Wallet

Мультивалютный кошелек с поддержкой карт и управлением счетами.

## Функциональность

- Создание и управление счетами в разных валютах (RUB, USD, EUR)
- Привязка банковских карт к счетам
- Просмотр баланса и истории транзакций
- Поддержка различных платежных систем (Visa, Mastercard, МИР)

## Технологии

- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Vite

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/t-wallet.git
cd t-wallet
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env с необходимыми переменными окружения:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Запустите проект:
```bash
npm run dev
```

## Структура проекта

```
src/
  ├── components/     # React компоненты
  ├── pages/         # Страницы приложения
  ├── store/         # Redux store и слайсы
  ├── types/         # TypeScript типы
  ├── services/      # Сервисы (Firebase, LocalStorage)
  └── App.tsx        # Корневой компонент
```

## Лицензия

MIT
