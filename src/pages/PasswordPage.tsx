import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPassword } from '../store/slices/authSlice';
import { updatePassword } from '../services/firebase';
import { RootState } from '../store';

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
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, phone, password: currentPassword } = useSelector((state: RootState) => state.auth);
  const { full_name } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!userId || !phone) {
      navigate('/login');
      return;
    }
    setIsSettingNewPassword(!currentPassword);
  }, [userId, phone, currentPassword, navigate]);

  // Эффект для автоматической проверки пароля при достижении 4 символов
  useEffect(() => {
    if (password.length === 4) {
      handlePasswordSubmit();
    }
  }, [password]);

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    if (isSettingNewPassword) {
      if (password.length < 4) {
        setError('Пароль должен быть не менее 4 символов');
        return;
      }
      if (!confirmPassword) {
        setError('Пожалуйста, подтвердите пароль');
        return;
      }
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
    } else {
      if (!currentPassword) {
        setError('Пароль не установлен для этого аккаунта');
        return;
      }
      if (password !== currentPassword) {
        setError('Неверный пароль');
        setPasswordInput(''); // Очищаем поле при неверном пароле
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSettingNewPassword) {
        if (!userId) {
          setError('ID пользователя отсутствует');
          return;
        }
        const success = await updatePassword(userId, password);
        if (!success) {
          setError('Не удалось сохранить пароль. Пожалуйста, попробуйте снова.');
          return;
        }
        dispatch(setPassword(password));
      }
      navigate('/home');
    } catch (err) {
      console.error('Error in handlePasswordSubmit:', err);
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
      setPasswordInput(''); // Очищаем поле при ошибке
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key >= '0' && e.key <= '9' && password.length < 4) {
      setPasswordInput(prev => prev + e.key);
    } else if (e.key === 'Backspace') {
      setPasswordInput(prev => prev.slice(0, -1));
    }
  };

  const handleNumberClick = (num: number) => {
    if (password.length < 4) {
      setPasswordInput(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPasswordInput(prev => prev.slice(0, -1));
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-white"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl text-center">
          {full_name ? `Здравствуйте, ${full_name.split(' ')[0]}!` : 'Введите пароль'}
        </h1>
        
        <div className="space-y-4">
          <PinDots length={4} filled={password.length} />

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