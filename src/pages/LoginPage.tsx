import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/slices/authSlice';
import { findUserByPhone, updateDeviceId } from '../services/firebase';
import { useDeviceId } from '../hooks/useDeviceId';
import { storageService } from '../services/storageService';

export const LoginPage = () => {
  const [phone, setPhoneInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deviceId = useDeviceId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!deviceId) {
      setError('ID устройства недоступен');
      return;
    }

    try {
      // Проверяем существование пользователя
      const user = await findUserByPhone(phone);
      
      if (!user) {
        setError('Пользователь с таким номером телефона не найден');
        return;
      }

      // Если deviceId не установлен, устанавливаем его
      if (!user.deviceId) {
        console.log('DeviceId not set, setting it now...');
        const success = await updateDeviceId(user.id, deviceId);
        if (!success) {
          setError('Не удалось зарегистрировать устройство');
          return;
        }
        console.log('DeviceId set successfully');
        // Сохраняем данные в хранилище
        await Promise.all([
          storageService.setItem('deviceId', deviceId),
          storageService.setItem('userId', user.id),
          storageService.setItem('phone', phone),
          storageService.setItem('full_name', user.full_name)
        ]);
        dispatch(setUser({ id: user.id, phone: user.phone, full_name: user.full_name, deviceId: user.deviceId }));
        navigate('/password');
        return;
      }

      // Если deviceId установлен, проверяем совпадение
      if (user.deviceId !== deviceId) {
        setError('Этот аккаунт уже зарегистрирован на другом устройстве');
        return;
      }

      // Если все проверки пройдены, сохраняем данные и переходим на страницу пароля
      await Promise.all([
        storageService.setItem('deviceId', deviceId),
        storageService.setItem('userId', user.id),
        storageService.setItem('phone', phone)
      ]);
      dispatch(setUser({ id: user.id, phone: user.phone, full_name: user.full_name, deviceId: user.deviceId }));
      navigate('/password');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Верхняя часть с логотипом */}
      <div className="w-full px-4 mt-20">
        <div className="w-12 h-12 bg-[#ffdd2d] rounded-2xl flex items-center justify-center">
          <span className="text-black font-bold text-xl">ID</span>
        </div>
      </div>

      {/* Форма */}
      <div className="w-full px-4 flex-1 flex flex-col justify-center max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-medium mb-8 flex justify-center items-center">Вход в T-Wallet</h1>
          
          <div className="space-y-6">
            <div>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full h-14 px-4 bg-[#f6f7f8] rounded-xl border-none focus:ring-0 text-lg"
                placeholder="Телефон"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-[#ffdd2d] hover:bg-[#ffd42d] disabled:opacity-50"
            >
              {isLoading ? 'Подождите...' : 'Продолжить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 