import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a8a", // Dark blue
      light: "#3b82f6",
      dark: "#1e40af",
    },
    secondary: {
      main: "#fbbf24", // Gold
      light: "#fcd34d",
      dark: "#f59e0b",
    },
    background: {
      default: "#f8fafc", // Light gray background
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b", // Dark text
      secondary: "#64748b", // Gray text
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1e293b",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e3a8a", // Dark blue sidebar
          color: "#ffffff",
        },
      },
    },
  },
});

export default theme;
