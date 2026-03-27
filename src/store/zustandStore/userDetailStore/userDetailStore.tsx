import { UserDetailsType } from "@/services/models";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserDetailsStoreType = {
  userDetails: UserDetailsType;
  isInitialized: boolean;
  setUserDetails: (value: UserDetailsType) => void;
  clearUserDetails: () => void;
};

const userDetailsStore = create<UserDetailsStoreType>()(
  persist(
    (set) => ({
      userDetails: {} as UserDetailsType,
      isInitialized: false,
      setUserDetails: (value: UserDetailsType) =>
        set({ userDetails: value, isInitialized: true }),
      clearUserDetails: () =>
        set({ userDetails: {} as UserDetailsType, isInitialized: false }),
    }),
    {
      name: "user-details-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default userDetailsStore;
