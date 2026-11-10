import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, MenuItem, TextField } from "@mui/material";
import { FiBox } from "react-icons/fi";
import { getProducts } from "../../Redux/Actions/productsActions";
import ProductCard from "../../components/products/ProductCard";
import { ProductGridSkeleton } from "../../components/common/Loaders";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import NotFoundPage from "../NotFoundPage";
import { CATEGORIES } from "../../config/site";
import useDocumentTitle from "../../hooks/useDocumentTitle";

// Опцията „All“ е премахната — всяка опция реално подрежда списъка.
const SORT_OPTIONS = [
  { value: "newest", label: "Най-нови" },
  { value: "price-asc", label: "Цена: възходящо" },
  { value: "price-desc", label: "Цена: низходящо" },
  { value: "rating", label: "Най-висока оценка" },
];

const sorters = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating || 0) - (a.rating || 0),
};

const CategoryPage = () => {
  const { cat } = useParams();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((s) => s.products);
  const [sort, setSort] = useState("newest");
  const category = CATEGORIES.find((c) => c.slug === cat);

  useDocumentTitle(category?.label || "Категория");

  useEffect(() => {
    if (category) dispatch(getProducts(cat));
  }, [cat, category, dispatch]);

  const sorted = useMemo(
    () => [...(products || [])].sort(sorters[sort]),
    [products, sort]
  );

  if (!category) return <NotFoundPage />;

  return (
    <div className="page">
      <nav className="crumbs" aria-label="Навигационна пътека">
        <Link to="/">Начало</Link>
        <span aria-hidden="true">/</span>
        <span>{category.label}</span>
      </nav>
      <header className="page-head">
        <h1 className="page-title">{category.label}</h1>
        <p className="page-sub">{category.note}</p>
      </header>

      {loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => dispatch(getProducts(cat))} />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={<FiBox />}
          title="Тук все още няма продукти"
          text="Скоро ще добавим нови предложения. Дотогава разгледайте другите категории."
        >
          <Button component={Link} to="/" variant="contained">
            Към всички категории
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="toolbar">
            <span className="toolbar__count">
              {sorted.length} {sorted.length === 1 ? "продукт" : "продукта"}
            </span>
            <TextField
              select
              size="small"
              label="Подреди по"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              fullWidth={false}
              sx={{ minWidth: 220 }}
            >
              {SORT_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="product-grid">
            {sorted.map((p) => (
              <ProductCard key={p._id} prod={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
