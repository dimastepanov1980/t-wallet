const chats = [
  {
    id: 1,
    title: 'Поддержка',
    subtitle: 'К сожалению, нет. Сейчас установка возможна та...',
    date: '27.01',
    icon: <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center"><span className="text-2xl font-bold text-white">Т</span></div>,
  },
  {
    id: 2,
    title: 'С днем рождения!',
    subtitle: 'Виджет',
    date: '15.02.2024',
    icon: <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-purple-500 flex items-center justify-center"><span className="text-2xl">🎁</span></div>,
  },
  {
    id: 3,
    title: 'Секретарь',
    subtitle: '🤖: Здравствуйте, это Олег. Что передать абонент...',
    date: '15.04.2022',
    icon: <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"><span className="text-2xl">✨</span></div>,
  },
  {
    id: 4,
    title: 'Безопасность',
    subtitle: 'Мошенники используют новые предлоги для обма...',
    date: '7.03.2022',
    icon: <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center"><span className="text-2xl">🔒</span></div>,
  },
  {
    id: 5,
    title: 'Колесо Фортуны',
    subtitle: 'Сергей, до 16 января рекомендуйте...',
    date: '7.01.2022',
    icon: <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center"><span className="text-2xl">🎡</span></div>,
  },
  {
    id: 6,
    title: 'Выгода от Т-Банка',
    subtitle: 'Виджет',
    date: '5.12.2021',
    icon: <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center"></div>,
  },
];

export const ChatPage = () => {
  return (
    <div className="min-h-screen bg-white pt-8 pb-20">
      <div className="text-3xl font-bold px-4 mb-4 mt-2">Чат</div>
      <div className="flex flex-col divide-y">
        {chats.map(chat => (
          <div key={chat.id} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
            {chat.icon}
            <div className="flex-1 ml-4 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-gray-900 truncate">{chat.title}</span>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{chat.date}</span>
              </div>
              <div className="text-gray-400 text-sm truncate">{chat.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 