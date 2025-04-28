import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPassword, setIsLoggedIn } from '../store/slices/authSlice';
import { RootState } from '../store';
import { storageService } from '../services/storageService';

const PinDots = ({ length, filled }: { length: number; filled: number }) => {
  return (
    <div className="flex gap-4 justify-center my-8">
      {[...Array(length)].map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full ${
            i < filled ? 'bg-primary' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export const PasswordPage = () => {
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [isConfirmingPassword, setIsConfirmingPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { phone, password: storedPassword } = useSelector((state: RootState) => state.auth);
  const { full_name } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пароль
    setIsSettingNewPassword(!storedPassword);
  }, [storedPassword]);

  // Эффект для автоматической проверки пароля при достижении 4 символов
  useEffect(() => {
    if (isConfirmingPassword && confirmPassword.length === 4) {
      handlePasswordSubmit();
    } else if (!isConfirmingPassword && password.length === 4) {
      handlePasswordSubmit();
    }
  }, [password, confirmPassword, isConfirmingPassword]);

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    if (isSettingNewPassword) {
      // Логика установки нового пароля
      if (!isConfirmingPassword) {
        // Первый ввод пароля
        setIsConfirmingPassword(true);
        setConfirmPassword('');
        return;
      }

      // Проверка подтверждения пароля
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        setConfirmPassword('');
        setPasswordInput('');
        setIsConfirmingPassword(false);
        return;
      }

      // Пароли совпадают, сохраняем локально
      setIsLoading(true);
      setError('');

      try {
        await storageService.setItem('password', password);
        dispatch(setPassword(password));
        dispatch(setIsLoggedIn(true));
        navigate('/home');
      } catch (err) {
        console.error('Error in handlePasswordSubmit:', err);
        setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
        setPasswordInput('');
        setConfirmPassword('');
        setIsConfirmingPassword(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Проверка существующего пароля
      if (password === storedPassword) {
        dispatch(setIsLoggedIn(true));
        navigate('/home');
      } else {
        setError('Неверный пароль');
        setPasswordInput('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key >= '0' && e.key <= '9' && password.length < 4) {
      if (isConfirmingPassword) {
        setConfirmPassword(prev => prev + e.key);
      } else {
        setPasswordInput(prev => prev + e.key);
      }
    } else if (e.key === 'Backspace') {
      if (isConfirmingPassword) {
        setConfirmPassword(prev => prev.slice(0, -1));
      } else {
        setPasswordInput(prev => prev.slice(0, -1));
      }
    }
  };

  const handleNumberClick = (num: number) => {
    if (isConfirmingPassword) {
      if (confirmPassword.length < 4) {
        setConfirmPassword(prev => prev + num);
      }
    } else {
      if (password.length < 4) {
        setPasswordInput(prev => prev + num);
      }
    }
  };

  const handleBackspace = () => {
    if (isConfirmingPassword) {
      setConfirmPassword(prev => prev.slice(0, -1));
    } else {
      setPasswordInput(prev => prev.slice(0, -1));
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-white"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl text-center">
          {isSettingNewPassword 
            ? 'Установите пароль' 
            : full_name 
              ? `Здравствуйте, ${full_name.split(' ')[0]}!` 
              : 'Введите пароль'}
        </h1>
        
        <div className="space-y-4">
          <PinDots length={4} filled={isConfirmingPassword ? confirmPassword.length : password.length} />

          {/* Скрытое поле для имени пользователя */}
          <div className="sr-only">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              value={phone || ''}
              readOnly
            />
          </div>

          {/* Цифровая клавиатура */}
          <div className="grid grid-cols-3 gap-4 mt-2 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={isLoading}
                className="w-16 h-16 text-2xl bg-white rounded-full hover:bg-gray-100 focus:outline-none disabled:opacity-50 flex items-center justify-center relative after:absolute after:inset-0 after:rounded-full after:border-2 after:border-blue-500 after:opacity-0 active:after:opacity-100 after:transition-opacity after:duration-1000"
              >
                {num}
              </button>
            ))}
            <div className="col-start-2 flex items-center justify-center">
              <button
                onClick={() => handleNumberClick(0)}
                disabled={isLoading}
                className="w-16 h-16 text-2xl bg-white rounded-full hover:bg-gray-100 focus:outline-none disabled:opacity-50 flex items-center justify-center relative after:absolute after:inset-0 after:rounded-full after:border-2 after:border-blue-500 after:opacity-0 active:after:opacity-100 after:transition-opacity after:duration-1000"
              >
                0
              </button>
            </div>
            <div className="col-start-3 flex items-center justify-center">
              <button
                onClick={handleBackspace}
                disabled={isLoading}
                className="w-16 h-16 bg-white flex items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none disabled:opacity-50 relative after:absolute after:inset-0 after:rounded-full after:border-2 after:border-blue-500 after:opacity-0 active:after:opacity-100 after:transition-opacity after:duration-1000"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mt-4">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}; 