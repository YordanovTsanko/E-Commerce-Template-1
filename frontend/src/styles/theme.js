import { createTheme } from "@mui/material/styles";

// Палитра: петролено синьо + шафран върху хладна светла основа.
export const tokens = {
  paper: "#F4F6F7",
  surface: "#FFFFFF",
  ink: "#14262C",
  muted: "#5A6C72",
  line: "#DCE3E5",
  petrol: "#0F4C5C",
  petrolDark: "#0B3944",
  petrolDeep: "#08272F",
  saffron: "#E9A23B",
  saffronSoft: "#FCEFD8",
  danger: "#B93A32",
  success: "#2E7D57",
};

const display = '"Unbounded", "Onest", system-ui, sans-serif';
const body = '"Onest", system-ui, -apple-system, "Segoe UI", sans-serif';

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: tokens.petrol, dark: tokens.petrolDark, contrastText: "#fff" },
    secondary: { main: tokens.saffron, contrastText: tokens.petrolDeep },
    error: { main: tokens.danger },
    success: { main: tokens.success },
    warning: { main: "#B7791F" },
    info: { main: "#2B6CB0" },
    background: { default: tokens.paper, paper: tokens.surface },
    text: { primary: tokens.ink, secondary: tokens.muted },
    divider: tokens.line,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: body,
    h1: { fontFamily: display, fontWeight: 600, letterSpacing: "-0.02em" },
    h2: { fontFamily: display, fontWeight: 600, letterSpacing: "-0.02em" },
    h3: { fontFamily: display, fontWeight: 600, letterSpacing: "-0.015em" },
    h4: { fontFamily: display, fontWeight: 600, fontSize: "1.75rem", letterSpacing: "-0.01em" },
    h5: { fontFamily: display, fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 700, fontSize: "1.05rem" },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 18, minHeight: 42 },
        sizeLarge: { minHeight: 50, paddingInline: 26, fontSize: "1rem" },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined", fullWidth: true } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.surface,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.line },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#A9B8BD" },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 18, padding: 4 } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: tokens.muted, fontSize: ".82rem", background: tokens.paper },
        root: { borderColor: tokens.line },
      },
    },
    MuiSkeleton: { defaultProps: { animation: "wave" } },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
});

export default theme;
