import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  title,
  text,
  confirmLabel = "Потвърди",
  cancelLabel = "Отказ",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{title}</DialogTitle>
    {text && (
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
      <Button onClick={onClose} disabled={loading} color="inherit">
        {cancelLabel}
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color={danger ? "error" : "primary"}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
