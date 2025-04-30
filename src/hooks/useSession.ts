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
    console.log('Resetting session timer');
    lastActivityRef.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log('Session timeout reached, requesting password re-entry');
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
        storageService.getItem<boolean>('isLoggedIn')
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
    console.log('useSession hook mounted');

    // Функция для обработки активности пользователя
    const handleActivity = () => {
      console.log('User activity detected');
      resetTimer();
    };

    // Функция для обработки изменения видимости страницы
    const handleVisibilityChange = async () => {
      console.log('Visibility changed:', document.hidden ? 'hidden' : 'visible');
      
      if (document.hidden) {
        console.log('App hidden, requesting password re-entry');
        isPasswordReentryRequestedRef.current = true;
        dispatch(requestPasswordReentry());
      } else {
        // При разворачивании приложения восстанавливаем состояние
        await restoreState();
        
        // Проверяем время последней активности
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        console.log('Time since last activity:', timeSinceLastActivity);
        
        if (timeSinceLastActivity >= SESSION_TIMEOUT) {
          console.log('Session timeout after visibility change, requesting password re-entry');
          isPasswordReentryRequestedRef.current = true;
          dispatch(requestPasswordReentry());
        } else {
          console.log('Resetting timer after visibility change');
          resetTimer();
        }
      }
    };

    // Функция для обработки закрытия страницы
    const handleBeforeUnload = () => {
      console.log('Page unloading, requesting password re-entry');
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
      console.log('useSession hook unmounting');
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