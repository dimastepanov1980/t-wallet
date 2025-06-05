import { Outlet, NavLink } from "react-router-dom";
import { HomeIcon } from "./ui/HomeIcon";
import { PaymentsIcon } from "./ui/PaymentsIcon";
import { CityIcon } from "./ui/CityIcon";
import { ChatIcon } from "./ui/ChatIcon";
import { MoreIcon } from "./ui/MoreIcon";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="pb-16">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t pb-4">
        <div className="flex justify-between px-4">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-500"
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
                isActive ? "text-blue-600" : "text-gray-500"
              }`
            }
          >
            <PaymentsIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Платежи</span>
          </NavLink>

          <NavLink
            to="/city"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`
            }
          >
            <CityIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Город</span>
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`
            }
          >
            <ChatIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Чат</span>
          </NavLink>

          <NavLink
            to="/more"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`
            }
          >
            <MoreIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Ещё</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};