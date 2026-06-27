import { create } from "zustand"
import api from "@/services/api"

export interface IEquipment {
  _id: string
  name: string
  description: string
  isAvailable: boolean
  quantity: number
  image: {
    url: string
    publicId: string
  }
  createdBy: {
    user: {
      _id: string
      name: string
      email: string
    }
    role: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateEquipmentData {
  name: string
  description: string
  image?: File | null
  quantity: number
}

interface UpdateEquipmentData {
  name?: string
  description?: string
  isAvailable?: boolean
  image?: File
  quantity?: number
}

interface EquipmentStore {
  equipments: IEquipment[]
  loading: boolean
  error: string | null
  fetchEquipment: () => Promise<void>
  createEquipment: (data: CreateEquipmentData) => Promise<void>
  updateEquipment: (id: string, data: UpdateEquipmentData) => Promise<void>
  deleteEquipment: (id: string) => Promise<void>
}

export const useEquipmentStore = create<EquipmentStore>((set) => ({
  equipments: [],
  loading: false,
  error: null,

  fetchEquipment: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/equipments")
      set({ equipments: res.data.data })
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to fetch equipment" })
    } finally {
      set({ loading: false })
    }
  },

  createEquipment: async (data) => {
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description)
      if (data.image) formData.append("image", data.image)
      formData.append("quantity", String(data.quantity))

      const res = await api.post("/equipments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      set((state) => ({ equipments: [res.data.data, ...state.equipments] }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to create equipment",
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  updateEquipment: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      if (data.name) formData.append("name", data.name)
      if (data.description) formData.append("description", data.description)
      if (data.isAvailable !== undefined)
        formData.append("isAvailable", String(data.isAvailable))
      if (data.image) formData.append("image", data.image)
      if (data.quantity) formData.append("quantity", String(data.quantity))

      const res = await api.put(`/equipments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      set((state) => ({
        equipments: state.equipments.map((e) =>
          e._id === id ? res.data.data : e
        ),
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to update equipment",
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  deleteEquipment: async (id) => {
    try {
      await api.delete(`/equipments/${id}`)
      set((state) => ({
        equipments: state.equipments.filter((e) => e._id !== id),
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to delete equipment",
      })
      throw err
    }
  },
}))
