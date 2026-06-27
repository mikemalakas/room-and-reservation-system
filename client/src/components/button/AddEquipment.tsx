import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Loader2, ImagePlus } from "lucide-react"
import { useEquipmentStore } from "@/stores/useEquipmentStore"
import type { CreateEquipmentData } from "@/stores/useEquipmentStore"

const defaultForm: CreateEquipmentData = {
  name: "",
  description: "",
  image: null,
  quantity: 0,
}

export default function AddEquipment() {
  const { createEquipment } = useEquipmentStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateEquipmentData>(defaultForm)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((prev) => ({ ...prev, image: file }))
    setPreview(URL.createObjectURL(file))
    setError(null)
  }

  const validate = () => {
    if (!form.name.trim()) return "Name is required"
    if (!form.description.trim()) return "Description is required"
    if (!form.image) return "Please upload an image"
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createEquipment({
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image!,
        quantity: form.quantity,
      })
      handleOpenChange(false)
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to create equipment")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      setForm(defaultForm)
      setPreview(null)
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Equipment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. HDMI Projector"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the equipment..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              placeholder="Enter quantity"
              onChange={handleChange}
              value={form.quantity}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label>Image</Label>
            <label
              htmlFor="image"
              className="flex h-36 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition hover:bg-muted/50"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm">Click to upload image</span>
                  <span className="text-xs">JPG, PNG, WEBP</span>
                </div>
              )}
            </label>
            <input
              id="image"
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Equipment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
