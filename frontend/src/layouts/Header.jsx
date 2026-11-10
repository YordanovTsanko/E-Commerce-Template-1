import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Drawer, IconButton, Menu, MenuItem, ListItemIcon, Divider, Tooltip } from "@mui/material";
import { FiShoppingBag, FiMenu, FiUser, FiLogOut, FiPackage, FiSettings, FiGrid, FiHome, FiMail, FiLogIn, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { logout } from "../Redux/Actions/authActions";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { SITE, CATEGORIES } from "../config/site";

export const Brand = ({ to = "/" }) => (
  <Link to={to} className="brand" aria-label={`${SITE.name} — начало`}>
    <span className="brand__mark" aria-hidden="true">
      <FiShoppingBag />
    </span>
    {SITE.name}
  </Link>
);

const initials = (user) =>
  `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "?";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, submitting } = useSelector((s) => s.auth);
  const cartItems = useSelector((s) => s.cart.cartItems);
  const cartCount = cartItems.reduce((n, i) => n + (Number(i.quantity) || 0), 0);
  const isAdmin = isAuthenticated && user?.role === "admin";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const closeAll = () => {
    setDrawerOpen(false);
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    const ok = await dispatch(logout());
    setConfirmLogout(false);
    if (ok) {
      toast.success("Излязохте от профила си.");
      navigate("/");
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <IconButton
            className="header-only-mobile"
            onClick={() => setDrawerOpen(true)}
            aria-label="Отвори менюто"
            edge="start"
          >
            <FiMenu />
          </IconButton>

          <Brand />

          <nav className="site-nav" aria-label="Основна навигация">
            <NavLink to="/" end>Начало</NavLink>
            <NavLink to="/product/type/woman cloths">Дамско</NavLink>
            <NavLink to="/product/type/man cloths">Мъжко</NavLink>
            <NavLink to="/product/type/electronics">Електроника</NavLink>
            <NavLink to="/contact">Контакти</NavLink>
          </nav>

          <div className="header-actions">
            {isAdmin && (
              <Button
                component={Link}
                to="/admin/dashboard"
                variant="outlined"
                size="small"
                startIcon={<FiGrid />}
                className="header-only-desktop"
              >
                Админ панел
              </Button>
            )}

            <Tooltip title="Количка">
              <IconButton component={Link} to="/cart" aria-label={`Количка, ${cartCount} продукта`}>
                <Badge badgeContent={cartCount} max={99} color="secondary">
                  <FiShoppingBag />
                </Badge>
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <>
                <Button
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                  color="inherit"
                  className="header-only-desktop"
                  aria-haspopup="menu"
                  startIcon={<span className="avatar-initials" style={{ width: 30, height: 30, borderRadius: 9, fontSize: ".72rem" }}>{initials(user)}</span>}
                >
                  {user?.firstName}
                </Button>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => setMenuAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  slotProps={{ paper: { sx: { minWidth: 220, mt: 1, border: "1px solid var(--line)" } } }}
                >
                  <MenuItem component={Link} to="/profile" onClick={closeAll}>
                    <ListItemIcon><FiUser /></ListItemIcon>Моят профил
                  </MenuItem>
                  <MenuItem component={Link} to="/profile/orders" onClick={closeAll}>
                    <ListItemIcon><FiPackage /></ListItemIcon>Моите поръчки
                  </MenuItem>
                  <MenuItem component={Link} to="/profile/edit" onClick={closeAll}>
                    <ListItemIcon><FiSettings /></ListItemIcon>Настройки
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem component={Link} to="/admin/dashboard" onClick={closeAll}>
                      <ListItemIcon><FiGrid /></ListItemIcon>Админ панел
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => { closeAll(); setConfirmLogout(true); }}>
                    <ListItemIcon><FiLogOut /></ListItemIcon>Изход
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                startIcon={<FiLogIn />}
                className="header-only-desktop"
              >
                Вход
              </Button>
            )}
          </div>
        </div>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="drawer">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Brand />
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="Затвори менюто">
              <FiX />
            </IconButton>
          </div>
          <NavLink to="/" end onClick={closeAll}><FiHome /> Начало</NavLink>
          {CATEGORIES.map((c) => (
            <NavLink key={c.slug} to={`/product/type/${c.slug}`} onClick={closeAll} style={{ paddingLeft: 40, fontWeight: 500 }}>
              {c.label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={closeAll}><FiMail /> Контакти</NavLink>
          <div className="drawer__sep" />
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" end onClick={closeAll}><FiUser /> Моят профил</NavLink>
              <NavLink to="/profile/orders" onClick={closeAll}><FiPackage /> Моите поръчки</NavLink>
              {isAdmin && <NavLink to="/admin/dashboard" onClick={closeAll}><FiGrid /> Админ панел</NavLink>}
              <button className="drawer-link" onClick={() => { closeAll(); setConfirmLogout(true); }}>
                <FiLogOut /> Изход
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeAll}><FiLogIn /> Вход</NavLink>
              <NavLink to="/register" onClick={closeAll}><FiUser /> Регистрация</NavLink>
            </>
          )}
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmLogout}
        title="Изход от профила"
        text="Ще трябва да влезете отново, за да видите количката и поръчките си."
        confirmLabel="Изход"
        loading={submitting}
        onConfirm={handleLogout}
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
};

export default Header;
