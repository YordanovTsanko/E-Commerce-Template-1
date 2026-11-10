import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFoundPage = ({ admin = false }) => {
  useDocumentTitle("Страницата не е намерена");
  const navigate = useNavigate();
  return (
    <section className="notfound" aria-labelledby="nf-title">
      <div>
        <div className="notfound__code" aria-hidden="true">
          4<span className="notfound__zero" />4
        </div>
        <h1 id="nf-title">Тази страница не съществува</h1>
        <p>Адресът може да е грешен или страницата да е преместена. Проверете линка или се върнете в началото.</p>
        <div className="notfound__actions">
          <Button
            variant="contained"
            size="large"
            component={Link}
            to={admin ? "/admin/dashboard" : "/"}
            startIcon={<FiHome />}
          >
            {admin ? "Обратно към таблото" : "Обратно към началната страница"}
          </Button>
          <Button variant="outlined" size="large" startIcon={<FiArrowLeft />} onClick={() => navigate(-1)}>
            Назад
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
