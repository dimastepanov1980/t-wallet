import { Outlet, NavLink } from "react-router-dom";
import { 
  HomeIcon, 
  CreditCardIcon, 
  BuildingOfficeIcon, 
  ChatBubbleLeftRightIcon,
  EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-between px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Главная</span>
          </NavLink>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            <CreditCardIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Платежи</span>
          </NavLink>
          <NavLink
            to="/city"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            <BuildingOfficeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Город</span>
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Чат</span>
          </NavLink>
          <NavLink
            to="/more"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            <EllipsisHorizontalIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Ещё</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}; 