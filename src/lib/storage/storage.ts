import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StateStorage } from "zustand/middleware";

/**
 * Zustand persist adapter. Backed by AsyncStorage today so the app runs
 * unmodified in Expo Go. To swap in react-native-mmkv for faster sync
 * reads, implement this same StateStorage interface over an MMKV instance
 * and swap the import in each store — no other code depends on AsyncStorage
 * directly.
 */
export const appStorage: StateStorage = {
  getItem: async (name) => {
    return AsyncStorage.getItem(name);
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};
