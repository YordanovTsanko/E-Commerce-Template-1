import React, { useMemo, useState } from "react";
import { Chip, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { FiSearch, FiUsers } from "react-icons/fi";
import useApi from "../../hooks/useApi";
import AdminHeader from "../../components/admin/AdminHeader";
import { TableSkeleton } from "../../components/common/Loaders";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const AdminUsers = () => {
  useDocumentTitle("Потребители · Админ");
  const { data, loading, error, reload } = useApi("/api/v1/admin/users", (d) => d.users || []);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || [])
      .filter((u) => !q || [u.firstName, u.lastName, u.email].some((v) => String(v || "").toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, query]);

  const paged = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <AdminHeader title="Потребители" sub={data ? `${data.length} регистрирани потребители` : undefined} />
      <div className="toolbar">
        <TextField
          size="small"
          placeholder="Име или имейл"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          fullWidth={false}
          sx={{ minWidth: { xs: "100%", sm: 300 } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment> } }}
        />
      </div>
      {loading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : list.length === 0 ? (
        <EmptyState icon={<FiUsers />} title="Няма намерени потребители" />
      ) : (
        <div className="table-wrap">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Име</TableCell>
                  <TableCell>Имейл</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Роля</TableCell>
                  <TableCell>Регистриран</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phoneNumber ? `0${u.phoneNumber}` : "—"}</TableCell>
                    <TableCell>
                      <Chip size="small" label={u.role === "admin" ? "Администратор" : "Клиент"} color={u.role === "admin" ? "secondary" : "default"} variant={u.role === "admin" ? "filled" : "outlined"} />
                    </TableCell>
                    <TableCell>{formatDate(u.createdAt)}</TableCell>
                  </TableRow>
                ))}
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

export default AdminUsers;
