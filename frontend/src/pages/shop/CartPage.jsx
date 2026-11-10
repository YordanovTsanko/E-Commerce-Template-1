import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FiShoppingBag, FiTrash2, FiLogIn } from "react-icons/fi";
import { addToCart, removeFromCart } from "../../Redux/Actions/cartActions";
import OrderSummary from "../../components/cart/OrderSummary";
import CheckoutSteps from "../../components/cart/CheckoutSteps";
import EmptyState from "../../components/common/EmptyState";
import { ListSkeleton, PageLoader } from "../../components/common/Loaders";
import ProductImage from "../../components/products/ProductImage";
import { formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const CartPage = () => {
  useDocumentTitle("Количка");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { initialized, isAuthenticated } = useSelector((s) => s.auth);
  const { cartItems, loading, pendingId } = useSelector((s) => s.cart);

  if (!initialized) return <PageLoader />;

  if (!isAuthenticated) {
    return (
      <div className="page">
        <EmptyState
          icon={<FiLogIn />}
          title="Влезте, за да видите количката си"
          text="Количката се пази в профила ви, за да я намирате от всяко устройство."
        >
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="contained" onClick={() => navigate("/login", { state: { from: "/cart" } })}>
              Вход
            </Button>
            <Button variant="outlined" component={Link} to="/register">
              Създай профил
            </Button>
          </div>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="page">
      <CheckoutSteps current={0} />
      <header className="page-head">
        <h1 className="page-title">Количка</h1>
      </header>

      {loading ? (
        <ListSkeleton rows={3} />
      ) : cartItems.length === 0 ? (
        <EmptyState
          icon={<FiShoppingBag />}
          title="Количката ви е празна"
          text="Разгледайте категориите и добавете продуктите, които ви харесват."
        >
          <Button variant="contained" component={Link} to="/">
            Започнете пазаруването
          </Button>
        </EmptyState>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => {
              const busy = pendingId === item.product;
              return (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item__img">
                    <ProductImage src={item.image} alt={item.name} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p className="cart-item__name">{item.name}</p>
                    <div className="cart-item__meta">
                      {formatPrice(item.price)} × {item.quantity} бр.
                    </div>
                  </div>
                  <div className="cart-item__side">
                    <strong className="price">{formatPrice(item.price * item.quantity)}</strong>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <Tooltip title="Още един брой">
                        <span>
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={busy}
                            onClick={() => dispatch(addToCart(item.product, 1, { silent: true }))}
                            sx={{ minWidth: 40, minHeight: 34, px: 1 }}
                            aria-label={`Добави още един брой от ${item.name}`}
                          >
                            +1
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Премахни">
                        <span>
                          <IconButton
                            onClick={() => dispatch(removeFromCart(item.product))}
                            disabled={busy}
                            aria-label={`Премахни ${item.name}`}
                            color="error"
                          >
                            {busy ? <CircularProgress size={18} /> : <FiTrash2 />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
            <Link to="/" className="link" style={{ marginTop: 6, justifySelf: "start" }}>
              ← Продължете пазаруването
            </Link>
          </div>

          <OrderSummary items={cartItems}>
            <Button variant="contained" size="large" fullWidth onClick={() => navigate("/checkout")}>
              Към доставка
            </Button>
          </OrderSummary>
        </div>
      )}
    </div>
  );
};

export default CartPage;
