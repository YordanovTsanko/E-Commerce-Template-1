import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Chip } from "@mui/material";
import { getOrderDetails } from "../../Redux/Actions/ordersActions";
import AccountShell from "./AccountShell";
import { ListSkeleton } from "../../components/common/Loaders";
import ErrorState from "../../components/common/ErrorState";
import ProductImage from "../../components/products/ProductImage";
import { formatDate, formatPrice, orderStatus, shortId } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const OrderDetailsPage = () => {
  const { id } = useParams();
  useDocumentTitle(`Поръчка №${shortId(id)}`);
  const dispatch = useDispatch();
  const { orderDetails: order, loading, error } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const st = orderStatus(order?.orderStatus);
  const info = order?.shippingInfo || {};
  const itemsTotal = order?.orderItems?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;

  return (
    <AccountShell
      title={`Поръчка №${shortId(id)}`}
      sub={order ? `Направена на ${formatDate(order.createAt, true)}` : undefined}
      actions={<Link to="/profile/orders" className="link">← Всички поръчки</Link>}
    >
      {loading ? (
        <ListSkeleton rows={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => dispatch(getOrderDetails(id))} />
      ) : order ? (
        <div className="cart-layout">
          <div>
            <section className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 className="panel__title" style={{ margin: 0 }}>Продукти</h2>
                <Chip label={st.label} color={st.color} />
              </div>
              <div className="cart-list">
                {order.orderItems.map((item) => (
                  <div className="cart-item" key={item._id || item.product} style={{ border: 0, padding: 0 }}>
                    <div className="cart-item__img"><ProductImage src={item.image} alt={item.name} /></div>
                    <div style={{ minWidth: 0 }}>
                      <p className="cart-item__name">{item.name}</p>
                      <div className="cart-item__meta">{formatPrice(item.price)} × {item.quantity} бр.</div>
                    </div>
                    <strong className="price">{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel">
              <h2 className="panel__title">Доставка до</h2>
              <dl className="kv">
                <dt>Получател</dt><dd>{info.firstName} {info.lastName}</dd>
                <dt>Телефон</dt><dd>{info.phoneNumber}</dd>
                <dt>Имейл</dt><dd>{info.orderEmail}</dd>
                <dt>Адрес</dt><dd>{info.address}, {info.zipCode} {info.city}, обл. {info.state}</dd>
              </dl>
            </section>
          </div>
          <aside className="summary">
            <h2>Сметка</h2>
            <div className="summary__row"><span>Продукти</span><strong>{formatPrice(itemsTotal)}</strong></div>
            <div className="summary__row">
              <span>Доставка</span>
              <strong>{Number(order.shippingPrice) === 0 ? "Безплатна" : formatPrice(order.shippingPrice)}</strong>
            </div>
            <div className="summary__row summary__total"><span>Общо</span><strong>{formatPrice(order.itemsPrice)}</strong></div>
            <p className="summary__note">Плащане: наложен платеж. ДДС: {formatPrice(order.taxPrice)}.</p>
          </aside>
        </div>
      ) : null}
    </AccountShell>
  );
};

export default OrderDetailsPage;
