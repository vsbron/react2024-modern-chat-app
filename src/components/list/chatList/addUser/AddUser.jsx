import { useEffect, useState } from "react";
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
import { useUserStore } from "../../../../lib/userStore";
import useCloseModal from "../../../../utils/useCloseModal";

import Avatar from "../../../../ui/avatar/Avatar";
import Button from "../../../../ui/button/Button";

import "./addUser.css";

function AddUser({ setAddMode }) {
  // Getting the current user from the store
  const { currentUser } = useUserStore();

  // Setting the state for the user and whether he's already added to chat list
  const [searchedUser, setSearchedUser] = useState(null);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);

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

  const checkIfUserIsAlreadyAdded = async () => {
    // Get the current user's chat list
    const userChatsDoc = await getDoc(doc(db, "userchats", currentUser.id));
    const userChats = userChatsDoc.data()?.chats || [];

    // Check if the searched user is already in the chat list
    const alreadyAdded = userChats.some(
      (chat) => chat.receiverId === searchedUser.id
    );

    // Update the state to reflect if the user is already added
    setIsAlreadyAdded(alreadyAdded);
  };

  // Search submit handle
  const handleSearch = async (e) => {
    // Prevent default behavior
    e.preventDefault();

    // Getting the form data and the username
    const formData = new FormData(e.target);
    const searchInput = formData.get("username");

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
        setSearchedUser(usernameSnapshot.docs[0].data());
      } else if (!emailSnapshot.empty) {
        setSearchedUser(emailSnapshot.docs[0].data());
      } else {
        setSearchedUser(null);
      }
    } catch (err) {
      console.error(err.message);
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
      await updateDoc(doc(userChatsRef, searchedUser.id), {
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
          receiverId: searchedUser.id,
          updatedAt: Date.now(),
        }),
      });

      setAddMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Returned JSX
  return (
    <div className="add-user">
      {/* Input field for searching users */}
      <form className="add-user__form" onSubmit={handleSearch}>
        <input type="text" placeholder="Username or email" name="username" />
        <Button padding="2rem">Search</Button>
      </form>

      {/* Found users list */}
      {searchedUser && (
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
      )}
    </div>
  );
}

export default AddUser;
