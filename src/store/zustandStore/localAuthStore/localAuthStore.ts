import { CookiesType } from "@/services/types";
import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LocalAuthStoreType = {
  localAuthenticationState: boolean;
  setLocalAuthenticationState: (value: boolean) => void;
  clearLocalAuthenticationState: () => void;
};

const useLocalAuthStore = create<LocalAuthStoreType>()(
  persist(
    (set) => ({
      localAuthenticationState: false, // initial value

      setLocalAuthenticationState: (value) =>
        set(() => ({
          localAuthenticationState: value,
        })),

      clearLocalAuthenticationState: () =>
        set(() => ({
          localAuthenticationState: false,
        })),
    }),
    {
      name: CookiesType.localAuth,

      storage: createJSONStorage(() => ({
        getItem: (key) => {
          const cookie = Cookies.get(key);
          return cookie ? JSON.parse(cookie) : null;
        },
        setItem: (key, value) => {
          Cookies.set(key, JSON.stringify(value), {
            expires: 30, // 30 days
            sameSite: "strict",
          });
        },
        removeItem: (key) => {
          Cookies.remove(key);
        },
      })),
    }
  )
);

export default useLocalAuthStore;
