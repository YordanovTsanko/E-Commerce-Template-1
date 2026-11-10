import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Slide, ToastContainer, toast } from "react-toastify";

import { loadUser } from "./Redux/Actions/authActions";
import { getCart, resetCart } from "./Redux/Actions/cartActions";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ScrollToTop from "./components/common/ScrollToTop";
import { ProtectedRoute, AdminRoute } from "./components/common/RouteGuards";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/shop/HomePage";
import CategoryPage from "./pages/shop/CategoryPage";
import ProductPage from "./pages/shop/ProductPage";
import CartPage from "./pages/shop/CartPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import PaymentPage from "./pages/shop/PaymentPage";
import OrderPlacedPage from "./pages/shop/OrderPlacedPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ProfilePage from "./pages/account/ProfilePage";
import EditProfilePage from "./pages/account/EditProfilePage";
import OrdersPage from "./pages/account/OrdersPage";
import OrderDetailsPage from "./pages/account/OrderDetailsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

/** Зарежда сесията веднъж при старт и количката, щом потребителят е влязъл. */
const SessionSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, initialized } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (!initialized) return;
    dispatch(isAuthenticated ? getCart() : resetCart());
  }, [dispatch, initialized, isAuthenticated]);

  useEffect(() => {
    const offline = () => toast.warn("Няма интернет връзка. Част от функциите няма да работят.");
    const online = () => toast.success("Връзката е възстановена.");
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => {
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, []);

  return null;
};

const App = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <SessionSync />
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3200}
        transition={Slide}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        theme="light"
        limit={4}
      />
      <Routes>
        {/* Публичен сайт — с навигация и футър */}
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="product/type/:cat" element={<CategoryPage />} />
          <Route path="product/type/:cat/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route path="profile/orders" element={<OrdersPage />} />
            <Route path="profile/order/:id" element={<OrderDetailsPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="order/placed" element={<OrderPlacedPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Админ панел — без навигацията и футъра на сайта */}
        <Route path="admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="product/:id" element={<AdminProductDetails />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<NotFoundPage admin />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  </BrowserRouter>
);

export default App;
