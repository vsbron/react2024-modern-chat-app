import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";

import AddUser from "./addUser/AddUser";
import Avatar from "../../../ui/avatar/Avatar";

import "./chatList.css";

function ChatList() {
  // State for adding user mode, the chats list and search input
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchInput, setSearchInput] = useState("");

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

  // Creating a filtered chat list based on the search input
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Select chat handler
  const handleSelect = async (chat) => {
    // Getting the chat lists minus user data
    const userChats = chats.map((item) => {
      // eslint-disable-next-line no-unused-vars
      const { user, ...rest } = item;
      return rest;
    });

    // Searching for a chat we want to open
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    // Setting the last message to "seen" if it wasn't
    userChats[chatIndex].isSeen = true;

    // Getting the reference to the user's chats
    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      // Updating the document in the database
      await updateDoc(userChatsRef, {
        chats: userChats,
      });

      // Calling the change chat function to display a chat
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Returned JSX
  return (
    <>
      <div className="chat-list">
        {/* Search bar */}
        <div className="search">
          <div className="search__bar">
            <img src="/search.png" className="search__icon" alt="" />
            <input
              type="text"
              className="search__input"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
          </div>
          <img
            src={addMode ? "./minus.png" : "./plus.png"}
            className="search__add"
            onClick={() => setAddMode((mode) => !mode)}
            alt=""
          />
        </div>

        {/* List of chats */}
        {filteredChats.length > 0 &&
          filteredChats.map((chat) => (
            <div
              className="item"
              key={chatId}
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <Avatar
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? "./avatar.png"
                    : chat?.user?.avatar
                }
                size="5rem"
              />
              <div className="item__texts">
                <span>
                  {chat.user.blocked.includes(currentUser.id)
                    ? "User"
                    : chat.user.username}
                </span>
                {chat.lastMessage && <p>{chat.lastMessage}</p>}
              </div>
            </div>
          ))}
      </div>
      {/* Conditional add user modal window */}
      {addMode && <AddUser setAddMode={setAddMode} />}
    </>
  );
}

export default ChatList;
