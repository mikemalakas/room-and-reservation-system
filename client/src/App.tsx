import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./router/routes.ts";
import getTheme from "@/theme/theme";
import { useThemeStore } from "./stores/useThemeStore.ts";

export default function App() {
  const router = createBrowserRouter(routes);
  const mode = useThemeStore((state) => state.mode);
  const theme = getTheme(mode);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}
