import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";

import Chat from "./chat/Chat";
import Details from "./details/Details";

function OpenedChat() {
  // Setting the state for the current chat
  const [chat, setChat] = useState("");

  // Getting the chat id from the store
  const { chatId } = useChatStore();

  // useEffect to set the current chat
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) =>
      setChat(res.data())
    );

    // Cleanup function when component unmounts
    return () => {
      unSub();
    };
  }, [chatId]);

  return (
    <>
      <Chat chat={chat} />
      <Details chat={chat} />
    </>
  );
}

export default OpenedChat;
