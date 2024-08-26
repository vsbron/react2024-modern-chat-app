import { useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
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

  // Setting the state for the user
  const [searchedUser, setSearchedUser] = useState(null);

  // Custom hook that adds the click handlers that will close the Add User module
  useCloseModal({
    setter: setAddMode,
    triggerClass: "search__add",
    modalClass: "add-user",
  });

  // Search submit handle
  const handleSearch = async (e) => {
    // Prevent default behavior
    e.preventDefault();

    // Getting the form data and the username
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users"); // Getting the users from database
      const q = query(userRef, where("username", "==", username)); // Query for the username search
      const querySnapshot = await getDocs(q); // Searching for the username that we entered

      // If found user, set the state with user data
      if (!querySnapshot.empty) {
        setSearchedUser(querySnapshot.docs[0].data());
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
    } catch (err) {
      console.error(err);
    }
  };

  // Returned JSX
  return (
    <div className="add-user">
      {/* Input field for searching users */}
      <form className="add-user__form" onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <Button padding="2rem">Search</Button>
      </form>

      {/* Found users list */}
      {searchedUser && (
        <div className="add-user__user">
          <div className="add-user__user-details">
            <Avatar src={searchedUser.avatar} size="5rem" />
            <span className="add-user__user-name">{searchedUser.username}</span>
          </div>
          <Button padding="1rem" onClick={handleAddUser}>
            Add user
          </Button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
