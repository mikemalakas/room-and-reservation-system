import {
  useReservationStore,
  type IReservation,
  type ReservationStatus,
} from "@/stores/useReservationsStore"
import { columns } from "./resource/reservationResource.tsx"
import ReservationsTable from "@/components/table/ReservationsTable"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import ConfirmDialog from "@/components/dialog/ConfirmDialog"

export default function Index() {
  const { reservations, loading, approveReservation } = useReservationStore()
  const [dialog, setDialog] = useState<{
    open: boolean
    action?: ReservationStatus
    reservation?: IReservation
  }>({
    open: false,
  })

  const handleAction = (
    action: ReservationStatus,
    reservation: IReservation
  ) => {
    setDialog({
      open: true,
      action,
      reservation,
    })
  }

  return (
    <>
      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Reservations</h1>
              <p className="text-sm text-muted-foreground">
                Manage all reservations
              </p>
            </div>
          </div>
          <div>
            <ReservationsTable
              columns={columns({ onClick: handleAction })}
              data={reservations}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        title={`${dialog.action} Reservation`}
        description={`Are you sure you want to ${dialog.action} this reservation?`}
        confirmText={dialog.action}
        onConfirm={async () => {
          switch (dialog.action) {
            case "approved":
              await approveReservation(dialog.reservation!._id)
              setDialog((d) => ({ ...d, open: false }))
              break

            case "rejected":
              // await rejectReservation(dialog.reservation!.id);
              break

            case "returned":
              // await markAsReturned(dialog.reservation!.id);
              break

            case "cancelled":
              // await cancelReservation(dialog.reservation!.id);
              break
          }
        }}
      />
    </>
  )
}
