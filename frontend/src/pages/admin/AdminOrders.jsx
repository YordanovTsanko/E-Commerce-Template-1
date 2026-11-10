import React, { useMemo, useState } from "react";
import { Chip, InputAdornment, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import useApi from "../../hooks/useApi";
import AdminHeader from "../../components/admin/AdminHeader";
import { TableSkeleton } from "../../components/common/Loaders";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { formatDate, formatPrice, orderStatus, shortId } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const AdminOrders = () => {
  useDocumentTitle("Поръчки · Админ");
  const { data, loading, error, reload } = useApi("/api/v1/admin/orders", (d) => d.orders || []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statuses = useMemo(
    () => [...new Set((data || []).map((o) => o.orderStatus))],
    [data]
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || [])
      .filter((o) => status === "all" || o.orderStatus === status)
      .filter((o) => {
        if (!q) return true;
        const s = o.shippingInfo || {};
        return [o._id, s.firstName, s.lastName, s.orderEmail, s.city]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      })
      .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
  }, [data, query, status]);

  const paged = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <AdminHeader title="Поръчки" sub={data ? `${data.length} поръчки общо` : undefined} />
      <div className="toolbar">
        <TextField
          size="small"
          placeholder="Клиент, имейл, град или номер"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          fullWidth={false}
          sx={{ minWidth: { xs: "100%", sm: 320 } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment> } }}
        />
        <TextField select size="small" label="Статус" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} fullWidth={false} sx={{ minWidth: 200 }}>
          <MenuItem value="all">Всички статуси</MenuItem>
          {statuses.map((s) => <MenuItem key={s} value={s}>{orderStatus(s).label}</MenuItem>)}
        </TextField>
      </div>

      {loading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : list.length === 0 ? (
        <EmptyState icon={<FiShoppingCart />} title="Няма поръчки" text={data?.length ? "Няма поръчки, отговарящи на филтъра." : "Поръчките ще се появят тук."} />
      ) : (
        <div className="table-wrap">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Поръчка</TableCell>
                  <TableCell>Клиент</TableCell>
                  <TableCell>Град</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Сума</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((o) => {
                  const st = orderStatus(o.orderStatus);
                  const s = o.shippingInfo || {};
                  return (
                    <TableRow key={o._id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>№{shortId(o._id)}</TableCell>
                      <TableCell>
                        <div style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>{s.orderEmail}</div>
                      </TableCell>
                      <TableCell>{s.city}</TableCell>
                      <TableCell>{formatDate(o.createAt, true)}</TableCell>
                      <TableCell><Chip size="small" variant="outlined" label={st.label} color={st.color} /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{formatPrice(o.itemsPrice)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={list.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Редове:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} от ${count}`}
          />
        </div>
      )}
    </>
  );
};

export default AdminOrders;
