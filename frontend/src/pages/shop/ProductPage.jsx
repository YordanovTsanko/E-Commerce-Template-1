import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Chip, Rating } from "@mui/material";
import { FiShare2, FiShoppingBag, FiTruck, FiRefreshCw, FiCreditCard } from "react-icons/fi";
import { toast } from "react-toastify";
import { getProductDetails } from "../../Redux/Actions/productsActions";
import { addToCart } from "../../Redux/Actions/cartActions";
import { ProductDetailSkeleton } from "../../components/common/Loaders";
import ErrorState from "../../components/common/ErrorState";
import ProductImage from "../../components/products/ProductImage";
import LoginPrompt from "../../components/products/LoginPrompt";
import Reviews from "../../components/products/Reviews";
import NotFoundPage from "../NotFoundPage";
import { categoryLabel, SITE } from "../../config/site";
import { formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const ProductPage = () => {
  const { cat, id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((s) => s.productDetails);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const reviews = useSelector((s) => s.reviews.reviews);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [prompt, setPrompt] = useState(false);

  useDocumentTitle(product?.name || "Продукт");

  useEffect(() => {
    setQty(1);
    dispatch(getProductDetails(cat, id));
  }, [dispatch, cat, id]);

  if (error?.status === 404) return <NotFoundPage />;

  const stock = Number(product?.stock) || 0;
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
    : Number(product?.rating || 0);

  const handleAdd = async () => {
    if (!isAuthenticated) return setPrompt(true);
    setAdding(true);
    await dispatch(addToCart(id, qty));
    setAdding(false);
    setQty(1);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Линкът е копиран.");
      }
    } catch (e) {
      if (e?.name !== "AbortError") toast.error("Линкът не можа да бъде споделен.");
    }
  };

  return (
    <div className="page">
      <nav className="crumbs" aria-label="Навигационна пътека">
        <Link to="/">Начало</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/product/type/${cat}`}>{categoryLabel(cat)}</Link>
        {product && (
          <>
            <span aria-hidden="true">/</span>
            <span>{product.name}</span>
          </>
        )}
      </nav>

      {loading ? (
        <ProductDetailSkeleton />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => dispatch(getProductDetails(cat, id))} />
      ) : product ? (
        <>
          <div className="product-detail">
            <div className="product-detail__media">
              <ProductImage src={product.img} alt={product.name} />
            </div>
            <div>
              <Chip label={categoryLabel(product.category)} size="small" variant="outlined" />
              <h1 className="product-detail__title">{product.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Rating value={avg} precision={0.5} readOnly size="small" />
                <span style={{ color: "var(--muted)", fontSize: ".92rem" }}>
                  {avg.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "ревю" : "ревюта"}
                </span>
              </div>
              <div className="product-detail__price">{formatPrice(product.price)}</div>
              <div style={{ fontSize: ".9rem", marginBottom: 18 }}>
                {stock <= 0 ? (
                  <span className="stock-out">Изчерпан</span>
                ) : stock <= 5 ? (
                  <span className="stock-low">Остават само {stock} бр.</span>
                ) : (
                  <span style={{ color: "var(--success)", fontWeight: 600 }}>В наличност</span>
                )}
              </div>
              <p className="product-detail__desc">{product.description}</p>

              <div className="buy-box">
                <div className="qty" aria-label="Количество">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Намали количеството">−</button>
                  <span aria-live="polite">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(stock || 1, q + 1, 10))} disabled={qty >= Math.min(stock, 10)} aria-label="Увеличи количеството">+</button>
                </div>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FiShoppingBag />}
                  onClick={handleAdd}
                  disabled={adding || stock <= 0}
                  sx={{ flex: "1 1 200px" }}
                >
                  {adding ? "Добавяне…" : "Добави в количката"}
                </Button>
                <Button variant="outlined" size="large" onClick={share} aria-label="Сподели" sx={{ minWidth: 50, px: 1.5 }}>
                  <FiShare2 />
                </Button>
              </div>

              <ul className="meta-list">
                <li><FiTruck /> Доставка {formatPrice(SITE.shippingPrice)}, безплатна над {formatPrice(SITE.freeShippingFrom)}</li>
                <li><FiCreditCard /> Плащане с наложен платеж при получаване</li>
                <li><FiRefreshCw /> 14 дни право на отказ от покупката</li>
              </ul>
            </div>
          </div>

          <Reviews productId={id} />
        </>
      ) : null}

      <LoginPrompt open={prompt} onClose={() => setPrompt(false)} />
    </div>
  );
};

export default ProductPage;
