import { useEffect, useState } from "react";

import AddUser from "./addUser/AddUser";

import Avatar from "../../../ui/avatar/Avatar";

import "./chatList.css";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";

function ChatList() {
  // State for adding user mode and the chats list
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);

  // Getting the current user data from the store
  const { currentUser } = useUserStore();

  useEffect(() => {
    // Getting the chats data from the user id in the real time
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), (doc) => {
      setChats(doc.data()); // Setting the chats state
    });

    // Cleanup function when component unmounts
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  // Returned JSX
  return (
    <>
      <div className="chat-list">
        {/* Search bar */}
        <div className="search">
          <div className="search__bar">
            <img src="/search.png" className="search__icon" alt="" />
            <input type="text" className="search__input" placeholder="Search" />
          </div>
          <img
            src={addMode ? "./minus.png" : "./plus.png"}
            className="search__add"
            onClick={() => setAddMode((mode) => !mode)}
            alt=""
          />
        </div>

        {/* List of chats */}
        {chats.length > 0 &&
          chats.map((chat, i) => {
            <div className="item" key={i}>
              <Avatar size="5rem" />
              <div className="item__texts">
                <span>Jane Doe</span>
                <p>Hello</p>
              </div>
            </div>;
          })}
      </div>
      {/* Conditional add user modal window */}
      {addMode && <AddUser setAddMode={setAddMode} />}
    </>
  );
}

export default ChatList;
