import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";

import AddUser from "./addUser/AddUser";
import Avatar from "../../../ui/avatar/Avatar";

import "./chatList.css";

function ChatList() {
  // State for adding user mode and the chats list
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);

  // Getting the current user data from the store
  const { currentUser } = useUserStore();

  // Getting the block/unblock function from the store
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    // Getting the chats data from the user id in the real time
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      // Getting the chats data
      async (res) => {
        const items = res.data().chats;

        // From each chat we also need to get the user id using receiverID
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          // Setting all the user info inside the user const
          const user = userDocSnap.data();

          // Returning the new object with all the chat data plus the user object
          return { ...item, user };
        });

        // Getting all the data form all the promises
        const chatData = await Promise.all(promises);

        // Setting the chatData state while also sorting it by date
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    // Cleanup function when component unmounts
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    // Calling the change chat function
    changeChat(chat.chatId, chat.user);
  };

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
          chats.map((chat) => {
            console.log(chat);
            return (
              <div
                className="item"
                key={chat.id}
                onClick={() => handleSelect(chat)}
              >
                <Avatar src={chat.user.avatar} size="5rem" />
                <div className="item__texts">
                  <span>{chat.user.username}</span>
                  {chat.lastMessage && <p>{chat.lastMessage}</p>}
                </div>
              </div>
            );
          })}
      </div>
      {/* Conditional add user modal window */}
      {addMode && <AddUser setAddMode={setAddMode} />}
    </>
  );
}

export default ChatList;
