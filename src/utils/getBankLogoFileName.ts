const BANK_LOGOS: Record<string, string> = {
  'сбербанк': 'sberbank.svg',
  'газпромбанк': 'gazprombank.svg',
  'мкб': 'mkb.svg',
  'райффайзен': 'raiffeisen.svg',
  'тинькофф': 'tbank.svg',
  'втб': 'vtb.svg',
  'альфабанк': 'alfabank.svg',
  'росбанк': 'rosbank.svg',
  'россельхозбанк': 'rshb.svg',
  'совкомбанк': 'sovcombank.svg',
  
};

export function getBankLogoPath(bankName?: string): string | null {
  if (!bankName) return null;
  const normalized = bankName.toLowerCase().replace(/\s/g, '');

  for (const key in BANK_LOGOS) {
    if (normalized.includes(key)) {
      return `/logos/${BANK_LOGOS[key]}`;
    }
  }
  return null;
}