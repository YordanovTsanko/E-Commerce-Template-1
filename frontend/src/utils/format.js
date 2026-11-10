import { SITE } from "../config/site";

const priceFormatter = new Intl.NumberFormat(SITE.locale, {
  style: "currency",
  currency: SITE.currency,
  minimumFractionDigits: 2,
});

export const formatPrice = (value) => priceFormatter.format(Number(value) || 0);

export const formatDate = (value, withTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(SITE.locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

export const shortId = (id = "") => String(id).slice(-6).toUpperCase();

export const ORDER_STATUS = {
  proccessing: { label: "Обработва се", color: "warning" },
  processing: { label: "Обработва се", color: "warning" },
  shipped: { label: "Изпратена", color: "info" },
  delivered: { label: "Доставена", color: "success" },
  cancelled: { label: "Отказана", color: "error" },
};

export const orderStatus = (status) =>
  ORDER_STATUS[status] || { label: status || "Неизвестен", color: "default" };

// Сума на продуктите + доставка (безплатна над прага).
export const calcTotals = (items = []) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const shipping =
    subtotal === 0 || subtotal >= SITE.freeShippingFrom ? 0 : SITE.shippingPrice;
  const vat = subtotal - subtotal / (1 + SITE.vatRate);
  return {
    subtotal: round(subtotal),
    shipping: round(shipping),
    vat: round(vat),
    total: round(subtotal + shipping),
  };
};

export const round = (n) => Math.round(n * 100) / 100;
