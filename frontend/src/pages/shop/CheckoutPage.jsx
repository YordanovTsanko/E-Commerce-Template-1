import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import OrderSummary from "../../components/cart/OrderSummary";
import CheckoutSteps from "../../components/cart/CheckoutSteps";
import { ListSkeleton } from "../../components/common/Loaders";
import { isEmail, isPhone, required, validate } from "../../utils/validation";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export const SHIPPING_KEY = "shippingInfo";

const FIELDS = [
  { name: "firstName", label: "Име", autoComplete: "given-name" },
  { name: "lastName", label: "Фамилия", autoComplete: "family-name" },
  { name: "phoneNumber", label: "Телефон", autoComplete: "tel", type: "tel" },
  { name: "orderEmail", label: "Имейл", autoComplete: "email", type: "email" },
  { name: "address", label: "Адрес (улица, номер, вход, етаж)", autoComplete: "street-address", wide: true },
  { name: "city", label: "Град / село", autoComplete: "address-level2" },
  { name: "zipCode", label: "Пощенски код", autoComplete: "postal-code" },
  { name: "state", label: "Област", autoComplete: "address-level1", wide: true },
];

const RULES = {
  firstName: required("име"),
  lastName: required("фамилия"),
  phoneNumber: (v) => (isPhone(v) ? null : "Въведете валиден телефонен номер."),
  orderEmail: (v) => (isEmail(v) ? null : "Въведете валиден имейл адрес."),
  address: required("адрес"),
  city: required("град"),
  zipCode: (v) => (/^\d{4}$/.test(String(v || "").trim()) ? null : "Пощенският код е 4 цифри."),
  state: required("област"),
};

export const readShipping = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SHIPPING_KEY)) || null;
  } catch {
    return null;
  }
};

const CheckoutPage = () => {
  useDocumentTitle("Данни за доставка");
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const { cartItems, loading } = useSelector((s) => s.cart);

  const [values, setValues] = useState(() => {
    const saved = readShipping();
    return {
      firstName: saved?.firstName ?? user?.firstName ?? "",
      lastName: saved?.lastName ?? user?.lastName ?? "",
      phoneNumber: saved?.phoneNumber ?? (user?.phoneNumber ? `0${user.phoneNumber}` : ""),
      orderEmail: saved?.orderEmail ?? user?.email ?? "",
      address: saved?.address ?? user?.address ?? "",
      city: saved?.city ?? user?.city ?? "",
      zipCode: saved?.zipCode ?? (user?.postCode ? String(user.postCode) : ""),
      state: saved?.state ?? user?.state ?? "",
    };
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(errors).length) setErrors(validate(values, RULES));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  if (!loading && cartItems.length === 0) return <Navigate to="/cart" replace />;

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values, RULES);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    const clean = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v).trim()]));
    sessionStorage.setItem(SHIPPING_KEY, JSON.stringify(clean));
    navigate("/payment");
  };

  return (
    <div className="page">
      <CheckoutSteps current={1} />
      <header className="page-head">
        <h1 className="page-title">Данни за доставка</h1>
        <p className="page-sub">Попълнихме каквото знаем от профила ви — проверете и допълнете.</p>
      </header>

      {loading ? (
        <ListSkeleton rows={2} height={180} />
      ) : (
        <div className="cart-layout">
          <form className="panel" onSubmit={onSubmit} noValidate>
            <div className="form-grid">
              {FIELDS.map((f) => (
                <TextField
                  key={f.name}
                  className={f.wide ? "span-2" : undefined}
                  name={f.name}
                  label={f.label}
                  type={f.type || "text"}
                  autoComplete={f.autoComplete}
                  value={values[f.name]}
                  onChange={onChange}
                  error={Boolean(errors[f.name])}
                  helperText={errors[f.name] || " "}
                  required
                />
              ))}
            </div>
            <div className="form-actions">
              <Button component={Link} to="/cart" color="inherit">
                Назад към количката
              </Button>
              <Button type="submit" variant="contained" size="large">
                Продължи към потвърждение
              </Button>
            </div>
          </form>
          <OrderSummary items={cartItems} showItems />
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
