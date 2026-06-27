import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ToggleTheme() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  )
}
