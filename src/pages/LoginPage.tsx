import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDemoMode } from '../store/slices/authSlice';
import { useDeviceId } from '../hooks/useDeviceId';
import { storageService } from '../services/storageService';
import { generateExpectedCode } from '../utils/generateExpectedCode';

const SECRET = 't-wallet-2024'; // ToDo: обфусцировать

export const LoginPage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deviceIdHook = useDeviceId();

  useEffect(() => {
    setDeviceId(deviceIdHook || null);
  }, [deviceIdHook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!deviceId) return setError('Ошибка: нет deviceId');
    const expected = generateExpectedCode(deviceId, SECRET);
    if (code.trim().toUpperCase() === expected) {
      await storageService.setItem('license_valid', true);
      navigate('/password');
    } else {
      setError('Неверный код активации');
    }
  };

  const handleDemo = () => {
    dispatch(setDemoMode(true))
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
          <h1 className="text-2xl font-medium mb-8 flex justify-center items-center">Вход по коду активации</h1>
          
          <div className="space-y-6">
            <div>
              <input
                type="text"
                id="license_code"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-14 px-4 bg-[#f6f7f8] rounded-xl border-none focus:ring-0 text-lg"
                placeholder="Код активации"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-[#ffdd2d] hover:bg-[#ffd42d]"
            >
              Войти
            </button>
            <button
              type="button"
              className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-blue-100 hover:bg-blue-200"
              onClick={() => navigate('/how-to-buy')}
            >
              Купить
            </button>
            <button
              type="button"
              className="w-full h-14 flex justify-center items-center rounded-xl text-lg font-medium text-black bg-gray-200 hover:bg-gray-300"
              onClick={handleDemo}
            >
              Демо
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 