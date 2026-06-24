import { Link, useLocation } from "react-router-dom"
import * as Icons from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
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

  // Group items by their group label, ungrouped items fall under "General"
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.group ?? "General"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Icons.Book className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">MyApp</span>
                  <span className="text-xs text-muted-foreground">
                    {userStore.user?.role} panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(grouped).map(([group, groupItems]) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupItems.map((item) => {
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
        ))}
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
