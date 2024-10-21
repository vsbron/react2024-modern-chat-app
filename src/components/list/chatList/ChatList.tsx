import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { useChatStore } from "../../../lib/chatStore";
import { db } from "../../../lib/firebase";
import { ChatObject, ChatType } from "../../../lib/types";
import { useUserStore } from "../../../lib/userStore";

import AddUser from "./addUser/AddUser";
import Avatar from "../../../ui/avatar/Avatar";

import "./chatList.css";

function ChatList() {
  // State for adding user mode, the chats list, search input and loading state
  const [addMode, setAddMode] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatObject[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  // Getting the current user data from the store
  const { currentUser } = useUserStore();

  // Getting the chat ID and change chat function from the store
  const { chatId, changeChat } = useChatStore();

  if (currentUser === null)
    return toast.error("Couldn't get the user data. Please sign in again");

  useEffect(() => {
    // Getting the chats data from the user id in the real time
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        // Getting the data from the query response
        const resData = res.data();

        // Guard clause
        if (resData === undefined) return setChats([]);

        // Getting the chats data
        const items = resData.chats;

        // From each chat we also need to get the user id using receiverID
        const promises = items.map(async (item: ChatType) => {
          // Guard clause
          if (!item.receiverId)
            return toast.error("Couldn't get the User data. Please try again");

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
  const filteredChats = chats.filter((c: ChatObject) =>
    c.user.username.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Select chat handler
  const handleSelect = async (chat: ChatObject) => {
    // Getting the chat lists minus user data
    const userChats = chats.map((item: ChatObject) => {
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
      changeChat({ chatId: chat.chatId, userInfo: chat.user });
    } catch (e: unknown) {
      toast.error("Couldn't open the chat. Please try again");
      console.error(e instanceof Error ? e.message : e);
    }
  };

  // Returned JSX
  return (
    <>
      <div className="chat-list">
        {/* Search bar */}
        <div className="search">
          <div className="search__bar">
            <img
              src="/search.svg"
              className="search__icon"
              alt="Search users"
            />
            <input
              type="text"
              className="search__input"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <img
            src={addMode ? "./minus.svg" : "./plus.svg"}
            className="search__add"
            onClick={() => setAddMode((mode) => !mode)}
            alt="Add user"
            title="Open user search"
          />
        </div>

        {/* List of chats */}
        {filteredChats.length > 0 &&
          filteredChats.map((chat: ChatObject, i: number) => (
            <div
              className="item"
              key={i}
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor:
                  chat.chatId === chatId
                    ? "var(--color-chat-active)"
                    : chat.user.blocked.includes(currentUser.id)
                    ? "var(--color-chat-blocked)"
                    : !chat.isSeen
                    ? "var(--color-chat-unread)"
                    : "",
              }}
            >
              <Avatar
                src={chat.user.avatar}
                size="5rem"
                altTitle={chat.user.username}
              />
              <div className="item__texts">
                <span>{chat.user.username}</span>
                {chat.lastMessage && (
                  <p>
                    {chat.lastMessage.split(" ").length > 9
                      ? chat.lastMessage.split(" ").slice(0, 9).join(" ") +
                        "..."
                      : chat.lastMessage}
                  </p>
                )}
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
