import { IconButton, Icon } from "@mui/material";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeStore();

  return (
    <IconButton onClick={toggleMode} color="inherit">
      <Icon>{mode == "light" ? "light_mode" : "dark_mode"}</Icon>
    </IconButton>
  );
}
