import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7b7b7b",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    text: {
      primary: "#000",
    },
  },
  typography: {
    button: {
      padding: "8px 18px",
      borderRadius: 20,
      cursor: "pointer",
    },
  },
});

export default lightTheme;
