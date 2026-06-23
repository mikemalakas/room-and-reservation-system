import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Icon,
  Box,
} from "@mui/material";

import { useSidebarStore } from "@/stores/sidebarStore";
import ThemeToggle from "../Button/ThemeToggle";

export default function Header({ title }: { title: string }) {
  const { open, toggle } = useSidebarStore();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggle}
          sx={{ mr: 2 }}
        >
          <Icon>{open ? "menu_open" : "menu"}</Icon>
        </IconButton>

        <Typography variant="h6">{title}</Typography>
        <Box sx={{ flexGrow: 1 }}></Box>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
