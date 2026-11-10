import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "./Loaders";

/** Изчаква първата проверка на сесията и чак тогава решава дали да пусне потребителя. */
export const ProtectedRoute = () => {
  const { initialized, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) return <PageLoader label="Проверяваме профила ви…" />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

export const AdminRoute = () => {
  const { initialized, isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) return <PageLoader label="Проверяваме правата за достъп…" />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
};

/** За /login и /register: влезлият потребител няма работа там. */
export const GuestRoute = () => {
  const { initialized, isAuthenticated } = useSelector((state) => state.auth);
  if (!initialized) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};
