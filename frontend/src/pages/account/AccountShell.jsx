import React from "react";
import { NavLink } from "react-router-dom";
import { FiUser, FiPackage, FiSettings } from "react-icons/fi";

const AccountShell = ({ title, sub, actions, children }) => (
  <div className="page">
    <div className="account">
      <nav className="account-nav" aria-label="Профил">
        <NavLink to="/profile" end><FiUser /> Моят профил</NavLink>
        <NavLink to="/profile/orders"><FiPackage /> Моите поръчки</NavLink>
        <NavLink to="/profile/edit"><FiSettings /> Настройки</NavLink>
      </nav>
      <div style={{ minWidth: 0 }}>
        <header className="page-head" style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <h1 className="page-title">{title}</h1>
            {sub && <p className="page-sub">{sub}</p>}
          </div>
          {actions}
        </header>
        {children}
      </div>
    </div>
  </div>
);

export default AccountShell;
