import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, NewTransaction } from '../store/slices/transactionSlice';

const TransactionForm: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<NewTransaction>({
    amount: 0,
    type: 'outgoing',
    counterpartyName: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addTransaction(formData));
    setFormData({
      amount: 0,
      type: 'outgoing',
      counterpartyName: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="outgoing">Expense</option>
          <option value="incoming">Income</option>
        </select>
      </div>

      <div>
        <label htmlFor="counterpartyName" className="block text-sm font-medium text-gray-700">
          Counterparty Name
        </label>
        <input
          type="text"
          id="counterpartyName"
          name="counterpartyName"
          value={formData.counterpartyName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm; 