import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Chip, Rating, Skeleton } from "@mui/material";
import { FiArrowLeft, FiExternalLink, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import api, { getApiErrorMessage } from "../../api/axios";
import useApi from "../../hooks/useApi";
import AdminHeader from "../../components/admin/AdminHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorState from "../../components/common/ErrorState";
import ProductImage from "../../components/products/ProductImage";
import { categoryLabel } from "../../config/site";
import { formatDate, formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error, reload } = useApi(`/api/v1/admin/product/${id}`, (d) => d.product);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useDocumentTitle(product?.name || "Продукт · Админ");

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/v1/admin/product/delete/${id}`);
      toast.success("Продуктът е изтрит.");
      navigate("/admin/products", { replace: true });
    } catch (e) {
      toast.error(getApiErrorMessage(e));
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <Link to="/admin/products" className="link" style={{ display: "inline-flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
        <FiArrowLeft /> Всички продукти
      </Link>
      {loading || !product ? (
        <div className="product-detail">
          <Skeleton variant="rounded" sx={{ aspectRatio: "1/1", height: "auto" }} />
          <div><Skeleton height={60} /><Skeleton /><Skeleton /><Skeleton width="60%" /></div>
        </div>
      ) : (
        <>
          <AdminHeader title={product.name}>
            <Button
              component={Link}
              to={`/product/type/${product.category}/${product._id}`}
              variant="outlined"
              startIcon={<FiExternalLink />}
            >
              Виж в магазина
            </Button>
            <Button variant="contained" color="error" startIcon={<FiTrash2 />} onClick={() => setConfirm(true)}>
              Изтрий
            </Button>
          </AdminHeader>
          <div className="product-detail">
            <div className="product-detail__media" style={{ position: "static" }}>
              <ProductImage src={product.img} alt={product.name} />
            </div>
            <div>
              <section className="panel">
                <dl className="kv">
                  <dt>Категория</dt><dd><Chip size="small" label={categoryLabel(product.category)} /></dd>
                  <dt>Цена</dt><dd className="price">{formatPrice(product.price)}</dd>
                  <dt>Наличност</dt><dd>{product.stock} бр.</dd>
                  <dt>Оценка</dt><dd style={{ display: "flex", alignItems: "center", gap: 8 }}><Rating size="small" readOnly precision={0.5} value={product.rating || 0} /> {Number(product.rating || 0).toFixed(1)}</dd>
                  <dt>Създаден</dt><dd>{formatDate(product.createdAt, true)}</dd>
                  <dt>ID</dt><dd style={{ fontSize: ".85rem", color: "var(--muted)" }}>{product._id}</dd>
                </dl>
              </section>
              <section className="panel">
                <h2 className="panel__title">Описание</h2>
                <p className="product-detail__desc" style={{ margin: 0 }}>{product.description}</p>
              </section>
            </div>
          </div>
        </>
      )}
      <ConfirmDialog
        open={confirm}
        danger
        loading={deleting}
        title="Изтриване на продукт"
        text={`„${product?.name}“ ще бъде премахнат от каталога. Действието не може да бъде отменено.`}
        confirmLabel="Изтрий продукта"
        onConfirm={remove}
        onClose={() => setConfirm(false)}
      />
    </>
  );
};

export default AdminProductDetails;
