import React from "react";

const AuthShell = ({ asideTitle, asideText, wide, children }) => (
  <div className="auth">
    <div className="auth__aside" aria-hidden="true">
      <h2>{asideTitle}</h2>
      <p>{asideText}</p>
    </div>
    <div className="auth__main">
      <div className={`auth__card${wide ? " auth__card--wide" : ""}`}>{children}</div>
    </div>
  </div>
);

export default AuthShell;
