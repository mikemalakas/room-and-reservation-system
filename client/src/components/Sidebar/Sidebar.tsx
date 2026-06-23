import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSidebarStore } from "@/stores/sidebarStore";
import { extractSidebarItems } from "@/utils/extractSidebarItems";
import routes from "@/router/routes";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const DRAWER_WIDTH = 240;
const MINI_WIDTH = 72;

export default function Sidebar() {
  const userStore = useAuthStore();
  const navigate = useNavigate();
  const open = useSidebarStore((state) => state.open);
  const items = extractSidebarItems(routes, userStore.user?.role ?? "");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      userStore.clearUser();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_WIDTH,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: (theme) =>
            theme.transitions.create("width", {
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
    >
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItem key={item.path} disablePadding>
            <NavLink
              end
              to={item.path}
              style={{
                width: "100%",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  sx={{
                    "&.Mui-selected": {
                      color: "primary.main",
                      "& .MuiListItemIcon-root": { color: "white" },
                    },
                    borderRadius: 1,
                    mx: 0.5,
                  }}
                >
                  <ListItemIcon>
                    <Icon sx={{ color: "primary.main" }}>{item.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 1, mx: 0.5 }}
          >
            <ListItemIcon>
              <Icon sx={{ color: "primary.main" }}>logout</Icon>
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
