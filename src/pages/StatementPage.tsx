import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Account } from '../types/interface';
import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';
import CyrillicToTranslit from 'cyrillic-to-translit-js';

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

async function generateStatementPDF({ account, period, operationType, customPeriod, transactions }: { account: Account, period: string, operationType: string, customPeriod: {from: string, to: string}|null, transactions: any[] }) {
  //const existingPdfBytes = await fetch('/template/template.pdf').then(res => res.arrayBuffer());
//  const pdfDoc = await PDFDocument.load(existingPdfBytes);
 // const pdfDoc = await PDFDocument.create();
  //const [page] = pdfDoc.getPages();

  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]); // A4
  let pageNumber = 1;
  const totalPages = Math.ceil(transactions.length / 20); // Примерно 20 транзакций на страницу
  const pages = [currentPage];
  const lineHeight = 10;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const logoPngBytes = await fetch('/template/logo.png').then(res => res.arrayBuffer());
  const logoPng = await pdfDoc.embedPng(logoPngBytes);

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
  const ownerAddress = account.ownerAddress ? cyrillicToTranslit.transform(account.ownerAddress) : '127537 Moscow, Russia, 26, BLD. 26, 2 KHUTORSKAYA STREET';
  const accNumber = cyrillicToTranslit.transform(account.accountNumber);
  const contractNumber = account.contractNumber || '543212345278';
  const contractDate = account.contractDate || '14.02.2024';
  const docNumber = `# b 000${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = formatDateTimeToLines(new Date().toISOString())[0];
  /*
  for (let y = 800; y >= 50; y -= 50) {
    page.drawText(`Y = ${y}`, { x: 20, y, size: 8, color: rgb(1, 0, 0), font });
    page.drawLine({start: { x: 55, y: y }, end: { x: 540, y: y }, thickness: 1, color: rgb(0, 0.5, 0), });
    page.drawLine({start: { x: 55, y: y + 10 }, end: { x: 540, y: y + 10 }, thickness: 0.3, color: rgb(0.2, 0.2, 0.2), });
    page.drawLine({start: { x: 55, y: y + 20 }, end: { x: 540, y: y + 20 }, thickness: 0.3, color: rgb(0.2, 0.2, 0.2), });
    page.drawLine({start: { x: 55, y: y + 30 }, end: { x: 540, y: y + 30 }, thickness: 0.3, color: rgb(0.2, 0.2, 0.2), });
    page.drawLine({start: { x: 55, y: y + 40 }, end: { x: 540, y: y + 40 }, thickness: 0.3, color: rgb(0.2, 0.2, 0.2), });

  }
  for (let x = 50; x <= 500; x += 50) {
    page.drawText(`X = ${x}`, { x, y: 820, size: 8, color: rgb(0, 0, 1), font });
    page.drawLine({start: { x, y: 55 }, end: { x, y: 800 }, thickness: 1, color: rgb(0, 0.5, 0), });
  }
  */

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

  
  //page.drawText(accNumber, { x: 55, y: 755, size: 12, font, color: rgb(0,0,0) });
  //page.drawText(`Owner: ${accOwner}`, { x: 55, y: 735, size: 12, font, color: rgb(0,0,0) });
  //page.drawText(`Currency: ${accCurrency}`, { x: 55, y: 720, size: 12, font, color: rgb(0,0,0) });

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

  y -= 45;
  currentPage.drawText('Best regards,', { x: 55, y, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText('Head of Back-office Department', { x: 55, y: y - 16, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawText('E.S. Shadrina', { x: 450, y: y - 6, size: 9, font, color: rgb(0,0,0) });
  currentPage.drawImage(stampPng, { x: 350, y: y - 50, width: 166, height: 86 });

  // Добавляем footer на последнюю страницу
  drawFooter(currentPage, context, pageNumber, totalPages);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'statement.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

// Функция для отрисовки header на странице
const drawHeader = (page: PDFPage, context: DrawContext, isFirstPage: boolean = false) => {
  const { logoPng, font } = context;
  if (isFirstPage) {
    page.drawImage(logoPng, { x: 55, y: 765, width: 45, height: 45 });
    page.drawText("TBANK", { x: 300, y: 805, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
    page.drawText("38A, BLD. 26, 2 KHUTORSKAYA STREET, MOSCOW, 127287, RUSSIA.", { x: 300, y: 795, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
    page.drawText("TEL.: +7 (495) 648 1000, TBANK.RU.", { x: 300, y: 785, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
  }
};

// Функция для отрисовки footer на странице
const drawFooter = (page: PDFPage, context: DrawContext, pageNumber: number, totalPages: number) => {
  const { font } = context;
  page.drawLine({start: { x: 55, y: 65 }, end: { x: 540, y: 65 }, thickness: 0.3, color: rgb(0.7, 0.7, 0.7), });

  page.drawText("«TBank» universal license of Bank of Russia No 2673 c/a 30101810145250000974 Main Department Bank of Russia in the Central Federal District.", { x: 55, y: 55, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
  page.drawText("«BIC 044525974 TIC 7710140679 CRR 771301001", { x: 205, y: 40, size: 7.5, font, color: rgb(0.7,0.7,0.7) });
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
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [operationType, setOperationType] = useState('all');
  const [period, setPeriod] = useState('1m');
  const [customPeriod, setCustomPeriod] = useState<{from: string, to: string}|null>(null);
  const [loading, setLoading] = useState(false);

  const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
  const transactions = selectedAcc?.cards.flatMap(card => card.transactions) || [];

  const handleGenerate = async () => {
    if (!selectedAcc) return;
    setLoading(true);
    await generateStatementPDF({ account: selectedAcc, period, operationType, customPeriod, transactions });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-6">Account Statement</div>
      <div className="mb-4">
        <div className="text-gray-600 mb-2">Select Account</div>
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
        <div className="text-gray-600 mb-2">Transaction Type</div>
        <select
          className="w-full p-4 rounded-xl bg-gray-100 text-lg font-medium"
          value={operationType}
          onChange={e => setOperationType(e.target.value)}
        >
          <option value="all">All transactions</option>
          <option value="incoming">Incoming only</option>
          <option value="outgoing">Outgoing only</option>
        </select>
      </div>
      <div className="mb-4">
        <div className="text-gray-600 mb-2">Period</div>
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
            Custom period
          </button>
        </div>
        {period==='custom' && (
          <div className="flex gap-2 mt-2">
            <input type="date" className="p-2 rounded-xl border border-gray-200" value={customPeriod?.from||''} onChange={e=>setCustomPeriod(cp=>({from:e.target.value, to:cp?.to||''}))} />
            <input type="date" className="p-2 rounded-xl border border-gray-200" value={customPeriod?.to||''} onChange={e=>setCustomPeriod(cp=>({from:cp?.from||'', to:e.target.value}))} />
          </div>
        )}
      </div>
      <button
        className="w-full h-14 flex justify-center items-center rounded-xl text-m font-light text-black bg-[#ffdd2d] hover:bg-[#ffd42d] disabled:opacity-50 mt-auto"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Statement'}
      </button>
    </div>
  );
};
