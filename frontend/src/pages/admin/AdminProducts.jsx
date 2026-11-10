import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import { FiPlus, FiSearch, FiBox, FiDatabase } from "react-icons/fi";
import { toast } from "react-toastify";
import api, { getApiErrorMessage } from "../../api/axios";
import useApi from "../../hooks/useApi";
import AdminHeader from "../../components/admin/AdminHeader";
import AddProductDialog from "../../components/admin/AddProductDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { ProductGridSkeleton } from "../../components/common/Loaders";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ProductImage from "../../components/products/ProductImage";
import { CATEGORIES, categoryLabel } from "../../config/site";
import { formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const AdminProducts = () => {
  useDocumentTitle("Продукти · Админ");
  const { data, setData, loading, error, reload } = useApi("/api/v1/admin/products", (d) => d.products || []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [adding, setAdding] = useState(false);
  const [seedConfirm, setSeedConfirm] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || [])
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, query, category]);

  const seed = async () => {
    setSeeding(true);
    try {
      await api.post("/api/v1/admin/random/products");
      toast.success("Добавени са 10 тестови продукта.");
      setSeedConfirm(false);
      reload();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <AdminHeader title="Продукти" sub={data ? `${data.length} продукта в каталога` : undefined}>
        <Button variant="outlined" startIcon={<FiDatabase />} onClick={() => setSeedConfirm(true)}>
          Добави тестови продукти
        </Button>
        <Button variant="contained" startIcon={<FiPlus />} onClick={() => setAdding(true)}>
          Нов продукт
        </Button>
      </AdminHeader>

      <div className="toolbar">
        <TextField
          size="small"
          placeholder="Търсене по име"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth={false}
          sx={{ minWidth: { xs: "100%", sm: 280 } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment> } }}
        />
        <TextField select size="small" label="Категория" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth={false} sx={{ minWidth: 220 }}>
          <MenuItem value="all">Всички категории</MenuItem>
          {CATEGORIES.map((c) => <MenuItem key={c.slug} value={c.slug}>{c.label}</MenuItem>)}
        </TextField>
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : list.length === 0 ? (
        <EmptyState icon={<FiBox />} title="Няма намерени продукти" text={data?.length ? "Променете търсенето или филтъра." : "Добавете първия продукт в каталога."} />
      ) : (
        <div className="admin-products">
          {list.map((p) => (
            <Link to={`/admin/product/${p._id}`} key={p._id} className="product-card">
              <div className="product-card__media"><ProductImage src={p.img} alt={p.name} /></div>
              <div className="product-card__body">
                <h3 className="product-card__name">{p.name}</h3>
                <span style={{ color: "var(--muted)", fontSize: ".88rem" }}>{categoryLabel(p.category)}</span>
                <div className="product-card__row">
                  <span className="price">{formatPrice(p.price)}</span>
                  <span className={p.stock <= 0 ? "stock-out" : p.stock <= 5 ? "stock-low" : ""} style={{ fontSize: ".88rem", color: p.stock > 5 ? "var(--muted)" : undefined }}>
                    {p.stock} бр.
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddProductDialog
        open={adding}
        onClose={() => setAdding(false)}
        onCreated={(p) => p && setData((prev) => [p, ...(prev || [])])}
      />
      <ConfirmDialog
        open={seedConfirm}
        title="Добавяне на тестови продукти"
        text="Ще бъдат създадени 10 примерни продукта в базата данни. Полезно е за тестове — не го правете в реален магазин."
        confirmLabel="Добави"
        loading={seeding}
        onConfirm={seed}
        onClose={() => setSeedConfirm(false)}
      />
    </>
  );
};

export default AdminProducts;
