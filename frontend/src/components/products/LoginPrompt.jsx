import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";

/** Показва се, когато гост опита да добави в количката или да напише ревю. */
const LoginPrompt = ({ open, onClose, text }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <ConfirmDialog
      open={open}
      title="Влезте в профила си"
      text={text || "За да добавяте продукти в количката, трябва да влезете в профила си."}
      confirmLabel="Към вход"
      cancelLabel="Не сега"
      onClose={onClose}
      onConfirm={() => navigate("/login", { state: { from: location.pathname } })}
    />
  );
};

export default LoginPrompt;
