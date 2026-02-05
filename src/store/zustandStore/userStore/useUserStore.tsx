import { UserType } from "@/services/models";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStoreType = {
  user: UserType;
  setUser: (value: UserType) => void;
};

const useUserStore = create<UserStoreType>()(
  persist(
    (set) => ({
      user: {},
      setUser: (value: UserType) => set({ user: value }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useUserStore;
