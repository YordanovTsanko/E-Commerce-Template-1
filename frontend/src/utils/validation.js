export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v) => EMAIL_RE.test(String(v || "").trim());
export const digitsOnly = (v) => String(v || "").replace(/\D/g, "");
export const isPhone = (v) => {
  const d = digitsOnly(v);
  return d.length >= 6 && d.length <= 15;
};

export const passwordChecks = (pw = "") => [
  { ok: pw.length >= 8, label: "Поне 8 символа" },
  { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), label: "Главна и малка латинска буква" },
  { ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw), label: "Поне един специален символ (!@#$…)" },
];
// Бекендът проверява само латински букви — затова и тук изискваме латиница.
export const isStrongPassword = (pw = "") =>
  pw.length >= 8 &&
  /[A-Z]/.test(pw) &&
  /[a-z]/.test(pw) &&
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw);

/** Връща обект { поле: съобщение } само за невалидните полета. */
export const validate = (values, rules) =>
  Object.entries(rules).reduce((errors, [field, check]) => {
    const message = check(values[field], values);
    if (message) errors[field] = message;
    return errors;
  }, {});

export const required = (label) => (v) =>
  String(v ?? "").trim() ? null : `Моля, въведете ${label}.`;
