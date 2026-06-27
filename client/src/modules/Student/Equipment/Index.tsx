import { useEquipmentStore } from "@/stores/useEquipmentStore"
import EquipmentCard from "@/components/card/EquipmentCard"
import { Loader2 } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import type { IEquipment } from "@/stores/useEquipmentStore"
import ReserveEquipmentForm from "./partial/ReserveEquipmentForm"
import type { ReserveEquipmentFormRef } from "./partial/ReserveEquipmentForm"
import { useMediaQuery } from "@/stores/useMediaQuery"

export default function Index() {
  const { equipments, loading, error } = useEquipmentStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // const [isDialogLoading, setIsDailogLoading] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<IEquipment | null>(
    null
  )
  const isMobile = useMediaQuery("(max-width: 768px)")

  const formRef = useRef<ReserveEquipmentFormRef>(null)

  const handleCardClick = (equipment: IEquipment) => {
    setIsDialogOpen(true)
    setSelectedEquipment(equipment)
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Equipments</h1>
          <p className="text-sm text-muted-foreground">Reserve Euipments</p>
        </div>
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
          {equipments.map((equipment) => (
            <div
              onClick={() => handleCardClick(equipment)}
              key={equipment.name}
            >
              <EquipmentCard equipment={equipment} />
            </div>
          ))}
        </div>
      )}

      {/* Reservation Form */}
      <Drawer
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{selectedEquipment?.name}</DrawerTitle>
              <DrawerDescription>Reserve Equipment</DrawerDescription>
            </DrawerHeader>

            <ReserveEquipmentForm
              ref={formRef}
              equipmentId={selectedEquipment?._id ?? ""}
              equipmentName={selectedEquipment?.name ?? ""}
              maxQuantity={selectedEquipment?.quantity ?? 0}
              onSuccess={() => setIsDialogOpen(false)}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
          <DrawerFooter>
            <Button onClick={() => formRef.current?.submit()}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
