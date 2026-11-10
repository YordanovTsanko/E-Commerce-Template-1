import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FiPackage } from "react-icons/fi";
import { getUserOrders } from "../../Redux/Actions/ordersActions";
import AccountShell from "./AccountShell";
import { TableSkeleton } from "../../components/common/Loaders";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { formatDate, formatPrice, orderStatus, shortId } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const OrdersPage = () => {
  useDocumentTitle("Моите поръчки");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const sorted = [...orders].sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

  return (
    <AccountShell title="Моите поръчки">
      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => dispatch(getUserOrders())} />
      ) : sorted.length === 0 ? (
        <EmptyState icon={<FiPackage />} title="Все още нямате поръчки" text="Когато поръчате нещо, ще го видите тук.">
          <Button variant="contained" component={Link} to="/">Към магазина</Button>
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Поръчка</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Продукти</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Сума</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.map((o) => {
                  const st = orderStatus(o.orderStatus);
                  return (
                    <TableRow
                      key={o._id}
                      className="row-link"
                      hover
                      tabIndex={0}
                      onClick={() => navigate(`/profile/order/${o._id}`)}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/profile/order/${o._id}`)}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>№{shortId(o._id)}</TableCell>
                      <TableCell>{formatDate(o.createAt)}</TableCell>
                      <TableCell>{o.orderItems?.reduce((n, i) => n + i.quantity, 0)} бр.</TableCell>
                      <TableCell><Chip size="small" label={st.label} color={st.color} variant="outlined" /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{formatPrice(o.itemsPrice)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </AccountShell>
  );
};

export default OrdersPage;
