import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../components/MenuItem';
import { Header } from '../components/ui/Header';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { UserIcon } from '@heroicons/react/24/solid';
import { BottomSheet } from '../components/BottomSheet';
import { useState } from 'react';
import { updateUserProfile } from '../store/slices/authSlice';
import { storageService } from '../services/storageService';
import { useScrollLock } from '../hooks/useScrollLock';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { logout } from '../store/slices/authSlice';


export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { full_name, phone, email, address } = useSelector((state: RootState) => state.auth);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  // Добавляем хук для блокировки прокрутки
  useScrollLock(activeSheet !== null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  const handleChange = async (field: string, value: string) => {
    dispatch(updateUserProfile({ [field]: value }));
    
  };

  const handleSave = async (field: string, value: string) => {
    await storageService.setItem(field, value);
    setActiveSheet(null);
  };

  return (
    <div className="m-4">
      <Header title="Ваши данные" />
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center mt-20 gap-3">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-gray-400" />
          </div>
          <span className="text-3xl font-bold">{full_name || 'Name'}</span>
        </div>
        
        <div>
          <MenuItem
            icon={<img src="/logos/T-User.png" className="w-9.5 h-9.5" />}
            title="Фамилия Имя"
            backgroundColor="bg-blue-500"
            textColor="text-white"
            rounded="top"
            onClick={() => setActiveSheet('full_name')}
          />
          <MenuItem
            icon={<img src="/logos/T-Phone.png" className="w-9.5 h-9.5" />}
            title="Телефон"
            backgroundColor="bg-blue-500"
            textColor="text-white"
            rounded="none"
            onClick={() => setActiveSheet('phone')}
          />
          <MenuItem
            icon={<img src="/logos/T-Email.png" className="w-9.5 h-9.5" />}
            title="Почта"
            backgroundColor="bg-blue-500"
            textColor="text-white"
            rounded="none"
            onClick={() => setActiveSheet('email')}
          />
          <MenuItem
            icon={<img src="/logos/T-Adress.png" className="w-9.5 h-9.5" />}
            title="Адрес"
            backgroundColor="bg-blue-500"
            textColor="text-white"
            rounded="bottom"
            onClick={() => setActiveSheet('address')}
          />
           <MenuItem
          icon={<img src="/logos/T-GUslugi.png" className="w-9.5 h-9.5" />}
          title="Госуслуги"
          backgroundColor="bg-blue-500"
          textColor="text-white"
          rounded="none"
          onClick={() => navigate('/orders')}
        />
        <MenuItem
          icon={<img src="/logos/T-Samozan.png" className="w-9.5 h-9.5" />}
          title="Самозанятость"
          backgroundColor="bg-blue-500"
          textColor="text-white"
          rounded="none"
          onClick={() => navigate('/certificates')}
        />
        <MenuItem
          icon={<img src="/logos/T-Pensia.png" className="w-9.5 h-9.5" />}
          title="Пенсия на карту"
          backgroundColor="bg-blue-500"
          textColor="text-white"
          rounded="bottom"
          onClick={() => navigate('/support')}
        />
        </div>
        <div>
          <MenuItem
            icon={<img src="/logos/T-Bisness.png" className="w-9.5 h-9.5" />}
            title="T-Бизнес"
            backgroundColor="bg-blue-500"
            textColor="text-white"
            rounded="top"
            onClick={() => navigate('/settings')}
          />
          <MenuItem
            icon={<img src="/logos/T-Mobile.png" className="w-9.5 h-9.5" />}
            title="Т-Мобайл"
            backgroundColor="bg-blue-500"
            textColor="text-white"
            rounded="none"
            onClick={() => navigate('/shared-access')}
          />
          <MenuItem
            icon={<img src="/logos/T-Invest.png" className="w-9.5 h-9.5" />}
            title="Т-инвестиции"
            backgroundColor="bg-blue-500"
            textColor="text-white"
            rounded="bottom"
            onClick={() => navigate('/services')}
          />
        </div>
        <div>
          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 text-red-600"
          >
            <div className="flex items-center gap-3">
              <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
              <span>Выйти</span>
            </div>
          </button>
        </div>
      </div>

      <BottomSheet
        isOpen={activeSheet === 'full_name'}
        onClose={() => setActiveSheet(null)}
        title="Фамилия Имя"
        subtitle="Имя и фамилия, которые будут отображаться в приложении"
      >
        <div className="space-y-4 mb-10">
          <input
            type="text"
            value={full_name || ''}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className="bg-transparent text-black w-full p-4 border rounded-xl"
            placeholder="Введите ФИО"
          />
        
          <button
            onClick={() => handleSave('full_name', full_name || '')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#ffdd2d] hover:bg-[#ffd42d] text-gray-600"
          >
            Сохранить имя
          </button>
          </div>
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'phone'}
        onClose={() => setActiveSheet(null)}
        subtitle="Телефон, который будет отображаться в выписках и справках"
        title="Телефон"
      >
        <div className="space-y-4 mb-10">
          <input
            type="text"
            value={phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="bg-transparent text-black w-full p-4 border rounded-xl"
            placeholder="+7 (999) 999-99-99"
          />
        
          <button
            onClick={() => handleSave('phone', phone || '')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#ffdd2d] hover:bg-[#ffd42d] text-gray-600"
          >
            Сохранить телефон
          </button>
          </div>
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'email'}
        onClose={() => setActiveSheet(null)}
        subtitle="Почта, которая будет отображаться в выписках и справках"
        title="Почта"
      >
        <div className="space-y-4 mb-10">
          <input
            type="text"
            value={email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="bg-transparent text-black w-full p-4 border rounded-xl"
            placeholder="Введите почту"
          />
        
          <button
            onClick={() => handleSave('email', email || '')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#ffdd2d] hover:bg-[#ffd42d] text-gray-600"
          >
            Сохранить почту
          </button>
          </div>
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'address'}
        onClose={() => setActiveSheet(null)}
        title="Адрес"
        subtitle="Адрес, который будет отображаться в выписках и справках"
      >
        <div className="space-y-4 mb-10">
          <input
            type="text"
            value={address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="bg-transparent text-black w-full p-4 border rounded-xl"
            placeholder="Индекс, область, город, улица, дом"
            
          />
        
          <button
            onClick={() => handleSave('address', address || '')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#ffdd2d] hover:bg-[#ffd42d] text-gray-600"
          >
            Сохранить адрес
          </button>
          </div>
      </BottomSheet>

    </div>
  );
}; 