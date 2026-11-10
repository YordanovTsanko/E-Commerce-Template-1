import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { clearErrors, login } from "../../Redux/Actions/authActions";
import PasswordField from "../../components/common/PasswordField";
import AuthShell from "./AuthShell";
import { isEmail } from "../../utils/validation";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const LoginPage = () => {
  useDocumentTitle("Вход");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { initialized, isAuthenticated, submitting, error } = useSelector((s) => s.auth);
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ email: location.state?.email || "", password: "" });
  const [errors, setErrors] = useState({});

  // Вече влязъл потребител няма работа тук.
  useEffect(() => {
    if (initialized && isAuthenticated) navigate(redirectTo, { replace: true });
  }, [initialized, isAuthenticated, navigate, redirectTo]);

  // Изчистваме стари грешки при влизане/излизане от страницата.
  useEffect(() => {
    dispatch(clearErrors());
    return () => dispatch(clearErrors());
  }, [dispatch]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
    if (error) dispatch(clearErrors());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!isEmail(form.email)) found.email = "Въведете валиден имейл адрес.";
    if (!form.password) found.password = "Въведете паролата си.";
    setErrors(found);
    if (Object.keys(found).length) return;

    const user = await dispatch(login(form.email, form.password));
    if (user) {
      toast.success(`Добре дошли, ${user.firstName}!`);
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <AuthShell
      asideTitle="Радваме се да ви видим отново"
      asideText="Влезте, за да видите количката, поръчките и запазените си данни за доставка."
    >
      <h1 className="auth__title">Вход</h1>
      <p className="auth__sub">Въведете имейла и паролата, с които сте се регистрирали.</p>

      {location.state?.registered && !error && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Профилът е създаден. Въведете паролата си, за да влезете.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} role="alert">{error}</Alert>
      )}

      <form className="auth__form" onSubmit={onSubmit} noValidate>
        <TextField
          name="email"
          type="email"
          label="Имейл"
          autoComplete="email"
          autoFocus={!form.email}
          value={form.email}
          onChange={onChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <PasswordField
          name="password"
          label="Парола"
          autoComplete="current-password"
          autoFocus={Boolean(form.email)}
          value={form.password}
          onChange={onChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <div style={{ textAlign: "right", marginTop: -6 }}>
          <Link to="/forgotpassword" className="link" style={{ fontSize: ".9rem" }}>
            Забравена парола?
          </Link>
        </div>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {submitting ? "Влизане…" : "Вход"}
        </Button>
      </form>

      <p className="auth__alt">
        Нямате профил? <Link to="/register" state={location.state}>Създайте профил</Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
