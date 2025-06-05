import { Account, Card, Transaction, User } from '../types/interface';

// Демо-пользователь
export const demoUser: User = {
  userId: 'demo-user-1',
  phone: '+79998887766',
  password: 'demo',
  full_name: 'Иван Иванов',
  isLoggedIn: true,
  demoMode: true,
  email: 'demo@demo.com',
  address: 'г. Москва, ул. Примерная, д. 1'
};

export const demoTransactions: Transaction[] = [
  // Январь 2025
  {
    id: 'tr-jan-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-01-01T10:00:00.000Z',
    processingDate: '2025-01-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5678'
  },
  {
    id: 'tr-jan-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-01-02T10:00:00.000Z',
    processingDate: '2025-01-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5679'
  },
  {
    id: 'tr-jan-3',
    amount: 50000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Новый год',
    date: '2025-01-01T10:00:00.000Z',
    processingDate: '2025-01-01T10:00:00.000Z',
    counterpartyName: 'Магазин подарков',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5680'
  },

  // Февраль 2025
  {
    id: 'tr-feb-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-02-01T10:00:00.000Z',
    processingDate: '2025-02-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5681'
  },
  {
    id: 'tr-feb-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-02-02T10:00:00.000Z',
    processingDate: '2025-02-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5682'
  },
  {
    id: 'tr-feb-3',
    amount: 40000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'День святого Валентина',
    date: '2025-02-14T10:00:00.000Z',
    processingDate: '2025-02-14T10:00:00.000Z',
    counterpartyName: 'Ресторан',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5683'
  },

  // Март 2025
  {
    id: 'tr-mar-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-03-01T10:00:00.000Z',
    processingDate: '2025-03-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5684'
  },
  {
    id: 'tr-mar-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-03-02T10:00:00.000Z',
    processingDate: '2025-03-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5685'
  },
  {
    id: 'tr-mar-3',
    amount: 35000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Подарки на 8 марта',
    date: '2025-03-08T10:00:00.000Z',
    processingDate: '2025-03-08T10:00:00.000Z',
    counterpartyName: 'Цветочный магазин',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5686'
  },

  // Апрель 2025
  {
    id: 'tr-apr-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-04-01T10:00:00.000Z',
    processingDate: '2025-04-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5687'
  },
  {
    id: 'tr-apr-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-04-02T10:00:00.000Z',
    processingDate: '2025-04-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5688'
  },
  {
    id: 'tr-apr-3',
    amount: 20000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Отпуск',
    date: '2025-04-20T10:00:00.000Z',
    processingDate: '2025-04-20T10:00:00.000Z',
    counterpartyName: 'Турфирма',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5689'
  },

  // Май 2025
  {
    id: 'tr-may-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-05-01T10:00:00.000Z',
    processingDate: '2025-05-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5690'
  },
  {
    id: 'tr-may-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-05-02T10:00:00.000Z',
    processingDate: '2025-05-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5691'
  },
  {
    id: 'tr-may-3',
    amount: 30000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Ремонт',
    date: '2025-05-15T10:00:00.000Z',
    processingDate: '2025-05-15T10:00:00.000Z',
    counterpartyName: 'Строительный магазин',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5692'
  },

  // Июнь 2025
  {
    id: 'tr-jun-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-06-01T10:00:00.000Z',
    processingDate: '2025-06-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5693'
  },
  {
    id: 'tr-jun-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-06-02T10:00:00.000Z',
    processingDate: '2025-06-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5694'
  },
  {
    id: 'tr-jun-3',
    amount: 25000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Продукты',
    date: '2025-06-03T10:00:00.000Z',
    processingDate: '2025-06-03T10:00:00.000Z',
    counterpartyName: 'Магазин "Продукты"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5695'
  },
  {
    id: 'tr-jun-4',
    amount: 15000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Развлечения',
    date: '2025-06-04T10:00:00.000Z',
    processingDate: '2025-06-04T10:00:00.000Z',
    counterpartyName: 'Кинотеатр',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5696'
  },

  // Июль 2025
  {
    id: 'tr-jul-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-07-01T10:00:00.000Z',
    processingDate: '2025-07-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5697'
  },
  {
    id: 'tr-jul-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-07-02T10:00:00.000Z',
    processingDate: '2025-07-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5698'
  },
  {
    id: 'tr-jul-3',
    amount: 35000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Летний отдых',
    date: '2025-07-15T10:00:00.000Z',
    processingDate: '2025-07-15T10:00:00.000Z',
    counterpartyName: 'База отдыха',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5699'
  },

  // Август 2025
  {
    id: 'tr-aug-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-08-01T10:00:00.000Z',
    processingDate: '2025-08-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5700'
  },
  {
    id: 'tr-aug-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-08-02T10:00:00.000Z',
    processingDate: '2025-08-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5701'
  },
  {
    id: 'tr-aug-3',
    amount: 40000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Школьные принадлежности',
    date: '2025-08-25T10:00:00.000Z',
    processingDate: '2025-08-25T10:00:00.000Z',
    counterpartyName: 'Канцтовары',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5702'
  },

  // Сентябрь 2025
  {
    id: 'tr-sep-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-09-01T10:00:00.000Z',
    processingDate: '2025-09-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5703'
  },
  {
    id: 'tr-sep-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-09-02T10:00:00.000Z',
    processingDate: '2025-09-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5704'
  },
  {
    id: 'tr-sep-3',
    amount: 30000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'День знаний',
    date: '2025-09-01T10:00:00.000Z',
    processingDate: '2025-09-01T10:00:00.000Z',
    counterpartyName: 'Школьный магазин',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5705'
  },

  // Октябрь 2025
  {
    id: 'tr-oct-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-10-01T10:00:00.000Z',
    processingDate: '2025-10-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5706'
  },
  {
    id: 'tr-oct-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-10-02T10:00:00.000Z',
    processingDate: '2025-10-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5707'
  },
  {
    id: 'tr-oct-3',
    amount: 25000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'День учителя',
    date: '2025-10-05T10:00:00.000Z',
    processingDate: '2025-10-05T10:00:00.000Z',
    counterpartyName: 'Цветочный магазин',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5708'
  },

  // Ноябрь 2025
  {
    id: 'tr-nov-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-11-01T10:00:00.000Z',
    processingDate: '2025-11-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5709'
  },
  {
    id: 'tr-nov-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-11-02T10:00:00.000Z',
    processingDate: '2025-11-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5710'
  },
  {
    id: 'tr-nov-3',
    amount: 30000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'День народного единства',
    date: '2025-11-04T10:00:00.000Z',
    processingDate: '2025-11-04T10:00:00.000Z',
    counterpartyName: 'Ресторан',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5711'
  },

  // Декабрь 2025
  {
    id: 'tr-dec-1',
    amount: 150000,
    type: 'incoming',
    currency: 'RUB',
    description: 'Зарплата',
    date: '2025-12-01T10:00:00.000Z',
    processingDate: '2025-12-01T10:00:00.000Z',
    counterpartyName: 'ООО "Компания"',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5712'
  },
  {
    id: 'tr-dec-2',
    amount: 45000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Аренда квартиры',
    date: '2025-12-02T10:00:00.000Z',
    processingDate: '2025-12-02T10:00:00.000Z',
    counterpartyName: 'Арендодатель',
    bankName: 'Сбербанк',
    cardNumber: '4276 1600 1234 5713'
  },
  {
    id: 'tr-dec-3',
    amount: 60000,
    type: 'outgoing',
    currency: 'RUB',
    description: 'Новогодние подарки',
    date: '2025-12-25T10:00:00.000Z',
    processingDate: '2025-12-25T10:00:00.000Z',
    counterpartyName: 'Магазин подарков',
    bankName: 'Тинькофф',
    cardNumber: '4276 1600 1234 5714'
  }
];

// Демо-карта
export const demoCard: Card = {
  id: 'card-1',
  accountId: 'acc-1',
  cardNumber: '4276 1600 1234 5678',
  holderName: 'Иван Иванов',
  name: 'Основная карта',
  type: 'mastercard',
  balance: 52000,
  transactions: demoTransactions
};

// Демо-счет
export const demoAccounts: Account[] = [
  {
    id: 'acc-1',
    ownerName: 'Иван Иванов',
    accountNumber: '40817810099910004312',
    name: 'Основной счет',
    currency: 'RUB',
    contractNumber: '1234567890',
    cards: [demoCard],
    balance: 52000,
    monthlyBalances: [
      { month: 5, year: 2025, balance: 52000 },
      { month: 4, year: 2025, balance: 48000 },
      { month: 3, year: 2025, balance: 45000 },
      { month: 2, year: 2025, balance: 42000 },
      { month: 1, year: 2025, balance: 40000 },
      { month: 0, year: 2025, balance: 38000 }
    ],
    dateСreation: '2025-01-01'
  }
]; 