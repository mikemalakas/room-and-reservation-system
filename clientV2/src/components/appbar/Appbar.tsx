import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"

export default function Appbar() {
  const userStore = useAuthStore()
  console.log(userStore)
  return (
    <>
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <span className="font-medium">Hi {userStore.user?.name}</span>
      </header>
    </>
  )
}
