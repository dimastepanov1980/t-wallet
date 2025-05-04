import { BanknotesIcon, ArrowsRightLeftIcon, LinkIcon, BuildingLibraryIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';
import { MenuItem } from '../components/MenuItem';
import { Header } from '../components/ui/Header';


export const TopUpPage = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Пополнить" />

      {/* Main content */}
      <div className="flex flex-col gap-4 p-4 pt-[calc(env(safe-area-inset-top))]">
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
            onClick={() => navigate(`/card-transfer/${accountId}`)}
          />
          <MenuItem
            icon={<CreditCardIcon className="w-6 h-6 text-blue-600" />}
            title="С карты другого банка"
            onClick={() => navigate(`/card-transfer/${accountId}`)}
          />
          <MenuItem
            icon={<CreditCardIcon className="w-6 h-6 text-blue-600" />}
            title="По реквизитам"
            onClick={() => navigate(`/card-transfer/${accountId}`)}
          />
          <MenuItem
            icon={<LinkIcon className="w-6 h-6 text-blue-600" />}
            title="По ссылке"
            onClick={() => navigate(`/card-transfer/${accountId}`)}
          />
          <MenuItem
            icon={<CreditCardIcon className="w-6 h-6 text-blue-600" />}
            title="Запросить деньги"
            onClick={() => navigate(`/card-transfer/${accountId}`)}
          />
          <MenuItem
            icon={<BanknotesIcon className="w-6 h-6 text-blue-600" />}
            title="Наличными"
            onClick={() => navigate(`/card-transfer/${accountId}`)}
          />
        </div>

      </div>
    </div>
  );
}; 