import React from "react";
import { SITE } from "../../config/site";
import { calcTotals, formatPrice } from "../../utils/format";

const OrderSummary = ({ items, title = "Обобщение", children, showItems = false }) => {
  const t = calcTotals(items);
  const missing = SITE.freeShippingFrom - t.subtotal;

  return (
    <aside className="summary" aria-label={title}>
      <h2>{title}</h2>
      {showItems && (
        <div className="mini-items">
          {items.map((i) => (
            <div className="mini-item" key={i._id || i.product}>
              <img src={i.image} alt="" />
              <span title={i.name}>{i.quantity} × {i.name}</span>
              <strong>{formatPrice(i.price * i.quantity)}</strong>
            </div>
          ))}
        </div>
      )}
      {t.subtotal > 0 && missing > 0 && (
        <div className="free-ship">
          Добавете продукти за още {formatPrice(missing)} и доставката ще е безплатна.
        </div>
      )}
      <div className="summary__row"><span>Продукти</span><strong>{formatPrice(t.subtotal)}</strong></div>
      <div className="summary__row">
        <span>Доставка</span>
        <strong>{t.shipping === 0 ? "Безплатна" : formatPrice(t.shipping)}</strong>
      </div>
      <div className="summary__row summary__total"><span>Общо</span><strong>{formatPrice(t.total)}</strong></div>
      <p className="summary__note">Цените са с включен ДДС ({formatPrice(t.vat)}).</p>
      {children && <div style={{ marginTop: 18, display: "grid", gap: 10 }}>{children}</div>}
    </aside>
  );
};

export default OrderSummary;
