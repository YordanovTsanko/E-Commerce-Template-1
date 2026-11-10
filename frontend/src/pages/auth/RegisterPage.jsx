import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { clearErrors, register } from "../../Redux/Actions/authActions";
import PasswordField from "../../components/common/PasswordField";
import AuthShell from "./AuthShell";
import {
  digitsOnly,
  isEmail,
  isPhone,
  isStrongPassword,
  passwordChecks,
  required,
  validate,
} from "../../utils/validation";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const RULES = {
  firstName: required("име"),
  lastName: required("фамилия"),
  email: (v) => (isEmail(v) ? null : "Въведете валиден имейл адрес."),
  phoneNumber: (v) => (isPhone(v) ? null : "Въведете валиден телефонен номер."),
  password: (v) => (isStrongPassword(v) ? null : "Паролата не отговаря на изискванията по-долу."),
  confirm: (v, all) => (v && v === all.password ? null : "Паролите не съвпадат."),
};

const RegisterPage = () => {
  useDocumentTitle("Регистрация");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { initialized, isAuthenticated, submitting, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialized && isAuthenticated) navigate("/", { replace: true });
  }, [initialized, isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearErrors());
    return () => dispatch(clearErrors());
  }, [dispatch]);

  const onChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (errors[e.target.name]) setErrors(validate(next, RULES));
    if (error) dispatch(clearErrors());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form, RULES);
    setErrors(found);
    if (Object.keys(found).length) return;

    const data = await dispatch(
      register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: Number(digitsOnly(form.phoneNumber)),
        password: form.password,
      })
    );
    if (data?.success) navigate("/login", { state: { email: form.email.trim().toLowerCase(), registered: true } });
  };

  const field = (name, label, props = {}) => (
    <TextField
      name={name}
      label={label}
      value={form[name]}
      onChange={onChange}
      error={Boolean(errors[name])}
      helperText={errors[name]}
      required
      {...props}
    />
  );

  return (
    <AuthShell
      wide
      asideTitle="Един профил за всичко"
      asideText="Количката ви се пази между устройствата, а данните за доставка се попълват автоматично."
    >
      <h1 className="auth__title">Създайте профил</h1>
      <p className="auth__sub">Отнема под минута.</p>

      {error && <Alert severity="error" sx={{ mb: 2 }} role="alert">{error}</Alert>}

      <form className="auth__form" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          {field("firstName", "Име", { autoComplete: "given-name", autoFocus: true })}
          {field("lastName", "Фамилия", { autoComplete: "family-name" })}
          {field("email", "Имейл", { type: "email", autoComplete: "email", className: "span-2" })}
          {field("phoneNumber", "Телефон", { type: "tel", autoComplete: "tel", className: "span-2", placeholder: "0888 123 456" })}
          <PasswordField
            className="span-2"
            name="password"
            label="Парола"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            error={Boolean(errors.password)}
            required
          />
          <ul className="pw-rules span-2" aria-label="Изисквания за паролата">
            {passwordChecks(form.password).map((c) => (
              <li key={c.label} className={c.ok ? "ok" : ""}>
                {c.ok ? <FiCheckCircle /> : <FiCircle />} {c.label}
              </li>
            ))}
          </ul>
          <PasswordField
            className="span-2"
            name="confirm"
            label="Повторете паролата"
            autoComplete="new-password"
            value={form.confirm}
            onChange={onChange}
            error={Boolean(errors.confirm)}
            helperText={errors.confirm}
            required
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {submitting ? "Създаване…" : "Създай профил"}
        </Button>
      </form>

      <p className="auth__alt">
        Вече имате профил? <Link to="/login">Влезте</Link>
      </p>
    </AuthShell>
  );
};

export default RegisterPage;
