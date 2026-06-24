import { create } from "zustand"
import api from "@/services/api"

export interface IUser {
  _id: string
  name: string
  email: string
  role: number
  password?: string
  faculty_id?: {
    _id: string
    name: string
    email: string
  } | null
  createdAt: string
}

interface CreateUserData {
  name: string
  email: string
  password: string
  role: number
}

interface UserStore {
  users: IUser[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  deleteUser: (id: string) => Promise<void>
  createUser: (user: CreateUserData) => Promise<void>
  addUser: (user: IUser) => void
  updateUser: (user: IUser) => void
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get("/users")
      set({ users: res.data.data })
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to fetch users" })
    } finally {
      set({ loading: false })
    }
  },

  deleteUser: async (id: string) => {
    try {
      await api.delete(`/users/${id}`)
      set((state) => ({ users: state.users.filter((u) => u._id !== id) }))
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to delete user" })
    }
  },

  // in useUserStore
  createUser: async (data: CreateUserData) => {
    const res = await api.post("/users", data)
    set((state) => ({ users: [...state.users, res.data.data] }))
  },

  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u._id === user._id ? user : u)),
    })),
}))
