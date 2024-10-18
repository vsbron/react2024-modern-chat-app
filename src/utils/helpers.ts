import { collection, getDocs, query, where } from "firebase/firestore";
import { format } from "timeago.js";

import { db } from "../lib/firebase";
import { CreatedAtType } from "../lib/types";

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

export const formatDate = (createdAt: CreatedAtType) => {
  // Check if it's a Firestore-like object or a Date
  if (createdAt instanceof Date) {
    return format(createdAt, "yyyy-MM-dd");
  } else {
    // Convert Firestore timestamp to Date
    const date = new Date(
      createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
    );
    return format(date, "yyyy-MM-dd");
  }
};
