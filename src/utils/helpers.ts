import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

// Helper function that validates the email address
export const isValidEmail = (email: string) => {
  // Regular expression for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isUsernameUnique = async (username: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  // Returns true if username is unique, false otherwise
  return querySnapshot.empty;
};

export const isEmailUnique = async (email: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  // Returns true if username is unique, false otherwise
  return querySnapshot.empty;
};
