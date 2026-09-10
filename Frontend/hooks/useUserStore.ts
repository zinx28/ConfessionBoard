import { useEffect, useState, useSyncExternalStore } from "react";
import userStore from "../lib/userStore";

export const useUserStore = () => {
  const user = useSyncExternalStore(
    userStore.subscribe.bind(userStore),
    () => userStore.getState("user"),
    () => null
  )

  const isAuthenticated = useSyncExternalStore(
    userStore.subscribe.bind(userStore),
    () => userStore.getState("isAuthenticated"),
    () => false
  )

  return {
    user,
    isAuthenticated,
    login: (userData: any) => {
      userStore.dispatch("setUser", userData);
    },
    logout: () => userStore.dispatch("logout"),
  };
};