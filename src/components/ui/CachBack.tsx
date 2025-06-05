export const CashBack = [
    {
      id: 1,
      logo: (
        <img
          src="/logos/CashBack/As.png" 
          className="w-12 h-12 object-contain"
          alt="As"
        />
      )
    },
    {
      id: 2,
      logo: (
        <img
          src="/logos/CashBack/OK.png" 
          className="w-12 h-12 object-contain"
          alt="OK"
        />
      )
    },
    {
      id: 3,
      logo: (
        <img
          src="/logos/CashBack/BB.png" 
          className="w-12 h-12 object-contain"
          alt="BB"
        />
      )
    },
    {
      id: 4,
      logo: (
        <img
          src="/logos/CashBack/Ozon.svg" 
          className="w-12 h-12 object-contain"
          alt="Ozon"
        />
      )
    },
    {
      id: 5,
      logo: (
        <img
          src="/logos/CashBack/DNS.png" 
          className="w-12 h-12 object-contain"
          alt="DNS"
        />
      )
    },
    {
      id: 6,
      logo: (
        <img
          src="/logos/CashBack/LA.png" 
          className="w-12 h-12 object-contain"
          alt="LA"
        />
      )
    },
    {
      id: 7,
      logo: (
        <img
          src="/logos/CashBack/Megamarket.webp" 
          className="w-12 h-12 object-contain"
          alt="Megamarket"
        />
      )
    },
    {
      id: 8,
      logo: (
        <img
          src="/logos/CashBack/vk.png" 
          className="w-12 h-12 object-contain"
          alt="VK"
        />
      )
    },
    {
      id: 9,
      logo: (
        <img
          src="/logos/CashBack/VI.png" 
          className="w-12 h-12 object-contain"
          alt="VI"
        />
      )
    },
    {
      id: 10,
      logo: (
        <img
          src="/logos/CashBack/wb.webp" 
          className="w-12 h-12 object-contain"
          alt="Wildberries"
        />
      )
    },
    {
      id: 11,
      logo: (
        <img
          src="/logos/CashBack/YM.webp" 
          className="w-12 h-12 object-contain"
          alt="Yandex Market"
        />
      )
    },
];

// Function to get random logos
export const getRandomLogos = (count: number = 4) => {
  const shuffled = [...CashBack].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};