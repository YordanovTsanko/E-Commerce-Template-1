import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Chip } from "@mui/material";
import { FiEdit2 } from "react-icons/fi";
import AccountShell from "./AccountShell";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const show = (v) => (v === undefined || v === null || v === "" ? <span style={{ color: "var(--muted)" }}>Не е попълнено</span> : v);

const ProfilePage = () => {
  useDocumentTitle("Моят профил");
  const user = useSelector((s) => s.auth.user);

  return (
    <AccountShell
      title="Моят профил"
      actions={
        <Button component={Link} to="/profile/edit" variant="outlined" startIcon={<FiEdit2 />}>
          Редактирай данните
        </Button>
      }
    >
      <section className="panel">
        <div className="profile-head">
          <span className="avatar-initials">
            {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase()}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ color: "var(--muted)", fontSize: ".92rem" }}>
              Клиент от {formatDate(user?.createdAt)}
              {user?.role === "admin" && <Chip size="small" label="Администратор" color="secondary" sx={{ ml: 1 }} />}
            </div>
          </div>
        </div>
        <dl className="kv">
          <dt>Имейл</dt><dd>{show(user?.email)}</dd>
          <dt>Телефон</dt><dd>{show(user?.phoneNumber ? `0${user.phoneNumber}` : "")}</dd>
        </dl>
      </section>

      <section className="panel">
        <h2 className="panel__title">Адрес за доставка</h2>
        <dl className="kv">
          <dt>Адрес</dt><dd>{show(user?.address)}</dd>
          <dt>Град</dt><dd>{show(user?.city)}</dd>
          <dt>Пощенски код</dt><dd>{show(user?.postCode)}</dd>
          <dt>Област</dt><dd>{show(user?.state)}</dd>
        </dl>
      </section>
    </AccountShell>
  );
};

export default ProfilePage;
