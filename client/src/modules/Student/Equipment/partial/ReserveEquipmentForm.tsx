import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import api from "@/services/api"
import { forwardRef, useImperativeHandle } from "react"
import LoadingOverlay from "@/components/loading/LoadingOverlay"

export interface ReserveEquipmentFormRef {
  submit: () => void
}

interface ReservationFormProps {
  equipmentId: string
  equipmentName: string
  maxQuantity: number
  onSuccess?: () => void
  onCancel?: () => void
}

interface FormErrors {
  quantityRequested?: string
  borrowDateTime?: string
  returnDateTime?: string
}

const ReserveEquipmentForm = forwardRef<
  ReserveEquipmentFormRef,
  ReservationFormProps
>(({ equipmentId, maxQuantity, onSuccess }, ref) => {
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }))

  const [quantityRequested, setQuantityRequested] = useState(1)
  const [borrowDate, setBorrowDate] = useState<Date | undefined>()
  const [borrowTime, setBorrowTime] = useState("08:00")
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [returnTime, setReturnTime] = useState("08:00")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number)
    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)
    return combined
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (quantityRequested < 1) {
      newErrors.quantityRequested = "Quantity must be at least 1"
    }
    if (quantityRequested > maxQuantity) {
      newErrors.quantityRequested = `Maximum quantity is ${maxQuantity}`
    }
    if (!borrowDate) {
      newErrors.borrowDateTime = "Borrow date is required"
    }
    if (!returnDate) {
      newErrors.returnDateTime = "Return date is required"
    }
    if (borrowDate && returnDate) {
      const borrow = combineDateAndTime(borrowDate, borrowTime)
      const returnD = combineDateAndTime(returnDate, returnTime)

      if (borrow < new Date()) {
        newErrors.borrowDateTime = "Borrow date cannot be in the past"
      }
      if (borrow >= returnD) {
        newErrors.returnDateTime = "Return date must be after borrow date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setServerError(null)
    if (!validate()) return

    const borrowDateTime = combineDateAndTime(borrowDate!, borrowTime)
    const returnDateTime = combineDateAndTime(returnDate!, returnTime)

    setLoading(true)
    try {
      //   const res = await fetch("/api/reservations", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       equipment: equipmentId,
      //       quantityRequested,
      //       borrowDateTime,
      //       returnDateTime,
      //       note,
      //     }),
      //   })

      const { data } = await api.post("/reservation", {
        equipment: equipmentId,
        quantityRequested,
        borrowDateTime,
        returnDateTime,
        note,
      })

      console.log(data)

      //   const data = await res.json()
      //   if (!res.ok) {
      //     setServerError(data.message || "Something went wrong")
      //     return
      //   }

      onSuccess?.()
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative space-y-4 p-4">
      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      {loading && <LoadingOverlay message="Submmiting..." />}
      {/* Quantity */}
      <div className="space-y-1">
        <Label>Quantity</Label>
        <Input
          type="number"
          min={1}
          max={maxQuantity}
          value={quantityRequested}
          onChange={(e) => setQuantityRequested(Number(e.target.value))}
        />
        {errors.quantityRequested && (
          <p className="text-xs text-destructive">{errors.quantityRequested}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {maxQuantity} unit(s) available
        </p>
      </div>

      {/* Borrow Date & Time */}
      <div className="space-y-1">
        <Label>Borrow Date & Time</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !borrowDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {borrowDate
                  ? format(borrowDate, "MMM dd, yyyy")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={borrowDate}
                onSelect={setBorrowDate}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={borrowTime}
            onChange={(e) => setBorrowTime(e.target.value)}
            className="w-32"
          />
        </div>
        {errors.borrowDateTime && (
          <p className="text-xs text-destructive">{errors.borrowDateTime}</p>
        )}
      </div>

      {/* Return Date & Time */}
      <div className="space-y-1">
        <Label>Return Date & Time</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {returnDate
                  ? format(returnDate, "MMM dd, yyyy")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                disabled={{ before: borrowDate ?? new Date() }}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="w-32"
          />
        </div>
        {errors.returnDateTime && (
          <p className="text-xs text-destructive">{errors.returnDateTime}</p>
        )}
      </div>

      {/* Note */}
      <div className="space-y-1">
        <Label>
          Note <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          placeholder="Any additional notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      {/* Actions */}
      {/* <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit} disabled={loading} className="flex-1">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Reservation
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div> */}
    </div>
  )
})

export default ReserveEquipmentForm
