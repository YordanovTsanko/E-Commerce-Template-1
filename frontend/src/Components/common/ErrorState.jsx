import React from "react";
import { Button } from "@mui/material";
import { MdErrorOutline, MdRefresh } from "react-icons/md";
import EmptyState from "./EmptyState";

const ErrorState = ({ title = "Данните не се заредиха", message, onRetry }) => (
  <EmptyState
    icon={<MdErrorOutline style={{ color: "var(--danger)" }} />}
    title={title}
    text={message || "Възникна неочаквана грешка. Опитайте отново."}
  >
    {onRetry && (
      <Button variant="contained" startIcon={<MdRefresh />} onClick={onRetry}>
        Опитай отново
      </Button>
    )}
  </EmptyState>
);

export default ErrorState;
