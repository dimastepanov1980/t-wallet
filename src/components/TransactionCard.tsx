import React from 'react';
import { Transaction } from '../types/account';
import { getBankLogoPath } from '../utils/getBankLogoFileName';

interface OperationsProps {
    transaction: Transaction;
    navigate: (path: string) => void;
    formatAmount: (amount: number) => string;
}

export const TransactionCard: React.FC<OperationsProps> = ({ transaction, navigate, formatAmount }) => {
    const logoPath = getBankLogoPath(transaction.bankName);

  return (
    
    <div 
    key={transaction.id} 
    className="bg-white rounded-xl p-4 flex items-center justify-between"
    onClick={() => navigate(`/transactions/${transaction.id}`)}
    >
       <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-blue-600 overflow-hidden mr-3">
    {logoPath && (
        <img src={logoPath} alt={transaction.bankName} className="w-12  h-12" />
        )}
        </div>
    <div className="flex-1 flex flex-col items-start mr-4">
   
      <div className="font-medium">{transaction.counterpartyName}</div>
      
      <div className="text-gray-500 text-sm">
        {'Перевод'}
      </div>
      
    </div>
    <div className="flex flex-col items-end min-w-[80px]">
    <div className={`text-lg ${transaction.type === 'incoming' ? 'text-green-500' : ''}`}>
      {transaction.type === 'incoming' ? '+' : '−'}
      {formatAmount(Math.abs(transaction.amount))}
    </div>
    <div className="text-gray-400 text-sm">
        {`• ${transaction.cardNumber?.slice(-4)}`}
      </div>
      </div>
    </div>
    
  );
}; 