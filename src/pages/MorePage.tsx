import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UsersIcon,
  ArrowsRightLeftIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  TicketIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import { storageService } from '../services/storageService';

export const MorePage = () => {
  const currencies = [
    { code: 'USD', value: '91,70' },
    { code: 'EUR', value: '102' },
    { code: 'GBP', value: '132,55' }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { full_name } = useSelector((state: RootState) => state.user);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const checkStorage = async () => {
    try {
      const [userId, phone, deviceId, accounts] = await Promise.all([
        storageService.getItem<string>('userId'),
        storageService.getItem<string>('phone'),
        storageService.getItem<string>('deviceId'),
        storageService.getItem<any>('accounts')
      ]);

      setDebugInfo(JSON.stringify({
        userId,
        phone,
        deviceId,
        accounts
      }, null, 2));
    } catch (error: any) {
      setDebugInfo(`Error: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4 flex flex-col gap-4">
        {/* Header */}
        <h1 className="text-3xl font-medium mb-2">Ещё</h1>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск"
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Currency rates */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex justify-between">
            {currencies.map(({ code, value }) => (
              <div key={code} className="flex items-baseline gap-2">
                <span className="text-gray-500">{code}</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* App install banner */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Установить приложение T-Банка на iPhone</h3>
              <p className="text-gray-500">Теперь вы можете сделать это самостоятельно</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl font-bold">
              T
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          <MenuItem
            icon={<BuildingLibraryIcon className="w-6 h-6" />}
            title="Банкоматы и точки пополнения"
            subtitle="Где снять и положить деньги на счет"
            onClick={() => navigate('/atms')}
          />
          <MenuItem
            icon={<PlusCircleIcon className="w-6 h-6" />}
            title="Добавить счет"
            subtitle="Откройте новый счет или карту"
            onClick={() => navigate('/add-account')}
          />
          <MenuItem
            icon={<ShieldCheckIcon className="w-6 h-6" />}
            title="Безопасность"
            subtitle="Пароли и активные сессии"
            onClick={() => navigate('/security')}
          />
          <MenuItem
            icon={<TicketIcon className="w-6 h-6" />}
            title="Заказы"
            subtitle="Ваши билеты и бронирования"
            onClick={() => navigate('/orders')}
          />
          <MenuItem
            icon={<DocumentTextIcon className="w-6 h-6" />}
            title="Заказать справку"
            subtitle="Об остатке на счете и другие"
            onClick={() => navigate('/certificates')}
          />
          <MenuItem
            icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
            title="Обращения"
            subtitle="Ваши обращения в банк. Мы на связи 24/7"
            onClick={() => navigate('/support')}
          />
          <MenuItem
            icon={<Cog6ToothIcon className="w-6 h-6" />}
            title="Настройки"
            subtitle="СБП, уведомления о счетах на оплату"
            onClick={() => navigate('/settings')}
          />
          <MenuItem
            icon={<UsersIcon className="w-6 h-6" />}
            title="Совместный доступ к счетам"
            subtitle="Доступ к вашим счетам и счетам других клиентов"
            onClick={() => navigate('/shared-access')}
          />
          <MenuItem
            icon={<ArrowsRightLeftIcon className="w-6 h-6" />}
            title="Привязки к сервисам"
            subtitle="Сервисы, которые вы привязали для оплаты через СБП"
            onClick={() => navigate('/services')}
          />
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-2xl p-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Связь с банком</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PhoneIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg">8 (800) 555-22-77</p>
                <p className="text-gray-500">Для звонков по России (бесплатный)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PhoneIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg">+7 (495) 645-59-19</p>
                <p className="text-gray-500">Для звонков из других стран</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug section */}
        <div className="mt-8 p-4 border border-gray-200 rounded-xl">
          <h2 className="text-lg font-medium mb-4">Отладка</h2>
          <button
            onClick={checkStorage}
            className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-gray-100 hover:bg-gray-200 mb-4"
          >
            Проверить хранилище
          </button>
          {debugInfo && (
            <pre className="bg-gray-100 p-4 rounded-xl overflow-auto text-sm">
              {debugInfo}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

// MenuItem component
const MenuItem = ({ icon, title, subtitle, onClick }: { 
  icon: React.ReactNode, 
  title: string, 
  subtitle: string,
  onClick?: () => void 
}) => (
  <div 
    className="bg-white rounded-2xl p-4 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-900">{title}</h3>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    </div>
  </div>
); 