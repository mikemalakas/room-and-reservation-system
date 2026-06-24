import { Outlet } from "react-router-dom"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Appbar from "@/components/appbar/Appbar"
import { useUserStore } from "@/stores/useUserStore.ts"
import { useEquipmentStore } from "@/stores/useEquipmentStore"
import { useEffect } from "react"

export default function AdminLayout() {
  const { fetchUsers } = useUserStore()
  const { fetchEquipment } = useEquipmentStore()

  useEffect(() => {
    fetchUsers()
    fetchEquipment()
  }, [])
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Appbar />
          <main className="md:p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
