import { useLocation } from 'react-router-dom';

export const StatementCreatedPage = ({ onSendEmail, onDone }: { onSendEmail: () => void, onDone: () => void }) => {
  const location = useLocation();
  const pdfUrl = location.state?.pdfUrl;

  const handleOpen = () => {
    if (pdfUrl) window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-xl font-semibold mt-4 mb-8">С движением средств</div>
      <div className="bg-white rounded-2xl shadow-md flex flex-col items-center p-8 w-full max-w-md">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#22C55E"/><path d="M12 21.5L18 27.5L28 15.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="text-lg font-medium mb-2">Создали справку</div>
        <div className="flex gap-4 mb-6 mt-2">
          <button onClick={onSendEmail} className="flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M2 6.5V17a2 2 0 002 2h16a2 2 0 002-2V6.5M2 6.5L12 13l10-6.5M2 6.5L12 13l10-6.5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-1 text-sm">Отправить на e-mail</span>
          </button>
          <button onClick={handleOpen} className="flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-1 text-sm">Открыть справку</span>
          </button>
        </div>
      </div>
      <button onClick={onDone} className="w-full max-w-md mt-8 h-14 flex justify-center items-center rounded-xl text-lg font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition">
        Готово
      </button>
    </div>
  );
}; 