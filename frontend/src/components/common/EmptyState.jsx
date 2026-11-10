import React from "react";

const EmptyState = ({ icon, title, text, children }) => (
  <div className="empty">
    {icon && <div className="empty__icon" aria-hidden="true">{icon}</div>}
    <h2>{title}</h2>
    {text && <p>{text}</p>}
    {children}
  </div>
);

export default EmptyState;
