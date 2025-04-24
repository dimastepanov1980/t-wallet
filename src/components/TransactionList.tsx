import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Transaction } from '../types/account';

const TransactionList: React.FC = () => {
  const { transactions, loading, error } = useSelector((state: RootState) => state.transactions);

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-gray-500 p-4">No transactions found</div>;
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction: Transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{transaction.counterpartyName}</h3>
              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div
              className={`font-bold ${
                transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'incoming' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList; 