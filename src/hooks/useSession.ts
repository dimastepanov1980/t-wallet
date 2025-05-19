import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReentry, setUser, setIsLoggedIn } from '../store/slices/authSlice';
import { storageService } from '../services/storageService';
import { RootState } from '../store';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 минут в миллисекундах

export const useSession = () => {
  const dispatch = useDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isPasswordReentryRequestedRef = useRef<boolean>(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      isPasswordReentryRequestedRef.current = true;
      dispatch(requestPasswordReentry());
    }, SESSION_TIMEOUT);
  };

  const restoreState = async () => {
    try {
      const [userId, phone, deviceId, storedIsLoggedIn] = await Promise.all([
        storageService.getItem<string>('userId'),
        storageService.getItem<string>('phone'),
        storageService.getItem<string>('deviceId'),
        storageService.getItem<boolean>('isLoggedIn'),
        storageService.getItem<string>('password'),
        storageService.getItem<string>('licenseValid')
      ]);

      console.log('Restoring state:', {
        userId,
        phone,
        deviceId,
        storedIsLoggedIn,
        currentIsLoggedIn: isLoggedIn
      });

      if (userId && phone && deviceId && storedIsLoggedIn) {
        dispatch(setUser({ id: userId, phone, deviceId, full_name: '' }));
        dispatch(setIsLoggedIn(true));
      }
    } catch (error) {
      console.error('Error restoring state:', error);
    }
  };

  useEffect(() => {

    // Функция для обработки активности пользователя
    const handleActivity = () => {
      resetTimer();
    };

    // Функция для обработки изменения видимости страницы
    const handleVisibilityChange = async () => {
      console.log('Visibility changed:', document.hidden ? 'hidden' : 'visible');
      
      if (document.hidden) {
        isPasswordReentryRequestedRef.current = true;
        dispatch(requestPasswordReentry());
      } else {
        // При разворачивании приложения восстанавливаем состояние
        await restoreState();
        
        // Проверяем время последней активности
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        
        if (timeSinceLastActivity >= SESSION_TIMEOUT) {
          isPasswordReentryRequestedRef.current = true;
          dispatch(requestPasswordReentry());
        } else {
          resetTimer();
        }
      }
    };

    // Функция для обработки закрытия страницы
    const handleBeforeUnload = () => {
      isPasswordReentryRequestedRef.current = true;
      dispatch(requestPasswordReentry());
    };

    // Инициализация таймера
    resetTimer();

    // Добавляем слушатели событий
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('touchstart', handleActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Очистка при размонтировании
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch, isLoggedIn]);
}; 