import React from "react";
import { CircularProgress, Skeleton } from "@mui/material";

export const PageLoader = ({ label = "Зареждане…" }) => (
  <div className="page page--center" role="status" aria-live="polite">
    <div style={{ display: "grid", justifyItems: "center", gap: 14 }}>
      <CircularProgress size={34} thickness={4.5} />
      <span style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="product-grid" role="status" aria-label="Зареждане на продуктите">
    {Array.from({ length: count }, (_, i) => (
      <div className="product-card" key={i}>
        <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 3.4", height: "auto" }} />
        <div className="product-card__body">
          <Skeleton variant="text" width="90%" height={22} />
          <Skeleton variant="text" width="60%" height={22} />
          <div className="product-card__row">
            <Skeleton variant="text" width={70} height={28} />
            <Skeleton variant="rounded" width={42} height={38} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="product-detail" role="status" aria-label="Зареждане на продукта">
    <Skeleton variant="rounded" sx={{ aspectRatio: "1 / 1", height: "auto", borderRadius: "24px" }} />
    <div>
      <Skeleton variant="text" width={120} height={26} />
      <Skeleton variant="text" width="85%" height={52} />
      <Skeleton variant="text" width="50%" height={30} />
      <Skeleton variant="text" width={140} height={56} sx={{ mt: 2 }} />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} variant="text" width={`${95 - i * 8}%`} />
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
        <Skeleton variant="rounded" width={136} height={50} />
        <Skeleton variant="rounded" width={200} height={50} />
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 6, cols = 4 }) => (
  <div className="table-wrap" style={{ padding: 16 }} role="status" aria-label="Зареждане на данните">
    {Array.from({ length: rows }, (_, r) => (
      <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, padding: "10px 0" }}>
        {Array.from({ length: cols }, (_, c) => (
          <Skeleton key={c} variant="text" height={22} />
        ))}
      </div>
    ))}
  </div>
);

export const ListSkeleton = ({ rows = 3, height = 110 }) => (
  <div style={{ display: "grid", gap: 12 }} role="status" aria-label="Зареждане">
    {Array.from({ length: rows }, (_, i) => (
      <Skeleton key={i} variant="rounded" height={height} sx={{ borderRadius: "16px" }} />
    ))}
  </div>
);
