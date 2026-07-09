import type { ColumnDef } from "@tanstack/react-table"
import type { IReservation } from "@/stores/useReservationsStore"
import { formatDate } from "@/utils/formatter"
import { Badge } from "@/components/ui/badge"
import type { ReservationStatus } from "@/stores/useReservationsStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const badgeVariantsMap = {
  pending: "default",
  approved: "success",
  rejected: "destructive",
  returned: "secondary",
  cancelled: "link",
} as const

interface ColumnProps {
  onClick: (action: ReservationStatus, item: IReservation) => void
}

export const columns = ({
  onClick,
}: ColumnProps): ColumnDef<IReservation>[] => [
  {
    accessorKey: "student.name",
    header: "Borrower",
  },
  {
    accessorKey: "equipment.name",
    header: "Equipment",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as ReservationStatus

      return (
        <Badge variant={badgeVariantsMap[status]}>{status.toUpperCase()}</Badge>
      )
    },
  },
  {
    accessorKey: "borrowDateTime",
    header: "Borrow Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: "quantityRequested",
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Manage</DropdownMenuLabel>

            <DropdownMenuItem onClick={() => onClick("approved", item)}>
              Approve
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onClick("rejected", item)}>
              Reject
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onClick("returned", item)}>
              Mark as Returned
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onClick("cancelled", item)}>
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
