import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { FiMail } from "react-icons/fi";
import AuthShell from "./AuthShell";
import { SITE } from "../../config/site";
import useDocumentTitle from "../../hooks/useDocumentTitle";

/*
 * Бекендът все още няма endpoint за възстановяване на парола.
 * Старата форма показваше „Имейлът е изпратен“, без да изпраща нищо —
 * заменена е с честна страница, която насочва към поддръжката.
 */
const ForgotPasswordPage = () => {
  useDocumentTitle("Забравена парола");
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent("Възстановяване на парола")}`;
  return (
    <AuthShell
      asideTitle="Ще ви помогнем да влезете"
      asideText="Пишете ни от имейла, с който сте регистрирани, и ще възстановим достъпа ви."
    >
      <h1 className="auth__title">Забравена парола</h1>
      <p className="auth__sub">
        Автоматичното възстановяване на парола все още не е налично. Изпратете ни имейл от адреса,
        с който сте се регистрирали, и ще ви помогнем в рамките на работния ден.
      </p>
      <div className="auth__form">
        <Button variant="contained" size="large" href={mail} startIcon={<FiMail />}>
          Пишете на {SITE.email}
        </Button>
        <Button component={Link} to="/login" variant="outlined" size="large">
          Обратно към вход
        </Button>
      </div>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
