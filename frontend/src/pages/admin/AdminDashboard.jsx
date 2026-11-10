import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Chip, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@mui/material";
import { FiBox, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import api, { getApiErrorMessage } from "../../api/axios";
import AdminHeader from "../../components/admin/AdminHeader";
import ErrorState from "../../components/common/ErrorState";
import { CATEGORIES } from "../../config/site";
import { formatDate, formatPrice, orderStatus, shortId } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const COLORS = ["#0F4C5C", "#E9A23B", "#3E8E9E", "#B7791F", "#7FB7C2", "#F3C982"];

const Stat = ({ icon, label, value, loading }) => (
  <div className="stat">
    <div className="stat__label">{icon}{label}</div>
    <div className="stat__value">{loading ? <Skeleton width="60%" /> : value}</div>
  </div>
);

const AdminDashboard = () => {
  useDocumentTitle("Админ табло");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [state, setState] = useState({ loading: true, error: null, products: [], orders: [], users: [] });

  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [p, o, u] = await Promise.all([
        api.get("/api/v1/admin/products"),
        api.get("/api/v1/admin/orders"),
        api.get("/api/v1/admin/users"),
      ]);
      setState({
        loading: false,
        error: null,
        products: p.data.products || [],
        orders: o.data.orders || [],
        users: u.data.users || [],
      });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: getApiErrorMessage(e) }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const { loading, error, products, orders, users } = state;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const revenue = orders.reduce((s, o) => s + Number(o.itemsPrice || 0), 0);
  const byCategory = CATEGORIES.map((c) => ({
    name: c.label,
    count: products.filter((p) => p.category === c.slug).length,
  }));
  const statusCounts = Object.values(
    orders.reduce((acc, o) => {
      const st = orderStatus(o.orderStatus).label;
      acc[st] = acc[st] || { name: st, value: 0 };
      acc[st].value += 1;
      return acc;
    }, {})
  );
  const recent = [...orders].sort((a, b) => new Date(b.createAt) - new Date(a.createAt)).slice(0, 6);

  return (
    <>
      <AdminHeader title="Табло" sub="Обобщение на магазина в реално време." />

      <div className="stat-grid">
        <Stat icon={<FiDollarSign />} label="Оборот" value={formatPrice(revenue)} loading={loading} />
        <Stat icon={<FiShoppingCart />} label="Поръчки" value={orders.length} loading={loading} />
        <Stat icon={<FiBox />} label="Продукти" value={products.length} loading={loading} />
        <Stat icon={<FiUsers />} label="Потребители" value={users.length} loading={loading} />
      </div>

      <div className="chart-grid">
        <section className="panel">
          <h2 className="panel__title">Продукти по категория</h2>
          {loading ? (
            <Skeleton variant="rounded" height={280} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#DCE3E5" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#5A6C72" }} />
                <YAxis type="category" dataKey="name" width={isMobile ? 110 : 140} tick={{ fontSize: 12, fill: "#14262C" }} />
                <Tooltip cursor={{ fill: "rgba(15,76,92,.06)" }} formatter={(v) => [v, "Продукти"]} />
                <Bar dataKey="count" fill="#0F4C5C" radius={[0, 6, 6, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
        <section className="panel">
          <h2 className="panel__title">Поръчки по статус</h2>
          {loading ? (
            <Skeleton variant="rounded" height={280} />
          ) : statusCounts.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Все още няма поръчки.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {statusCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h2 className="panel__title">Последни поръчки</h2>
          <Button component={Link} to="/admin/orders" size="small">Всички поръчки</Button>
        </div>
        {loading ? (
          <Skeleton variant="rounded" height={180} />
        ) : recent.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>Все още няма поръчки.</p>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Поръчка</TableCell>
                  <TableCell>Клиент</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Сума</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent.map((o) => {
                  const st = orderStatus(o.orderStatus);
                  return (
                    <TableRow key={o._id}>
                      <TableCell sx={{ fontWeight: 700 }}>№{shortId(o._id)}</TableCell>
                      <TableCell>{o.shippingInfo?.firstName} {o.shippingInfo?.lastName}</TableCell>
                      <TableCell>{formatDate(o.createAt)}</TableCell>
                      <TableCell><Chip size="small" variant="outlined" label={st.label} color={st.color} /></TableCell>
                      <TableCell align="right">{formatPrice(o.itemsPrice)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </section>
    </>
  );
};

export default AdminDashboard;
