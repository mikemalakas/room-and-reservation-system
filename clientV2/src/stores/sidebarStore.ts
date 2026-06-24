import { create } from "zustand";

type SidebarStore = {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  open: true,

  toggle: () =>
    set((state) => ({
      open: !state.open,
    })),

  setOpen: (open) =>
    set({
      open,
    }),
}));
