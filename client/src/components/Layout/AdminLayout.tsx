import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";

import Header from "@/components/Appbar/Header";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Header title="Welcome Admin" />
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
