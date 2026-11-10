import React, { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SITE } from "../config/site";
import { isEmail, required, validate } from "../utils/validation";
import useDocumentTitle from "../hooks/useDocumentTitle";

const TOPICS = ["Въпрос за продукт", "Статус на поръчка", "Връщане или замяна", "Друго"];

const RULES = {
  name: required("вашето име"),
  email: (v) => (isEmail(v) ? null : "Въведете валиден имейл адрес."),
  message: (v) =>
    String(v || "").trim().length >= 10 ? null : "Съобщението трябва да е поне 10 символа.",
};

const ContactPage = () => {
  useDocumentTitle("Контакти");
  const user = useSelector((s) => s.auth.user);
  const [values, setValues] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    topic: TOPICS[0],
    message: "",
  });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (errors[e.target.name]) setErrors(validate(next, RULES));
  };

  // Бекендът няма endpoint за съобщения — отваряме имейл клиента с попълнено писмо.
  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values, RULES);
    setErrors(found);
    if (Object.keys(found).length) return;
    const subject = encodeURIComponent(`${values.topic} — ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n${values.name}\n${values.email}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    toast.info("Отваряме имейл приложението ви с готово писмо.");
  };

  const cards = [
    { icon: <FiPhone />, title: "Телефон", content: <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a> },
    { icon: <FiMail />, title: "Имейл", content: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> },
    { icon: <FiMapPin />, title: "Адрес", content: <span>{SITE.address}</span> },
    { icon: <FiClock />, title: "Работно време", content: <span>{SITE.workingHours}</span> },
  ];

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Свържете се с нас</h1>
        <p className="page-sub">
          Имате въпрос за продукт или поръчка? Пишете ни или се обадете — отговаряме в рамките на работния ден.
        </p>
      </header>

      <div className="contact">
        <div className="contact__info">
          {cards.map((c) => (
            <div className="contact-card" key={c.title}>
              <span className="contact-card__icon" aria-hidden="true">{c.icon}</span>
              <div>
                <strong>{c.title}</strong>
                {c.content}
              </div>
            </div>
          ))}
        </div>

        <form className="panel" onSubmit={onSubmit} noValidate>
          <h2 className="panel__title">Изпратете съобщение</h2>
          <div className="form-grid">
            <TextField
              name="name"
              label="Име и фамилия"
              autoComplete="name"
              value={values.name}
              onChange={onChange}
              error={Boolean(errors.name)}
              helperText={errors.name || " "}
              required
            />
            <TextField
              name="email"
              type="email"
              label="Имейл"
              autoComplete="email"
              value={values.email}
              onChange={onChange}
              error={Boolean(errors.email)}
              helperText={errors.email || " "}
              required
            />
            <TextField select name="topic" label="Тема" value={values.topic} onChange={onChange} className="span-2">
              {TOPICS.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField
              className="span-2"
              name="message"
              label="Съобщение"
              multiline
              minRows={5}
              value={values.message}
              onChange={onChange}
              error={Boolean(errors.message)}
              helperText={errors.message || `${values.message.length} символа`}
              required
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="contained" size="large" endIcon={<FiSend />}>
              Изпрати съобщението
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
