import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import { updatePassword, updateProfile } from "../../Redux/Actions/authActions";
import PasswordField from "../../components/common/PasswordField";
import AccountShell from "./AccountShell";
import {
  digitsOnly,
  isEmail,
  isPhone,
  isStrongPassword,
  required,
  validate,
} from "../../utils/validation";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const PROFILE_RULES = {
  firstName: required("име"),
  lastName: required("фамилия"),
  email: (v) => (isEmail(v) ? null : "Въведете валиден имейл адрес."),
  phoneNumber: (v) => (isPhone(v) ? null : "Въведете валиден телефонен номер."),
  postCode: (v) => (!v || /^\d{4}$/.test(String(v)) ? null : "Пощенският код е 4 цифри."),
  address: (v) => (String(v || "").length <= 50 ? null : "До 50 символа."),
  city: (v) => (String(v || "").length <= 20 ? null : "До 20 символа."),
  state: (v) => (String(v || "").length <= 20 ? null : "До 20 символа."),
};

const PASSWORD_RULES = {
  password: required("текущата си парола"),
  newPassword: (v) =>
    isStrongPassword(v) ? null : "Поне 8 символа, главна и малка латинска буква и специален символ.",
  confirmPassword: (v, all) => (v === all.newPassword ? null : "Паролите не съвпадат."),
};

const EditProfilePage = () => {
  useDocumentTitle("Настройки на профила");
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const saving = useSelector((s) => s.user.loading);

  const [details, setDetails] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber ? `0${user.phoneNumber}` : "",
    address: user?.address || "",
    city: user?.city || "",
    postCode: user?.postCode ? String(user.postCode) : "",
    state: user?.state || "",
  });
  const [detailErrors, setDetailErrors] = useState({});
  const [pw, setPw] = useState({ password: "", newPassword: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState({});

  const changeDetails = (e) => {
    const next = { ...details, [e.target.name]: e.target.value };
    setDetails(next);
    if (detailErrors[e.target.name]) setDetailErrors(validate(next, PROFILE_RULES));
  };
  const changePw = (e) => {
    const next = { ...pw, [e.target.name]: e.target.value };
    setPw(next);
    if (pwErrors[e.target.name]) setPwErrors(validate(next, PASSWORD_RULES));
  };

  const saveDetails = (e) => {
    e.preventDefault();
    const found = validate(details, PROFILE_RULES);
    setDetailErrors(found);
    if (Object.keys(found).length) return;
    const payload = {
      id: user._id,
      firstName: details.firstName.trim(),
      lastName: details.lastName.trim(),
      email: details.email.trim().toLowerCase(),
      phoneNumber: digitsOnly(details.phoneNumber),
      address: details.address.trim(),
      city: details.city.trim(),
      state: details.state.trim(),
    };
    if (details.postCode) payload.postCode = Number(details.postCode);
    dispatch(updateProfile(payload));
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const found = validate(pw, PASSWORD_RULES);
    setPwErrors(found);
    if (Object.keys(found).length) return;
    const ok = await dispatch(updatePassword(user._id, pw));
    if (ok) setPw({ password: "", newPassword: "", confirmPassword: "" });
  };

  const field = (name, label, props = {}) => (
    <TextField
      name={name}
      label={label}
      value={details[name]}
      onChange={changeDetails}
      error={Boolean(detailErrors[name])}
      helperText={detailErrors[name] || " "}
      {...props}
    />
  );

  return (
    <AccountShell title="Настройки" sub="Обновете личните си данни, адреса за доставка и паролата.">
      <form className="panel" onSubmit={saveDetails} noValidate>
        <h2 className="panel__title">Лични данни и адрес</h2>
        <div className="form-grid">
          {field("firstName", "Име", { autoComplete: "given-name", required: true })}
          {field("lastName", "Фамилия", { autoComplete: "family-name", required: true })}
          {field("email", "Имейл", { type: "email", autoComplete: "email", required: true })}
          {field("phoneNumber", "Телефон", { type: "tel", autoComplete: "tel", required: true })}
          {field("address", "Адрес", { autoComplete: "street-address", className: "span-2" })}
          {field("city", "Град", { autoComplete: "address-level2" })}
          {field("postCode", "Пощенски код", { autoComplete: "postal-code", inputMode: "numeric" })}
          {field("state", "Област", { autoComplete: "address-level1", className: "span-2" })}
        </div>
        <div className="form-actions">
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Запазване…" : "Запази промените"}
          </Button>
        </div>
      </form>

      <form className="panel" onSubmit={savePassword} noValidate>
        <h2 className="panel__title">Смяна на парола</h2>
        <div className="form-grid">
          <PasswordField
            className="span-2"
            name="password"
            label="Текуща парола"
            autoComplete="current-password"
            value={pw.password}
            onChange={changePw}
            error={Boolean(pwErrors.password)}
            helperText={pwErrors.password || " "}
          />
          <PasswordField
            name="newPassword"
            label="Нова парола"
            autoComplete="new-password"
            value={pw.newPassword}
            onChange={changePw}
            error={Boolean(pwErrors.newPassword)}
            helperText={pwErrors.newPassword || " "}
          />
          <PasswordField
            name="confirmPassword"
            label="Повторете новата парола"
            autoComplete="new-password"
            value={pw.confirmPassword}
            onChange={changePw}
            error={Boolean(pwErrors.confirmPassword)}
            helperText={pwErrors.confirmPassword || " "}
          />
        </div>
        <div className="form-actions">
          <Button type="submit" variant="contained" disabled={saving}>
            Смени паролата
          </Button>
        </div>
      </form>
    </AccountShell>
  );
};

export default EditProfilePage;
