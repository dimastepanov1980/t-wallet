import React from 'react';
import { BorderCard } from './ui/BorderCard';

interface OperationsProps {
currentMonth: string;
  monthlyExpenses: string;
  title: string;
  navigate: (path: string) => void;
}

export const Operations: React.FC<OperationsProps> = ({ currentMonth, monthlyExpenses, title, navigate }) => {
  return (
    
      <div 
          className="bg-white rounded-2xl p-4 shadow-xl cursor-pointer hover:bg-gray-50"
          onClick={() => navigate('')}
        >
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-gray-600">Трат в {currentMonth}</p>
          <p className="text-2xl font-medium mt-2">{monthlyExpenses}</p>
            <div className="h-2 bg-gray-100 rounded-full mt-3">
            <div className="h-full w-3/4 bg-blue-500 rounded-full" />
            </div>
        </div>
    

      

  );
}; 