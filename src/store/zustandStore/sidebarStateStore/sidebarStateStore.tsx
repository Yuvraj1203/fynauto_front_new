import { create } from "zustand";

type SidebarStateStoreType = {
  sidebarState: boolean;
  setSidebarSate: (value: boolean) => void;
};

const useSidebarStateStore = create<SidebarStateStoreType>((set) => ({
  sidebarState: false,
  setSidebarSate: (value) => set((state) => ({ sidebarState: value })),
}));

export default useSidebarStateStore;
