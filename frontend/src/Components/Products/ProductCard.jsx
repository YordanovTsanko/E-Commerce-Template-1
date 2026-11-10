import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, IconButton, Rating, Tooltip } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { addToCart } from "../../Redux/Actions/cartActions";
import { formatPrice } from "../../utils/format";
import ProductImage from "./ProductImage";
import LoginPrompt from "./LoginPrompt";

const ProductCard = ({ prod }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const pendingId = useSelector((s) => s.cart.pendingId);
  const [prompt, setPrompt] = useState(false);
  const busy = pendingId === prod._id;
  const outOfStock = Number(prod.stock) <= 0;
  const href = `/product/type/${prod.category}/${prod._id}`;

  const handleAdd = () => {
    if (!isAuthenticated) return setPrompt(true);
    dispatch(addToCart(prod._id));
  };

  return (
    <article className="product-card">
      <Link to={href} className="product-card__media" aria-label={prod.name}>
        <ProductImage src={prod.img} alt={prod.name} />
      </Link>
      <div className="product-card__body">
        <Link to={href}>
          <h3 className="product-card__name" title={prod.name}>{prod.name}</h3>
        </Link>
        <Rating value={Number(prod.rating) || 0} precision={0.5} readOnly size="small" aria-label={`Оценка ${Number(prod.rating || 0).toFixed(1)} от 5`} />
        {outOfStock ? (
          <span className="stock-out">Изчерпан</span>
        ) : Number(prod.stock) <= 5 ? (
          <span className="stock-low">Остават {prod.stock} бр.</span>
        ) : null}
        <div className="product-card__row">
          <span className="price">{formatPrice(prod.price)}</span>
          <Tooltip title={outOfStock ? "Изчерпан" : "Добави в количката"}>
            <span>
              <IconButton
                onClick={handleAdd}
                disabled={busy || outOfStock}
                aria-label={`Добави ${prod.name} в количката`}
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  borderRadius: "10px",
                  "&:hover": { bgcolor: "primary.dark" },
                  "&.Mui-disabled": { bgcolor: "var(--line)" },
                }}
              >
                {busy ? <CircularProgress size={18} color="inherit" /> : <FiPlus />}
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
      <LoginPrompt open={prompt} onClose={() => setPrompt(false)} />
    </article>
  );
};

export default ProductCard;
