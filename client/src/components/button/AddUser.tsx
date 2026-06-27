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
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react"
import { useUserStore } from "@/stores/useUserStore"
import { ROLES } from "@/types/roles"

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const defaultForm: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export default function AddUser() {
  const { createUser } = useUserStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const validate = () => {
    if (!form.name.trim()) return "Name is required"
    if (!form.email.trim()) return "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Please provide a valid email"
    if (!form.password) return "Password is required"
    if (form.password.length < 6)
      return "Password must be at least 6 characters"
    if (form.password !== form.confirmPassword) return "Passwords do not match"
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
      createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: ROLES.FACULTY,
      })
      setForm(defaultForm)
      setOpen(false)
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      setForm(defaultForm)
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Faculty Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Juan dela Cruz"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="juan@school.edu.ph"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
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
              Create Faculty
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
