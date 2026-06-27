import type { IEquipment } from "@/stores/useEquipmentStore"
import { Badge } from "@/components/ui/badge"
import ActionDropdown from "../button/ActionDropdown"
import type { DropdownItem } from "../button/ActionDropdown"

interface Props {
  equipment: IEquipment
  actions?: DropdownItem[]
}

export default function EquipmentCard({ equipment, actions }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="h-48 w-full overflow-hidden bg-muted">
        <img
          src={equipment.image.url}
          alt={equipment.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base leading-tight font-semibold">
            {equipment.name}
          </h3>
          <Badge variant={equipment.isAvailable ? "success" : "destructive"}>
            {equipment.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {equipment.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Added by {equipment.createdBy?.user?.name ?? "Unknown"}
          </p>
          {actions && actions.length > 0 && <ActionDropdown items={actions} />}
        </div>
      </div>
    </div>
  )
}
