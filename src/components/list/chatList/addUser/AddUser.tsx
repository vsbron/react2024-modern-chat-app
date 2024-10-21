import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../../../lib/firebase";
import { AddUserProps, ChatType, User } from "../../../../lib/types";
import { useUserStore } from "../../../../lib/userStore";
import useCloseModal from "../../../../utils/useCloseModal";

import Avatar from "../../../../ui/avatar/Avatar";
import Button from "../../../../ui/button/Button";
import LoaderSmall from "../../../../ui/loader/LoaderSmall";

import "./addUser.css";

function AddUser({ setAddMode }: AddUserProps) {
  // Getting the current user from the store
  const { currentUser } = useUserStore();

  // Setting the state for the user, whether he's already added to chat list, input field and a loading state
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Custom hook that adds the click handlers that will close the Add User module
  useCloseModal({
    setter: setAddMode,
    triggerClass: "search__add",
    modalClass: "add-user",
  });

  // Use effect that check every found user whether he exists in the chat list already
  useEffect(() => {
    if (searchedUser) {
      checkIfUserIsAlreadyAdded();
    }
  }, [searchedUser]);

  if (!currentUser)
    return toast.warn("Couldn't get the user data. Please sign in again");

  const checkIfUserIsAlreadyAdded = async () => {
    // Get the current user's chat list
    const userChatsDoc = await getDoc(doc(db, "userchats", currentUser.id));
    const userChats = userChatsDoc.data()?.chats || [];

    // Check if the searched user is already in the chat list or is it the your user
    const alreadyAdded =
      searchedUser?.id === currentUser.id ||
      userChats.some((chat: ChatType) => chat.receiverId === searchedUser?.id);

    // Update the state to reflect if the user is already added
    setIsAlreadyAdded(alreadyAdded);
  };

  // Search submit handle
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default behavior
    e.preventDefault();

    // Enabling loading state
    setIsLoading(true);

    // Getting the form data and the username
    const formData = new FormData(e.currentTarget);
    const searchInput = formData.get("username");

    // Update search input state
    setSearchInput((searchInput as string) || "");

    try {
      const userRef = collection(db, "users"); // Getting the users from database

      // Queries to search by username or email
      const usernameQuery = query(
        userRef,
        where("username", "==", searchInput)
      );
      const emailQuery = query(userRef, where("email", "==", searchInput));

      // Execute both queries
      const usernameSnapshot = await getDocs(usernameQuery);
      const emailSnapshot = await getDocs(emailQuery);

      // If a user is found by username or email, set the state with user data
      if (!usernameSnapshot.empty) {
        setSearchedUser(usernameSnapshot.docs[0].data() as User);
      } else if (!emailSnapshot.empty) {
        setSearchedUser(emailSnapshot.docs[0].data() as User);
      } else {
        setSearchedUser(null);
      }
    } catch (e: unknown) {
      toast.warn("Couldn't find user due to unknown error");
      console.error(e instanceof Error ? e.message : e);
    } finally {
      // Disabling loading state
      setIsLoading(false);
    }
  };

  // Add user handler
  const handleAddUser = async () => {
    // Getting the reference to the database tables
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      // Creating the new chat reference
      const newChatRef = doc(chatRef);

      // Setting the new chat with the needed chat details
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Adding the chat to our chat list
      await updateDoc(doc(userChatsRef, searchedUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      // Adding the chat to the searched user chat list
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: searchedUser?.id,
          updatedAt: Date.now(),
        }),
      });

      setAddMode(false);
    } catch (e: unknown) {
      toast.error("Couldn't create a chat with the user. Please try again");
      console.error(e instanceof Error ? e.message : e);
    }
  };

  // Returned JSX (using create portal for exiting the relative parent)
  return createPortal(
    <div className="add-user">
      {/* Input field for searching users */}
      <form className="add-user__form" onSubmit={handleSearch}>
        <input type="text" placeholder="Username or email" name="username" />
        <Button padding="2rem">Search</Button>
      </form>

      {/* Found users list */}
      {searchedUser ? (
        <div className="add-user__user">
          <div
            className={`add-user__user-details ${
              isAlreadyAdded && "add-user__user-added"
            }`}
          >
            <Avatar
              src={searchedUser.avatar}
              altTitle={searchedUser.username}
              size="5rem"
            />
            <div className="add-user__user-name">
              <span>{searchedUser.username}</span>
              <span>{searchedUser.email}</span>
            </div>
          </div>
          <Button
            padding="1rem"
            onClick={handleAddUser}
            disabled={isAlreadyAdded}
          >
            {!isAlreadyAdded ? "Add user" : "Added"}
          </Button>
        </div>
      ) : (
        searchInput && (
          <div className="add-user__not-found">
            {isLoading ? (
              <LoaderSmall />
            ) : (
              "Sorry, no user was found. Please try again..."
            )}
          </div>
        )
      )}
    </div>,
    document.body
  );
}

export default AddUser;
