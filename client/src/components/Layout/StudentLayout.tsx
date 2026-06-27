import { Outlet } from "react-router-dom"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Appbar from "@/components/appbar/Appbar"
import { useEquipmentStore } from "@/stores/useEquipmentStore"
import { useEffect } from "react"

export default function StudentLayout() {
  const { fetchEquipment } = useEquipmentStore()

  useEffect(() => {
    fetchEquipment()
  }, [])

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Appbar />
          <main className="p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
