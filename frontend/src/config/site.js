// Централни настройки на магазина — сменете данните тук и те се обновяват навсякъде.
export const SITE = {
  name: "Магазин",
  tagline: "Онлайн магазин за мода, техника и спорт",
  email: "kontakt@vitrina.bg",
  phone: "+359 88 123 4567",
  address: "ул. „Примерна“ 1, 1000 София",
  workingHours: "Пон – Пет: 9:00 – 18:00",
  shippingPrice: 5,
  freeShippingFrom: 100,
  currency: "EUR",
  locale: "bg-BG",
  vatRate: 0.2,
};

// Категориите съвпадат 1:1 с enum-а в бекенда (models/products.js).
export const CATEGORIES = [
  {
    slug: "woman cloths",
    label: "Дамско облекло",
    note: "Рокли, блузи и всекидневни комплекти",
    img: "https://img.freepik.com/free-psd/front-view-young-woman-posing-studio_23-2150767239.jpg",
  },
  {
    slug: "man cloths",
    label: "Мъжко облекло",
    note: "Костюми, суитшърти и дънки",
    img: "https://img.freepik.com/free-photo/handsome-confident-hipster-modelsexy-unshaven-man-dressed-summer-stylish-green-hoodie-jeans-clothes-fashion-male-with-curly-hairstyle-posing-studio-isolated-grey_158538-26652.jpg",
  },
  {
    slug: "shoes",
    label: "Обувки",
    note: "За бягане, град и официални поводи",
    img: "https://t4.ftcdn.net/jpg/03/83/72/35/360_F_383723590_htmZf74auhyhPFvQUGQecrt4ZA7VzuYW.jpg",
  },
  {
    slug: "electronics",
    label: "Електроника",
    note: "Телефони, слушалки и аксесоари",
    img: "https://st.depositphotos.com/1000128/2454/i/450/depositphotos_24542943-stock-photo-mobile-devices-wireless-communication-technology.jpg",
  },
  {
    slug: "jewelry",
    label: "Бижута",
    note: "Пръстени, колиета и часовници",
    img: "https://media.vogue.co.uk/photos/64dce2c1480c439ed1d699a1/master/pass/Checklist_Header.jpg",
  },
  {
    slug: "gym accessories",
    label: "Фитнес аксесоари",
    note: "Дъмбели, ластици и постелки",
    img: "https://m.media-amazon.com/images/I/91HYpPZGKSL._AC_UY1100_.jpg",
  },
];

export const categoryLabel = (slug) =>
  CATEGORIES.find((c) => c.slug === slug)?.label || slug;

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80";
