import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Сохраняем текущую позицию прокрутки
      const scrollY = window.scrollY;
      
      // Блокируем прокрутку
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
      
      // Для iOS
      document.body.style.touchAction = 'none';
      (document.body.style as any)['-webkit-overflow-scrolling'] = 'none';
    } else {
      // Получаем позицию прокрутки из стиля
      const scrollY = document.body.style.top;
      
      // Разблокируем прокрутку
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      
      // Для iOS
      document.body.style.touchAction = '';
      (document.body.style as any)['-webkit-overflow-scrolling'] = '';
      
      // Восстанавливаем позицию прокрутки
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Очистка при размонтировании
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      (document.body.style as any)['-webkit-overflow-scrolling'] = '';
    };
  }, [isLocked]);
}; 