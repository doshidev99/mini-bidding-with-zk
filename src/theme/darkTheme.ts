import { createTheme } from "@mui/material";

export const themeColor = {
  bgElevation: {
    background: "#040b2a",
    surface: "#1a203d",
    bodyText: "#e6e6e6",
    textTop: "#f2f2f2",
  },
  gray: {
    "70": "#ccc",
    "80": "#e5e5e5",
  },
  secondary: {
    "40": "#33d7f9",
    "60": "#00a4c6",
  },
  success: {
    "40": "#28a745",
  },
  error: {
    "40": "#ff4141",
  },
  pending: {
    "40": "#fd7e14",
  },
} as const;

export type TThemeColor = typeof themeColor;

const darkTheme = createTheme({
  ...themeColor,
  palette: {
    mode: "dark",
  },
});

export type TTheme = typeof darkTheme;

export default darkTheme;
