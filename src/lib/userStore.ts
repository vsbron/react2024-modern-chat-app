import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";

import { db } from "./firebase";
import { User, UserStoreState } from "./types";

export const useUserStore = create<UserStoreState>((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
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
    } catch (e) {
      console.error(
        e instanceof Error
          ? e.message
          : "Couldn't get the User Data due to unknown error"
      );
      return set({ currentUser: null, isLoading: false }); // Set user to null on error
    }
  },
  updateUserInfo: async (uid, updatedData) => {
    try {
      // Getting the reference to the database table
      const docRef = doc(db, "users", uid);

      // Merge new data with the existing one
      await setDoc(docRef, updatedData, { merge: true });

      // Update the local state with new data
      set((state: any) => ({
        currentUser: { ...state.currentUser, ...updatedData },
      }));
    } catch (err) {
      throw new Error("Failed to update user");
    }
  },
}));
