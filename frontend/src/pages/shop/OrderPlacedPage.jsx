import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { FiCheck } from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import { formatPrice, shortId } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { SHIPPING_KEY } from "./CheckoutPage";

const OrderPlacedPage = () => {
  useDocumentTitle("Поръчката е приета");
  const order = useSelector((s) => s.orders.order);
  useEffect(() => {
    sessionStorage.removeItem(SHIPPING_KEY);
  }, []);
  if (!order) return <Navigate to="/profile/orders" replace />;

  return (
    <div className="page">
      <EmptyState
        icon={<FiCheck style={{ color: "var(--success)" }} />}
        title="Благодарим! Поръчката е приета."
        text={`Номер на поръчката: №${shortId(order._id)}. Сума за плащане при доставка: ${formatPrice(order.itemsPrice)}.`}
      >
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="contained" component={Link} to={`/profile/order/${order._id}`}>
            Виж поръчката
          </Button>
          <Button variant="outlined" component={Link} to="/">
            Продължи пазаруването
          </Button>
        </div>
      </EmptyState>
    </div>
  );
};

export default OrderPlacedPage;
