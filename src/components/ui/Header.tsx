import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircleIcon, ArrowLeftIcon, ArrowUpLeftIcon, ChevronDoubleLeftIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title?: string;
  bgColor?: 'white' | 'gray-800';
  textColor?: 'gray-900' | 'gray-100';
  onBack?: () => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  bgColor = 'white',
  textColor = 'gray-900',
  onBack,
  children 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`bg-${bgColor} fixed top-0 left-0 right-0 z-10`} style={{ 
      paddingTop: 'max(env(safe-area-inset-top), 20px)'
    }}>
      <div className="flex items-center min-h-[56px] px-4">
        <button 
          onClick={handleBack}
          className={`bg-transparent p-2 -ml-2 rounded-full hover:bg-${bgColor === 'white' ? 'gray-100' : 'gray-700'}`}
        >
          <ChevronLeftIcon className={`w-6 h-6 text-${textColor}`} />
        </button>
        {title && (
          <h1 className={`ml-2 text-xl text-${textColor}`}>{title}</h1>
        )}
        {children}
      </div>
    </div>
  );
}; 