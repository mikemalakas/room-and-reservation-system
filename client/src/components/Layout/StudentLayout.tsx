import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";

import Header from "@/components/Appbar/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAuthStore } from "@/stores/useAuthStore";

export default function StudentLayout() {
  const userStore = useAuthStore();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Header title={`Hi student ${userStore.user?.name}`} />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
