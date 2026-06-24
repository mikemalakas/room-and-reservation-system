import { Link, useLocation } from "react-router-dom"
import * as Icons from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { extractSidebarItems } from "@/utils/extractSidebarItems"
import { useAuthStore } from "@/stores/useAuthStore"
import routes from "@/router/routes"
import api from "@/services/api"

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const userStore = useAuthStore()
  const items = extractSidebarItems(routes, userStore.user?.role ?? "")

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
      userStore.clearUser()
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = Icons[
                  item.icon as keyof typeof Icons
                ] as React.ElementType
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                    >
                      <Link to={item.path}>
                        {Icon && <Icon />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
