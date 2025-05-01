import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { BanknotesIcon, ArrowsRightLeftIcon, LinkIcon, BuildingLibraryIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../components/MenuItem';
export const TopUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="ml-2 text-xl">Пополнить</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-20">
        {/* From other bank section */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-medium flex items-center gap-2">
                Из другого банка
                <span className="flex">
                  <span className="w-4 h-4 bg-red-500 rounded-sm transform -rotate-45"></span>
                  <span className="w-4 h-4 bg-green-500 rounded-sm transform translate-x-[-4px] rotate-45"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm">Без комиссии</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <BuildingLibraryIcon className="w-8 h-8 text-gray-400" />
            <span className="text-gray-900">Другой банк</span>
          </div>
        </div>

        {/* Methods list */}
        <div className="space-y-2">
          <MenuItem
            icon={<ArrowsRightLeftIcon className="w-6 h-6 text-blue-600" />}
            title="С моего счета в T-Банке"
            onClick={() => navigate('/card-transfer')}
          />
          <MenuItem
            icon={<CreditCardIcon className="w-6 h-6 text-blue-600" />}
            title="С карты другого банка"
            onClick={() => navigate('/card-transfer')}
          />
          <MenuItem
            icon={<CreditCardIcon className="w-6 h-6 text-blue-600" />}
            title="По реквизитам"
            onClick={() => navigate('/card-transfer')}
          />
          <MenuItem
            icon={<LinkIcon className="w-6 h-6 text-blue-600" />}
            title="По ссылке"
            onClick={() => navigate('/card-transfer')}
          />
          <MenuItem
            icon={<CreditCardIcon className="w-6 h-6 text-blue-600" />}
            title="Запросить деньги"
            onClick={() => navigate('/card-transfer')}
          />
          <MenuItem
            icon={<BanknotesIcon className="w-6 h-6 text-blue-600" />}
            title="Наличными"
            onClick={() => navigate('/card-transfer')}
          />
        </div>

      </div>
    </div>
  );
}; 