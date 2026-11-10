import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Drawer, IconButton } from "@mui/material";
import { FiArrowLeft, FiBox, FiGrid, FiMenu, FiShoppingCart, FiUsers } from "react-icons/fi";
import { Brand } from "./Header";

const LINKS = [
  { to: "/admin/dashboard", label: "Табло", icon: <FiGrid /> },
  { to: "/admin/products", label: "Продукти", icon: <FiBox /> },
  { to: "/admin/orders", label: "Поръчки", icon: <FiShoppingCart /> },
  { to: "/admin/users", label: "Потребители", icon: <FiUsers /> },
];

const Sidebar = ({ onNavigate }) => {
  const user = useSelector((s) => s.auth.user);
  return (
    <aside className="admin-side">
      <Brand to="/admin/dashboard" />
      <div className="admin-side__label">Управление</div>
      <nav aria-label="Админ навигация">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={onNavigate}>
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-side__foot">
        <div className="admin-user">
          <span className="avatar-initials">
            {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase()}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#fff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: ".8rem" }}>Администратор</div>
          </div>
        </div>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="secondary"
          startIcon={<FiArrowLeft />}
          fullWidth
        >
          Обратно към сайта
        </Button>
      </div>
    </aside>
  );
};

/** Админ изгледът няма основната навигация и футъра на сайта. */
const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="admin">
      <Sidebar />
      <div style={{ minWidth: 0 }}>
        <div className="admin-top">
          <IconButton onClick={() => setOpen(true)} sx={{ color: "#fff" }} aria-label="Отвори менюто">
            <FiMenu />
          </IconButton>
          <Brand to="/admin/dashboard" />
          <Button
            component={Link}
            to="/"
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<FiArrowLeft />}
            sx={{ ml: "auto" }}
          >
            Към сайта
          </Button>
        </div>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} slotProps={{ paper: { className: "admin-drawer" } }}>
        <Sidebar onNavigate={() => setOpen(false)} />
      </Drawer>
    </div>
  );
};

export default AdminLayout;
