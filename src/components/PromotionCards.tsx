import React from 'react';
import { Header } from './ui/Header';
import { PromotionCard } from './PromotionCard';

const promotions = [
    {
    title: 'Кэшбэк 30%',
    subtitle: 'На одну покупку онлайн',
    price: '1 500 ₽',
    expirationDate: 'До 11 июня',
    backgroundColor: 'rgb(232, 244, 255)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItOTY2My1pbWFnZTEyNTItOWI4NGJkZjYucG5n',
    partnerName: 'Лента Доставка',
    partnerDescription: 'Сервис доставки продуктов',
    partnerLogo: '/logos/partner-9663-image280-39f63a9e.png'
    },
    {
    title: 'Скидка 600 ₽',
    subtitle: 'На одну покупку онлайн',
    price: '1 500 ₽',
    expirationDate: 'До 11 июня',
    backgroundColor: 'rgb(255, 229, 223)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItMTA5NzctaW1hZ2UxMjUyLWViZjBjNjZhLnBuZw==',
    partnerName: 'Яндекс Маркет',
    partnerDescription: 'Маркетплейс от Яндекса',
    partnerLogo: '/logos/partner-10977-image280-b4b9567d.png'
    },
    {
    title: 'Кэшбэк 40%',
    subtitle: 'На одну покупку онлайн',
    price: '400 ₽',
    expirationDate: 'До 30 июня',
    backgroundColor: 'rgb(255, 227, 239)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTQwNS1pbWFnZTEyNTItYzdiOGU2NmYucG5n',
    partnerName: 'Самокат',
    partnerDescription: 'Онлайн-магазин с экспресс-доставкой',
    partnerLogo: '/logos/partner-5405-image280-79f9494b.png'
    },
    {
    title: 'Кэшбэк 6%',
    subtitle: 'На покупки онлайн',
    price: '',
    expirationDate: 'До 20 сентября',
    backgroundColor: 'rgb(221, 255, 237)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItOTg3MS1pbWFnZTEyNTItOTRhZGQ1MmMucG5n',
    partnerName: 'МегаФон',
    partnerDescription: 'Интернет-магазин электроники',
    partnerLogo: '/logos/partner-4344-image280-d565bc34.png'
    },
    {
    title: 'Скидка 30%',
    subtitle: 'На одну покупку онлайн',
    price: '1 600 ₽',
    expirationDate: 'До 11 июня',
    backgroundColor: 'rgb(199, 251, 207)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNzQ5NC1pbWFnZTEyNTItNjk1NzM4M2MucG5n',
    partnerName: 'Купер',
    partnerDescription: 'Сервис доставки из магазинов и ресторанов',
    partnerLogo: '/logos/partner-7494-image280-cece06bc.png'
    },
    {
    title: 'Кэшбэк 10%',
    subtitle: 'На одну покупку на кассе',
    price: '',
    expirationDate: 'До 30 июня',
    backgroundColor: 'rgb(228, 245, 255)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItMjY3OS1pbWFnZTEyNTItM2QzODliODkucG5n',
    partnerName: 'Леонардо',
    partnerDescription: 'Сеть гипермаркетов товаров для творчества и рукоделия',
    partnerLogo: '/logos/merchant-image280-merchant_2679.jpg'
    },
    {
    title: 'Кэшбэк 5%',
    subtitle: 'На одну покупку онлайн',
    price: '',
    expirationDate: 'До 11 июня',
    backgroundColor: 'rgb(230, 255, 227)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTA3My1pbWFnZTEyNTItYmQzYzVlMGMucG5n',
    partnerName: 'Туры в Т-Банке',
    partnerDescription: 'Сервис для поиска и бронирования туров',
    partnerLogo: '/logos/partner-image280-ba53ec89a52546fb92df0aa0636ac38f.png'
    },
    {
    title: 'Кэшбэк до 7%',
    subtitle: 'На покупки онлайн',
    price: '',
    expirationDate: 'До 31 декабря',
    backgroundColor: 'rgb(255, 250, 226)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTAzOC1pbWFnZTEyNTItN2ZiYWFmYzIucG5n',
    partnerName: 'Авиа в Т-Банке',
    partnerDescription: 'Сервис для поиска и покупки авиабилетов',
    partnerLogo: '/logos/partner-image280-b2b7eccb4b3a451883aa0de614b6dff1.png'
    },
    {
    title: 'Кэшбэк до 7%',
    subtitle: 'На покупки онлайн',
    price: '',
    expirationDate: 'До 12 июня',
    backgroundColor: 'rgb(255, 249, 227)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItaW1hZ2UxMjUyLTVjZDlmNWQ5MDRiYzQxNDRiNTgzNzllYmI1MWM3ZGRhLnBuZw==',
    partnerName: 'Столото',
    partnerDescription: 'Государственные лотереи',
    partnerLogo: '/logos/merchant-image280-merchant_5211.png'
    },
    {
    title: 'Кэшбэк 18%',
    subtitle: 'На покупки онлайн',
    price: 'от 3 000 ₽',
    expirationDate: 'Последний день',
    backgroundColor: 'rgb(224, 244, 255)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTMyNi1pbWFnZTEyNTItM2M4NTRhNDIucG5n',
    partnerName: 'ЕАПТЕКА',
    partnerDescription: 'Интернет-аптека с самовывозом и доставкой',
    partnerLogo: '/logos/partner-5326-image280-b83c6389.png'
    },
    {
    title: 'Кэшбэк 10%',
    subtitle: 'На покупки онлайн',
    price: '',
    expirationDate: 'До 30 июня',
    backgroundColor: 'rgb(255, 250, 214)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItMTA2NDUtaW1hZ2UxMjUyLWYxZmFlYTI5LnBuZw==',
    partnerName: 'Яндекс Путешествия',
    partnerDescription: 'Сервис поиска жилья в России и по всему миру',
    partnerLogo: '/logos/partner-10645-image280-a64ac69c.png'
    },
    {
    title: 'Кэшбэк 30%',
    subtitle: 'На одну покупку онлайн',
    price: '1 500 ₽',
    expirationDate: 'До 11 июня',
    backgroundColor: 'rgb(225, 255, 224)',
    backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItMTM2MTgtaW1hZ2UxMjUyLTU0ZmI4NTlmLnBuZw==',
    partnerName: 'Перекрёсток',
    partnerDescription: 'Доставка из Перекрёстка за 60 минут',
    partnerLogo: '/logos/partner-5897-image280-23b389f7.png'
    },
    {
        title: 'Кэшбэк 5%',
        subtitle: 'На одну покупку онлайн',
        price: '',
        expirationDate: 'До 11 июня',
        backgroundColor: 'rgb(230, 255, 227)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTA3My1pbWFnZTEyNTItYmQzYzVlMGMucG5n',
        partnerName: 'Туры в Т-Банке',
        partnerDescription: 'Сервис для поиска и бронирования туров',
        partnerLogo: '/logos/partner-image280-ba53ec89a52546fb92df0aa0636ac38f.png'
    },
    {
        title: 'Кэшбэк до 7%',  
        subtitle: 'На покупки онлайн',
        price: '',
        expirationDate: 'До 31 декабря',
        backgroundColor: 'rgb(255, 250, 226)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTAzOC1pbWFnZTEyNTItN2ZiYWFmYzIucG5n',
        partnerName: 'Авиа в Т-Банке',
        partnerDescription: 'Сервис для поиска и покупки авиабилетов',
        partnerLogo: '/logos/partner-image280-b2b7eccb4b3a451883aa0de614b6dff1.png'
    },
    {
        title: 'Кэшбэк до 7%',
        subtitle: 'На покупки онлайн',
        price: '',
        expirationDate: 'До 12 июня',
        backgroundColor: 'rgb(255, 249, 227)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItaW1hZ2UxMjUyLTVjZDlmNWQ5MDRiYzQxNDRiNTgzNzllYmI1MWM3ZGRhLnBuZw==',
        partnerName: 'Столото',
        partnerDescription: 'Государственные лотереи',
        partnerLogo: '/logos/merchant-image280-merchant_5211.png'
    },
    {
        title: 'Кэшбэк 18%',
        subtitle: 'На покупки онлайн',
        price: 'от 3 000 ₽',
        expirationDate: 'Последний день',
        backgroundColor: 'rgb(224, 244, 255)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTMyNi1pbWFnZTEyNTItM2M4NTRhNDIucG5n',
        partnerName: 'ЕАПТЕКА',
        partnerDescription: 'Интернет-аптека с самовывозом и доставкой',
        partnerLogo: '/logos/partner-5326-image280-b83c6389.png'
    },
    {
        title: 'Кэшбэк 10%',
        subtitle: 'На покупки онлайн',
        price: '',
        expirationDate: 'До 30 июня',
        backgroundColor: 'rgb(255, 250, 214)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItMTA2NDUtaW1hZ2UxMjUyLWYxZmFlYTI5LnBuZw==',
        partnerName: 'Яндекс Путешествия',
        partnerDescription: 'Сервис поиска жилья в России и по всему миру',
        partnerLogo: '/logos/partner-10645-image280-a64ac69c.png'
    },
    {
        title: 'Кэшбэк 7%',
        subtitle: 'На одну покупку онлайн',
        price: '',
        expirationDate: 'До 30 июня',
        backgroundColor: 'rgb(255, 226, 231)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItaW1hZ2UxMjUyLTBjZjA4YTMxMGI1ZjRiZjRiZTMxYjBmYzBmMDllZTAzLnBuZw==',
        partnerName: 'EKONIKA',
        partnerDescription: 'Женская обувь, сумки и аксессуары',
        partnerLogo: '/logos/partner-12105-image280-65a19806.png'
      },
      {
        title: 'Кэшбэк 40%',
        subtitle: 'На одну покупку онлайн',
        expirationDate: 'До 11 июня',
        backgroundColor: 'rgb(224, 255, 235)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNDE5OC1pbWFnZTEyNTItMzc4OTZiYjYucG5n',
        partnerName: 'Grow Food',
        partnerDescription: 'Доставка готовых блюд на неделю по подписке',
        partnerLogo: '/logos/partner-4198-image280-938158d5.png'
      },
      {
        title: 'Кэшбэк 25%',
        subtitle: 'На покупки онлайн',
        price: '',
        expirationDate: 'До 11 июня',
        backgroundColor: 'rgb(243, 227, 255)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItaW1hZ2UxMjUyLTM1MmJmODM3NTUxYTQ1OTk5N2Q2MTFmMWIzYWQ4MjU2LnBuZw==',
        partnerName: 'МТС Юрент',
        partnerDescription: 'Сервис аренды электросамокатов',
        partnerLogo: '/logos/partner-image280-40a32e3dfc0a4c59b298b02f21d44c2f.png'
      },
      {
        title: 'Кэшбэк 25%',
        subtitle: 'На одну покупку онлайн',
        price: '',
        expirationDate: 'До 30 июня',
        backgroundColor: 'rgb(227, 240, 255)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNDQ5MS1pbWFnZTEyNTItM2NjZDMyYmYucG5n',
        partnerName: 'Облако Mail',
        partnerDescription: 'Облачное хранилище',
        partnerLogo: '/logos/partner-4491-image280-48b6948e.png'
      },
      {
        title: 'Кэшбэк 8%',
        subtitle: 'На покупки онлайн',
        price: 'от 8 000 ₽',
        expirationDate: 'До 11 июня',
        backgroundColor: 'rgb(255, 225, 227)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItODcyOS1pbWFnZTEyNTItOTcyMjEwYzcucG5n',
        partnerName: 'М.Видео',
        partnerDescription: 'Интернет-магазин бытовой техники и электроники',
        partnerLogo: '/logos/partner-8729-image280-99c6d0ef.png'
      },
      {
        title: 'Кэшбэк 10%',
        subtitle: 'На одну покупку онлайн',
        price: '',
        expirationDate: 'До 30 июня',
        backgroundColor: 'rgb(227, 255, 236)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItNTkxNC1pbWFnZTEyNTItZGU2OWI2YTAucG5n',
        partnerName: 'ВкусМил от ВкусВилл',
        partnerDescription: 'Доставка рационов здоровой еды на несколько дней',
        partnerLogo: '/logos/partner-5914-image280-319cca2e.png'
      },
      {
        title: 'Кэшбэк до 12% на 1 покупку',
        subtitle: 'На одну покупку онлайн',
        price: '',
        expirationDate: 'До 13 июня',
        backgroundColor: 'rgb(255, 241, 225)',
        backgroundImage: 'https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9tcy1zdGF0aWMtaW1hZ2VzLnQtc3RhdGljLnJ1L3BhcnRuZXItaW1hZ2UxMjUyLTY2MzZlODVhMjU1ZjRmMTQ5YzAxOTgwOWE4MThiYzYyLnBuZw==',
        partnerName: 'ИЛЬ ДЕ БОТЭ',
        partnerDescription: 'Парфюмерия и премиальная косметика',
        partnerLogo: '/logos/partner-5390-image280-88768abf.png'
      }

];

export const PromotionCards: React.FC = () => {
  const handleLikeClick = (index: number) => {
    // Handle like click here
    console.log(`Liked promotion ${index}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Акции и кэшбэк"/>
      <div className="container mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion, index) => (
            <PromotionCard
              key={index}
              {...promotion}
              onLikeClick={() => handleLikeClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 