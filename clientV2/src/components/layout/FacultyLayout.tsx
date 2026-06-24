import { Outlet } from "react-router-dom"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useEquipmentStore } from "@/stores/useEquipmentStore"
import Appbar from "@/components/appbar/Appbar"
import { useEffect } from "react"

export default function FacultyLayout() {
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
          <main className="md:p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
