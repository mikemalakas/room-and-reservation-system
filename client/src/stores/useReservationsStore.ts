import { create } from "zustand"
import api from "@/services/api"

export type ReservationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "returned"
  | "cancelled"

export type ReservationType = "equipment" | "room"

export interface IReservation {
  _id: string
  type: ReservationType
  student: {
    _id: string
    name: string
    email: string
  }
  faculty: {
    _id: string
    name: string
    email: string
  }
  equipment?: {
    _id: string
    name: string
    quantity: number
    image: {
      url: string
      publicId: string
    }
  }
  room?: {
    _id: string
    name: string
  }
  quantityRequested?: number
  borrowDateTime: string
  returnDateTime: string
  status: ReservationStatus
  note: string
  rejectedReason: string
  createdAt: string
  updatedAt: string
}

export interface CreateReservationData {
  type: ReservationType
  equipment?: string
  room?: string
  quantityRequested?: number
  borrowDateTime: string
  returnDateTime: string
  note?: string
}

interface ReservationStore {
  reservations: IReservation[]
  loading: boolean
  error: string | null
  fetchReservations: () => Promise<void>
  createReservation: (data: CreateReservationData) => Promise<void>
  approveReservation: (id: string) => Promise<void>
  rejectReservation: (id: string, rejectedReason: string) => Promise<void>
  returnReservation: (id: string) => Promise<void>
  cancelReservation: (id: string) => Promise<void>
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  loading: false,
  error: null,

  fetchReservations: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/reservation")
      set({ reservations: res.data.data })
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to fetch reservations",
      })
    } finally {
      set({ loading: false })
    }
  },

  createReservation: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post("/reservations", data)
      set((state) => ({
        reservations: [res.data.data, ...state.reservations],
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to create reservation",
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  approveReservation: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await api.patch(`/reservation/${id}/approve`)
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id ? res.data.data : r
        ),
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to approve reservation",
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  rejectReservation: async (id, rejectedReason) => {
    set({ loading: true, error: null })
    try {
      const res = await api.patch(`/reservations/${id}/reject`, {
        rejectedReason,
      })
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id ? res.data.data : r
        ),
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to reject reservation",
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  returnReservation: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await api.patch(`/reservations/${id}/return`)
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id ? res.data.data : r
        ),
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to mark as returned",
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  cancelReservation: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await api.patch(`/reservations/${id}/cancel`)
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id ? res.data.data : r
        ),
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to cancel reservation",
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },
}))
