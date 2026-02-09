import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";

import { db } from "./firebase";
import { UpdatedDataType, User, UserStoreState } from "./types";
import { toast } from "react-toastify";

export const useUserStore = create<UserStoreState>((set) => ({
  currentUser: null,
  isLoading: true,

  // Get user data
  fetchUserInfo: async (uid: string) => {
    // Guard clause
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid); // Get the reference to the table
      const docSnap = await getDoc(docRef); // Try to get the user data
      const data = docSnap.data();
      // Set user if user data is found, set null if not found
      set({
        currentUser: docSnap.exists() && data ? (data as User) : null,
        isLoading: false,
      });
    } catch (e: unknown) {
      toast.error("Couldn't get the User Data due to unknown error");
      console.error(e instanceof Error ? e.message : e);
      return set({ currentUser: null, isLoading: false }); // Set user to null on error
    }
  },

  // Update user data
  updateUserInfo: async (uid: string, updatedData: UpdatedDataType) => {
    try {
      // Getting the reference to the database table
      const docRef = doc(db, "users", uid);

      // Merge new data with the existing one
      await setDoc(docRef, updatedData, { merge: true });

      // Update the local state with new data
      set((state) => ({
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              ...updatedData,
            }
          : null,
      }));
    } catch (e: unknown) {
      throw new Error("Failed to update user");
    }
  },

  // Clear user data
  clearUserInfo: async () => {
    try {
      set({ currentUser: null, isLoading: false });
    } catch (e: unknown) {
      toast.error("Couldn't clear the user data");
      console.error(e instanceof Error ? e.message : e);
      return set({ currentUser: null, isLoading: false }); // Set user to null on error
    }
  },
}));
