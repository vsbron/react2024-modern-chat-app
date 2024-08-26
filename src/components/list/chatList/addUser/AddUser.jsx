import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../../../lib/firebase";
import useCloseModal from "../../../../utils/useCloseModal";

import Avatar from "../../../../ui/avatar/Avatar";
import Button from "../../../../ui/button/Button";

import "./addUser.css";

function AddUser({ setAddMode }) {
  // Setting the state for the user
  const [user, setUser] = useState(null);

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
        setUser(querySnapshot.docs[0].data());
      }
    } catch (err) {
      console.error(err.message);
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
      {user && (
        <div className="add-user__user">
          <div className="add-user__user-details">
            <Avatar src={user.avatar} size="5rem" />
            <span className="add-user__user-name">{user.username}</span>
          </div>
          <Button padding="1rem">Add user</Button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
