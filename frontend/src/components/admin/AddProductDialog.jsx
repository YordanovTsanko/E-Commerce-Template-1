import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, TextField } from "@mui/material";
import { toast } from "react-toastify";
import api, { getApiErrorMessage } from "../../api/axios";
import { CATEGORIES, SITE } from "../../config/site";
import { required, validate } from "../../utils/validation";

const EMPTY = { name: "", img: "", price: "", stock: "", category: "", description: "" };

const RULES = {
  name: (v) => (!String(v).trim() ? "Въведете име." : v.length > 100 ? "До 100 символа." : null),
  img: (v) => (/^https?:\/\/\S+$/i.test(String(v).trim()) ? null : "Въведете линк към снимка (https://…)."),
  price: (v) => (Number(v) > 0 ? null : "Цената трябва да е по-голяма от 0."),
  stock: (v) => (v !== "" && Number.isInteger(Number(v)) && Number(v) >= 0 ? null : "Въведете цяло число ≥ 0."),
  category: required("категория"),
  description: (v) => {
    const n = String(v).trim().length;
    if (n < 200) return `Описанието трябва да е поне 200 символа (сега ${n}).`;
    if (n > 2000) return "Описанието трябва да е до 2000 символа.";
    return null;
  },
};

const AddProductDialog = ({ open, onClose, onCreated }) => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (errors[e.target.name]) setErrors(validate(next, RULES));
  };

  const close = () => {
    if (saving) return;
    setErrors({});
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values, RULES);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      const { data } = await api.post("/api/v1/admin/product/new", {
        ...values,
        name: values.name.trim(),
        img: values.img.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
      });
      toast.success("Продуктът е добавен.");
      setValues(EMPTY);
      setErrors({});
      onCreated?.(data.product);
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const descLen = values.description.trim().length;

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <form onSubmit={submit} noValidate>
        <DialogTitle sx={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Нов продукт</DialogTitle>
        <DialogContent>
          <div className="form-grid" style={{ paddingTop: 8 }}>
            <TextField className="span-2" name="name" label="Име" value={values.name} onChange={change} error={!!errors.name} helperText={errors.name || " "} required />
            <TextField className="span-2" name="img" label="Линк към снимка" value={values.img} onChange={change} error={!!errors.img} helperText={errors.img || " "} required />
            <TextField
              name="price"
              type="number"
              label="Цена"
              value={values.price}
              onChange={change}
              error={!!errors.price}
              helperText={errors.price || " "}
              required
              slotProps={{
                htmlInput: { min: 0, step: "0.01" },
                input: { endAdornment: <InputAdornment position="end">{SITE.currency}</InputAdornment> },
              }}
            />
            <TextField name="stock" type="number" label="Наличност (бр.)" value={values.stock} onChange={change} error={!!errors.stock} helperText={errors.stock || " "} required slotProps={{ htmlInput: { min: 0, step: 1 } }} />
            <TextField select className="span-2" name="category" label="Категория" value={values.category} onChange={change} error={!!errors.category} helperText={errors.category || " "} required>
              {CATEGORIES.map((c) => (
                <MenuItem key={c.slug} value={c.slug}>{c.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              className="span-2"
              name="description"
              label="Описание"
              multiline
              minRows={5}
              value={values.description}
              onChange={change}
              error={!!errors.description}
              helperText={errors.description || `${descLen} / 2000 символа (минимум 200)`}
              required
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={close} color="inherit" disabled={saving}>Отказ</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Запазване…" : "Добави продукта"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductDialog;
