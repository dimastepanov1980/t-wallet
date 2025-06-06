import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Account, User } from '../types/interface';
import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { APP_IS_DEMO } from '../config';

const cyrillicToTranslit = CyrillicToTranslit();

const periods = [
  { label: '1 month', value: '1m' },
  { label: '3 months', value: '3m' },
  { label: '6 months', value: '6m' },
  { label: '12 months', value: '12m' },
];

interface DrawContext {
  pdfDoc: PDFDocument;
  font: PDFFont;
  fontBold: PDFFont;
  logoPng: PDFImage;
  stampPng: PDFImage;
  lineHeight: number;
}

function formatDateTimeToLines(isoString: string): [string, string] {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы с 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const dateStr = `${day}.${month}.${year}`;
  const timeStr = `${hours}:${minutes}`;

  return [dateStr, timeStr];
}

async function generateStatementPDF({ account, user, period, operationType, customPeriod, transactions }: { 
  account: Account, 
  user: User,
  period: string, 
  operationType: string, 
  customPeriod: {from: string, to: string}|null, 
  transactions: any[] 
}): Promise<Blob> {

  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]); // A4
  let pageNumber = 1;
  const totalPages = Math.ceil(transactions.length / 20); // Примерно 20 транзакций на страницу
  const pages = [currentPage];
  const lineHeight = 10;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const logoPngBytes = await fetch('/template/logo.png').then(res => res.arrayBuffer());
  const tbLogo = await fetch('/logos/Tb-Logo.png').then(res => res.arrayBuffer());
  
  const logoPng = await pdfDoc.embedPng(APP_IS_DEMO === 'true' ? tbLogo : logoPngBytes);

  const stampPngBytes = await fetch('/template/stamp.png').then(res => res.arrayBuffer());
  const stampPng = await pdfDoc.embedPng(stampPngBytes);

  const context: DrawContext = {
    pdfDoc,
    font,
    fontBold,
    logoPng,
    stampPng,
    lineHeight
  };

  // Транслитерируем все строки
  const ownerName = cyrillicToTranslit.transform(account.ownerName);
  const ownerAddress = cyrillicToTranslit.transform(user.address || '127537 Moscow, Russia, 26, BLD. 26, 2 KHUTORSKAYA STREET');
  const accNumber = cyrillicToTranslit.transform(account.accountNumber);
  const contractNumber = account.contractNumber || '543212345278';
  const contractDate = account.dateСreation || '14.02.2024';
  const docNumber = `# b 000${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = formatDateTimeToLines(new Date().toISOString())[0];
  
  // Header
  drawHeader(currentPage, context, true);

  // Footer
  drawFooter(currentPage, context, pageNumber, totalPages);
  
  // Title
  currentPage.drawText('Document on the movement funds', { x: 55, y: 740, size: 20, font, color: rgb(0,0,0)});
  currentPage.drawText(docNumber, { x: 55, y: 715, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText(dateStr, { x: 495, y: 715, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText(ownerName, { x: 55, y: 690, size: 8, font, color: rgb(0,0,0) });
  currentPage.drawLine({start: { x: 55, y: 685 }, end: { x: 540, y: 685 }, thickness: 0.3, color: rgb(0.5, 0.5, 0.5), });

  currentPage.drawText(`Home address:`, { x: 55, y: 675, size: 8, font: fontBold, color: rgb(0,0,0) });
  currentPage.drawText(`${ownerAddress}`, { x: 117, y: 675, size: 8, font: font, color: rgb(0,0,0) });
  currentPage.drawLine({start: { x: 55, y: 670 }, end: { x: 540, y: 670 }, thickness: 0.3, color: rgb(0.5, 0.5, 0.5), });

  currentPage.drawText('About the product', { x: 55, y: 640, size: 14, font: fontBold, color: rgb(0,0,0)});

  currentPage.drawText('Date of conclusion of the contract:', { x: 55, y: 615, size: 8, font: fontBold, color: rgb(0,0,0)});
  currentPage.drawText(`${contractDate}`, { x: 190, y: 615, size: 8, font: font, color: rgb(0,0,0)});

  currentPage.drawLine({start: { x: 55, y: 610 }, end: { x: 540, y: 610 }, thickness: 0.3, color: rgb(0.5, 0.5, 0.5), });

  currentPage.drawText('Contract number:', { x: 55, y: 600, size: 8, font: fontBold, color: rgb(0,0,0)});
  currentPage.drawText(`${contractNumber}`, { x: 125, y: 600, size: 8, font: font, color: rgb(0,0,0)});
  currentPage.drawLine({start: { x: 55, y: 595 }, end: { x: 540, y: 595 }, thickness: 0.3, color: rgb(0.5, 0.5, 0.5), });

  currentPage.drawText('Personal account number:', { x: 55, y: 585, size: 8, font: fontBold, color: rgb(0,0,0)});
  currentPage.drawText(`${accNumber}`, { x: 160, y: 585, size: 8, font: font, color: rgb(0,0,0)});

  currentPage.drawLine({start: { x: 55, y: 580 }, end: { x: 540, y: 580 }, thickness: 0.3, color: rgb(0.5, 0.5, 0.5), });

  let periodText = '';

  if (period === 'custom' && customPeriod) {
    const [fromDateStr] = formatDateTimeToLines(customPeriod.from);
    const [toDateStr] = formatDateTimeToLines(customPeriod.to);
    periodText = `${fromDateStr} to ${toDateStr}`;
  } else {
    const now = new Date();
    let fromDate = new Date();
    if (period === '1m') fromDate.setMonth(now.getMonth() - 1);
    if (period === '3m') fromDate.setMonth(now.getMonth() - 3);
    if (period === '6m') fromDate.setMonth(now.getMonth() - 6);
    if (period === '12m') fromDate.setMonth(now.getMonth() - 12);
    
    const [fromDateStr] = formatDateTimeToLines(fromDate.toISOString());
    const [toDateStr] = formatDateTimeToLines(now.toISOString());
    periodText = `${fromDateStr} to ${toDateStr}`;
  }
  currentPage.drawText(`Movement of funds for the period from ${periodText}`, { x: 55, y: 560, size: 12, font, color: rgb(0,0,0) });

  let filteredTransactions = transactions;
  // Сортируем транзакции по дате и времени (от новых к старым)
  filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (operationType !== 'all') {
    filteredTransactions = filteredTransactions.filter(t => t.type === operationType);
  }
  const [from, to] = period === 'custom' && customPeriod ? 
    [new Date(customPeriod.from), new Date(customPeriod.to)] : 
    (() => {
      const now = new Date();
      let fromDate = new Date();
      if (period === '1m') fromDate.setMonth(now.getMonth() - 1);
      if (period === '3m') fromDate.setMonth(now.getMonth() - 3);
      if (period === '6m') fromDate.setMonth(now.getMonth() - 6);
      if (period === '12m') fromDate.setMonth(now.getMonth() - 12);
      return [fromDate, now];
    })();
  filteredTransactions = filteredTransactions.filter(t => {
    const d = new Date(t.date);
    return d >= from && d <= to;
  });

  // Table body 
  let totalIn = 0, totalOut = 0;
  let transactionsPerPage = 0;
  let y = drawTable(currentPage, context, true);

  for (const t of filteredTransactions) {
    if (transactionsPerPage >= (pageNumber === 1 ? 21 : 34)) {
      drawFooter(currentPage, context, pageNumber, totalPages);
      currentPage = pdfDoc.addPage([595, 842]);
      pages.push(currentPage);
      pageNumber++;
      drawHeader(currentPage, context, false);
      y = drawTable(currentPage, context, false);
      transactionsPerPage = 0;
    }

    const isIn = t.type === 'incoming';
    const [date, time] = formatDateTimeToLines(t.date);

    const amountStr = `${isIn ? '+' : '-'}${Math.abs(t.amount).toFixed(2)} P`;
    if (isIn) totalIn += t.amount; else totalOut += t.amount;
    currentPage.drawText(cyrillicToTranslit.transform( date || ''), { x: 55, y: y - 2, size: 8, font, color: rgb(0,0,0) });
    currentPage.drawText(cyrillicToTranslit.transform( time || ''), { x: 55, y: y - lineHeight, size: 8, font, color: rgb(0,0,0) });

    currentPage.drawText(cyrillicToTranslit.transform( date || ''), { x: 140, y: y - 2, size: 8, font, color: rgb(0,0,0) });
    currentPage.drawText(cyrillicToTranslit.transform( time || ''), { x: 140, y: y - lineHeight, size: 8, font, color: rgb(0,0,0) });

    currentPage.drawText(amountStr, { x: 240, y: y - 6, size: 8, font, color: rgb(0,0,0) });
    currentPage.drawText(cyrillicToTranslit.transform(t.description || ''), { x: 350, y: y - 6, size: 8, font, color: rgb(0,0,0) });
    const cardNumber = t.cardNumber || '';
    const lastFourDigits = cardNumber.replace(/\D/g, '').slice(-4);
    currentPage.drawText(`*${lastFourDigits}`, { x: 510, y: y - 6, size: 8, font, color: rgb(0,0,0) });
    currentPage.drawLine({start: { x: 55, y: y - lineHeight - 4 }, end: { x: 540, y: y - lineHeight - 4 }, thickness: 0.3, color: rgb(0.5, 0.5, 0.5), });
    y -= 20;
    transactionsPerPage++;
  }

  // Signature and stamp (только на последней странице)
  y -= 20;
  currentPage.drawText('Replenishment:', { x: 55, y, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText(`+${totalIn.toFixed(2)} P`, { x: 120, y, size: 9, font, color: rgb(0,0,0) });
  y -= 25;
  currentPage.drawText('Expenses:', { x: 55, y, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText(`-${Math.abs(totalOut).toFixed(2)} P`, { x: 100, y, size: 9, font, color: rgb(0,0,0) });

  if (APP_IS_DEMO !== 'true') {
  y -= 45;
  currentPage.drawText('Best regards,', { x: 55, y, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText('Head of Back-office Department', { x: 55, y: y - 16, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText('E.S. Shadrina', { x: 450, y: y - 6, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawImage(stampPng, { x: 350, y: y - 80, width: 190, height: 100 });
  }
  // Добавляем footer на последнюю страницу
  drawFooter(currentPage, context, pageNumber, totalPages);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return blob;
}

// Функция для отрисовки header на странице
const drawHeader = (page: PDFPage, context: DrawContext, isFirstPage: boolean = false) => {
  const { logoPng, font } = context;
  const name = APP_IS_DEMO === 'true' ? 'Tb-Wallet' : 'TBANK';
  const address = APP_IS_DEMO === 'true' ? 'MOSCOW, 123456, RUSSIA.' : '38A, BLD. 26, 2 KHUTORSKAYA STREET, MOSCOW, 127287, RUSSIA.';
  const phone = APP_IS_DEMO === 'true' ? 'TEL.: +7 (123) 456 7890' : 'TEL.: +7 (495) 648 1000, TBANK.RU.';

  if (isFirstPage) {
    page.drawImage(logoPng, { x: 55, y: 765, width: 45, height: 45 });
    page.drawText(name, { x: 300, y: 805, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
    page.drawText(address, { x: 300, y: 795, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
    page.drawText(phone, { x: 300, y: 785, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
  }
};

// Функция для отрисовки footer на странице
const drawFooter = (page: PDFPage, context: DrawContext, pageNumber: number, totalPages: number) => {
  const { font } = context;
  const license = APP_IS_DEMO === 'true' ? '«Tb-Wallet» universal wallet from Russia' : '«TBank» universal license of Bank of Russia No 2673 c/a 30101810145250000974 Main Department Bank of Russia in the Central Federal District.';
  const bic = APP_IS_DEMO === 'true' ? 'Only for Demo Use' : 'BIC 044525974';
  page.drawLine({start: { x: 55, y: 65 }, end: { x: 540, y: 65 }, thickness: 0.3, color: rgb(0.7, 0.7, 0.7), });

  page.drawText(license, { x: 55, y: 55, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
  page.drawText(bic, { x: 205, y: 40, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
  page.drawText(`${pageNumber} of ${totalPages}`, { x: 510, y: 40, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
};

// Функция для отрисовки таблицы
const drawTable = (page: PDFPage, context: DrawContext, isFirstPage: boolean = false) => {
  const { font, lineHeight } = context;
  let y = isFirstPage ? 540 : 780;
  page.drawText('Date and time', { x: 55, y: y, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('of the transaction', { x: 55, y: y - lineHeight, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('Date of processing', { x: 140, y: y, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('of the transaction', { x: 140, y: y - lineHeight, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('Transaction amount', { x: 240, y: y, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('and its currency', { x: 240, y: y - lineHeight, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('Transaction description', { x: 350, y: y, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('Card', { x: 510, y: y, size: 8, font, color: rgb(0, 0, 0)});
  page.drawText('number', { x: 510, y: y - lineHeight, size: 8, font, color: rgb(0, 0, 0)});
  page.drawLine({start: { x: 55, y: y - lineHeight - 4 }, end: { x: 540, y: y - lineHeight - 4 }, thickness: 0.3, color: rgb(0.5, 0.5, 0.5), });
  return y - 20;
};


export const StatementPage = () => {
  const { accounts } = useSelector((state: RootState) => state.accounts);
  const user = useSelector((state: RootState) => state.auth);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [operationType, setOperationType] = useState('all');
  const [period, setPeriod] = useState('1m');
  const [customPeriod, setCustomPeriod] = useState<{from: string, to: string}|null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
  const transactions = selectedAcc?.cards.flatMap(card => card.transactions) || [];

  const handleGenerate = async () => {
    if (!selectedAcc) return;
    setLoading(true);
    const pdfBlob = await generateStatementPDF({ account: selectedAcc, user, period, operationType, customPeriod, transactions });
    setLoading(false);
    const pdfUrl = URL.createObjectURL(pdfBlob); 
    navigate('/statement-created', { state: { pdfUrl } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <Header title="Выписка по счету"  />
      <div className="mb-4 pt-10">
        <div className="text-gray-600 mb-2">Выберите счет</div>
        <select
          className="w-full p-4 rounded-xl bg-gray-100 text-lg font-medium mb-2"
          value={selectedAccount}
          onChange={e => setSelectedAccount(e.target.value)}
        >
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.name} — {acc.balance.toLocaleString('en-US', { style: 'currency', currency: acc.currency })}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <div className="text-gray-600 mb-2">Тип транзакции</div>
        <select
          className="w-full p-4 rounded-xl bg-gray-100 text-lg font-medium"
          value={operationType}
          onChange={e => setOperationType(e.target.value)}
        >
          <option value="all">Все транзакции</option>
          <option value="incoming">Только пополнения</option>
          <option value="outgoing">Только снятие</option>
        </select>
      </div>
      <div className="mb-4">
        <div className="text-gray-600 mb-2">Период</div>
        <div className="flex gap-2 flex-wrap mb-2">
          {periods.map(p => (
            <button
              key={p.value}
              className={`px-4 py-2 rounded-full border ${period===p.value?'bg-blue-500 text-white border-blue-500':'bg-gray-100 text-gray-700 border-gray-200'}`}
              onClick={()=>{setPeriod(p.value); setCustomPeriod(null);}}
            >
              {p.label}
            </button>
          ))}
          <button
            className={`px-4 py-2 rounded-full border ${period==='custom'?'bg-blue-500 text-white border-blue-500':'bg-gray-100 text-gray-700 border-gray-200'}`}
            onClick={()=>setPeriod('custom')}
          >
            Выбрать период
          </button>
        </div>
        {period==='custom' && (
          <div className="flex gap-2 mt-2">
            <input type="date" className="bg-white p-2 rounded-xl border border-gray-200" value={customPeriod?.from||''} onChange={e=>setCustomPeriod(cp=>({from:e.target.value, to:cp?.to||''}))} />
            <input type="date" className="bg-white p-2 rounded-xl border border-gray-200" value={customPeriod?.to||''} onChange={e=>setCustomPeriod(cp=>({from:cp?.from||'', to:e.target.value}))} />
          </div>
        )}
      </div>
      <button
        className="fixed bottom-[100px] left-4 right-4 h-14 flex justify-center items-center rounded-xl text-m font-light text-black bg-[#ffdd2d] hover:bg-[#ffd42d] disabled:opacity-50 mt-auto"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Statement'}
      </button>
    </div>
  );
};
