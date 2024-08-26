import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";

import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    // Guard clause
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid); // Get the reference to the table
      const docSnap = await getDoc(docRef); // Try to get the user data

      // Set user if user data is found, set null if not found
      set({
        currentUser: docSnap.exists() ? docSnap.data() : null,
        isLoading: false,
      });
    } catch (err) {
      console.error(err.message);
      return set({ currentUser: null, isLoading: false }); // Set user to null on error
    }
  },
}));
