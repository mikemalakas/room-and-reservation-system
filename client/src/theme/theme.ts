// theme/theme.ts
import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1976d2" },
    },
  });

export default getTheme;
