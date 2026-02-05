import { create } from "zustand";

type SidebarStateStoreType = {
  sidebarState: boolean;
  setSidebarSate: () => void;
};

const useSidebarStore = create<SidebarStateStoreType>((set) => ({
  sidebarState: false,
  setSidebarSate: () => set((state) => ({ sidebarState: !state.sidebarState })),
}));

export default useSidebarStore;
