import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPhone, setUser, setIsDemo, setDeviceId } from '../store/slices/authSlice';
import { findUserByPhone, updateDeviceId } from '../services/firebase';
import { useDeviceId } from '../hooks/useDeviceId';
import { Timestamp } from 'firebase/firestore';

export const LoginPage = () => {
  const [phone, setPhoneInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deviceId = useDeviceId();

  const handleLogin = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    if (!deviceId) {
      setError('Device ID not available');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await findUserByPhone(phone);
      
      if (!user) {
        setError('User not found');
        return;
      }

      if (!user.allowed) {
        setError('Account is not active');
        return;
      }

      // Проверяем наличие пароля
      if (!user.password) {
        setError('No password set for this account');
        return;
      }

      const now = Timestamp.now();
      if (user.expires_at.seconds < now.seconds) {
        setError('Account has expired');
        return;
      }

      // Check deviceId
      if (user.deviceId && user.deviceId !== deviceId) {
        setError('This account is already registered on another device');
        return;
      }

      // If no deviceId is set, update it
      if (!user.deviceId) {
        const success = await updateDeviceId(user.id, deviceId);
        if (!success) {
          setError('Failed to register device. Please try again.');
          return;
        }
      }

      dispatch(setUser({ userId: user.id, phone: user.phone, password: user.password }));
      dispatch(setDeviceId(deviceId));
      navigate('/password');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    if (!deviceId) {
      setError('Device ID not available');
      return;
    }
    dispatch(setIsDemo(true));
    dispatch(setDeviceId(deviceId));
    navigate('/home');
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
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-[#ffdd2d] hover:bg-[#ffd42d] disabled:opacity-50"
            >
              {isLoading ? 'Подождите...' : 'Продолжить'}
            </button>

            <button
              onClick={handleGuestLogin}
              className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-white border-2 border-[#ffdd2d] hover:bg-[#fff6d6]"
            >
              Войти как гость
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 