import React, { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { FiDollarSign } from "react-icons/fi";
import { createOrder } from "../../Redux/Actions/ordersActions";
import OrderSummary from "../../components/cart/OrderSummary";
import CheckoutSteps from "../../components/cart/CheckoutSteps";
import { ListSkeleton } from "../../components/common/Loaders";
import { readShipping } from "./CheckoutPage";
import { calcTotals, round } from "../../utils/format";
import { digitsOnly } from "../../utils/validation";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const PaymentPage = () => {
  useDocumentTitle("Потвърждение на поръчката");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((s) => s.cart);
  const creating = useSelector((s) => s.orders.creating);
  const [agree, setAgree] = useState(false);
  const shipping = readShipping();
  const placedRef = useRef(false); // след успешна поръчка количката се изпразва — не пренасочваме към /cart

  if (!shipping && !placedRef.current) return <Navigate to="/checkout" replace />;
  if (!placedRef.current && !loading && cartItems.length === 0) return <Navigate to="/cart" replace />;

  const placeOrder = async () => {
    const t = calcTotals(cartItems);
    const order = {
      orderItems: cartItems.map(({ name, quantity, image, price, product }) => ({
        name, quantity, image, price, product,
      })),
      shippingInfo: { ...shipping, phoneNumber: Number(digitsOnly(shipping.phoneNumber)) },
      itemsPrice: t.total,
      taxPrice: t.vat,
      shippingPrice: t.shipping,
      withoutTaxPrice: round(t.subtotal - t.vat),
    };
    placedRef.current = true;
    const data = await dispatch(createOrder(order));
    if (!data?.success) placedRef.current = false;
    if (data?.success) {
      navigate("/order/placed", { replace: true });
    }
  };

  return (
    <div className="page">
      <CheckoutSteps current={2} />
      <header className="page-head">
        <h1 className="page-title">Потвърждение на поръчката</h1>
        <p className="page-sub">Прегледайте данните и потвърдете. Плащате на куриера при получаване.</p>
      </header>

      {loading ? (
        <ListSkeleton rows={2} height={180} />
      ) : (
        <div className="cart-layout">
          <div>
            <section className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <h2 className="panel__title">Доставка до</h2>
                <Link to="/checkout" className="link">Промени</Link>
              </div>
              <dl className="kv">
                <dt>Получател</dt><dd>{shipping.firstName} {shipping.lastName}</dd>
                <dt>Телефон</dt><dd>{shipping.phoneNumber}</dd>
                <dt>Имейл</dt><dd>{shipping.orderEmail}</dd>
                <dt>Адрес</dt><dd>{shipping.address}</dd>
                <dt>Населено място</dt><dd>{shipping.zipCode} {shipping.city}, обл. {shipping.state}</dd>
              </dl>
            </section>

            <section className="panel">
              <h2 className="panel__title">Начин на плащане</h2>
              <div className="pay-option">
                <FiDollarSign />
                <div>
                  <strong>Наложен платеж</strong>
                  <div style={{ color: "var(--muted)", fontSize: ".95rem" }}>
                    Плащате в брой или с карта на куриера, когато получите пратката.
                  </div>
                </div>
              </div>
              <FormControlLabel
                sx={{ mt: 2 }}
                control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />}
                label="Запознат/а съм с условията за доставка и връщане."
              />
            </section>
          </div>

          <OrderSummary items={cartItems} title="Вашата поръчка" showItems>
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!agree || creating}
              onClick={placeOrder}
            >
              {creating ? "Изпращане…" : "Потвърди поръчката"}
            </Button>
            {!agree && (
              <span className="summary__note" style={{ margin: 0 }}>
                Отбележете, че сте съгласни с условията, за да продължите.
              </span>
            )}
          </OrderSummary>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
