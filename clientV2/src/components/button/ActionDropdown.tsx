import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface DropdownItem {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: "default" | "destructive"
}

interface Props {
  items: DropdownItem[]
}

export default function ActionDropdown({ items }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" onClick={(e) => e.preventDefault()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={(e) => {
              e.preventDefault()
              item.onClick()
            }}
            className={
              item.variant === "destructive"
                ? "text-destructive focus:text-destructive"
                : ""
            }
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
