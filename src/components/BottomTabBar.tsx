import { Link, useLocation } from 'react-router-dom';

const tabs = [
  {
    name: 'Главная',
    path: '/home',
    icon: (active: boolean) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke={active ? "#0066FF" : "currentColor"} 
        className="size-6"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" 
        />
      </svg>
    )
  },
  {
    name: 'Платежи',
    path: '/payments',
    icon: (active: boolean) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke={active ? "#0066FF" : "currentColor"} 
        className="size-6"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" 
        />
      </svg>
    )
  },
  {
    name: 'Город',
    path: '/city',
    icon: (active: boolean) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke={active ? "#0066FF" : "currentColor"} 
        className="size-6"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" 
        />
      </svg>
    )
  },
  {
    name: 'Чат',
    path: '/chat',
    icon: (active: boolean) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke={active ? "#0066FF" : "currentColor"} 
        className="size-6"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" 
        />
      </svg>
    )
  },
  {
    name: 'Ещё',
    path: '/more',
    icon: (active: boolean) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke={active ? "#0066FF" : "currentColor"} 
        className="size-6"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m1.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
        />
      </svg>
    )
  }
];

export const BottomTabBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center min-w-[4rem] ${
                  isActive ? 'text-[#0066FF]' : 'text-gray-600'
                }`}
              >
                {tab.icon(isActive)}
                <span className={`text-xs mt-1 ${
                  isActive ? 'font-medium' : ''
                }`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}; 