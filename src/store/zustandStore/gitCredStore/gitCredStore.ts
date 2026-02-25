import { CookiesType } from "@/services/types";
import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type GitCredStoreType = {
  gitCred: string;
  gitCredExpiry: number; //give days
  setGitCred: (value: string, expiry: number) => void;

  azureBearer: string;
  azureBearerExpiry: number; //give days
  setAzureBearer: (value: string, expiry: number) => void;
};

const useGitCredStore = create<GitCredStoreType>()(
  persist(
    (set) => ({
      gitCred: "",
      gitCredExpiry: Date.now(),
      setGitCred: (value, expiry) =>
        set(() => ({
          gitCred: value,
          gitCredExpiry: Date.now() + expiry * 24 * 60 * 60 * 1000,
        })),

      azureBearer: "",
      azureBearerExpiry: Date.now(),
      setAzureBearer: (value, expiry) =>
        set(() => ({
          azureBearer: value,
          azureBearerExpiry: Date.now() + expiry * 24 * 60 * 60 * 1000,
        })),
    }),
    {
      name: CookiesType.gitCred,

      storage: createJSONStorage(() => ({
        getItem: (key) => {
          const cookie = Cookies.get(key);
          return cookie ? JSON.parse(cookie) : null;
        },
        setItem: (key, value) => {
          Cookies.set(key, JSON.stringify(value), {
            expires: 14, // 14 days
            sameSite: "strict",
          });
        },
        removeItem: (key) => {
          Cookies.remove(key);
        },
      })),
    },
  ),
);

export default useGitCredStore;
