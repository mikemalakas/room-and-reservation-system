import { useParams, useNavigate } from "react-router-dom"
import { useEquipmentStore } from "@/stores/useEquipmentStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Show() {
  const { id } = useParams()
  const navigate = useNavigate()
  const equipment = useEquipmentStore((state) =>
    state.equipments.find((e) => e._id === id)
  )

  if (!equipment) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Equipment not found.
      </div>
    )
  }

  return (
    <div className="w-100 space-y-6 p-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="h-72 w-full overflow-hidden rounded-xl border bg-muted">
        <img
          src={equipment.image.url}
          alt={equipment.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{equipment.name}</h1>
          <Badge variant={equipment.isAvailable ? "default" : "secondary"}>
            {equipment.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        <p className="text-muted-foreground">{equipment.description}</p>

        <div className="space-y-1 border-t pt-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Added by: </span>
            {equipment.createdBy?.user?.name ?? "Unknown"}
          </p>
          <p>
            <span className="font-medium text-foreground">Date added: </span>
            {new Date(equipment.createdAt).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
