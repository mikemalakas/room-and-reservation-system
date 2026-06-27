import { useEquipmentStore } from "@/stores/useEquipmentStore"
import EquipmentCard from "@/components/card/EquipmentCard"
import AddEquipment from "@/components/button/AddEquipment"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Outlet, useMatch } from "react-router-dom"

export default function EquipmentPage() {
  const { equipments, loading, error, deleteEquipment } = useEquipmentStore()

  const isIndex = useMatch("/faculty/equipment")

  const handleDelete = async (id: string) => {
    await deleteEquipment(id)
  }

  const handleEdit = (id: string) => {
    // wire up edit dialog later
    console.log("edit", id)
  }

  if (!isIndex) return <Outlet />

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Equipment</h1>
          <p className="text-sm text-muted-foreground">
            Manage all borrowable equipment
          </p>
        </div>
        <AddEquipment />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : equipments.length === 0 ? (
        <div className="flex justify-center py-20 text-sm text-muted-foreground">
          No equipment found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {equipments.map((item) => (
            <Link to={`/faculty/equipment/${item._id}`} key={item._id}>
              <EquipmentCard
                equipment={item}
                actions={[
                  {
                    label: "Edit",
                    icon: Pencil,
                    onClick: () => {
                      handleEdit(item._id)
                    },
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    onClick: () => {
                      handleDelete(item._id)
                    },
                    variant: "destructive",
                  },
                ]}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
