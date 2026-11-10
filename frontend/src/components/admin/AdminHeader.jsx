import React from "react";

const AdminHeader = ({ title, sub, children }) => (
  <header className="admin-head">
    <div>
      <h1 className="page-title">{title}</h1>
      {sub && <p className="page-sub">{sub}</p>}
    </div>
    {children && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>}
  </header>
);

export default AdminHeader;
