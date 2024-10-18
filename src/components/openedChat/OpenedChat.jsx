import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";

import Chat from "./chat/Chat";
import Details from "./details/Details";

function OpenedChat() {
  // Setting the state for the current chat, and details section
  const [chat, setChat] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Getting the chat id from the store
  const { chatId } = useChatStore();

  // useEffect to set the current chat
  useEffect(() => {
    setIsLoading(true);
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
      setIsLoading(false);
    });

    // Cleanup function when component unmounts
    return () => {
      unSub();
    };
  }, [chatId]);

  return (
    <>
      <Chat chat={chat} setShowDetails={setShowDetails} isLoading={isLoading} />
      <Details
        chat={chat}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        // isLoading={isLoading}
      />
    </>
  );
}

export default OpenedChat;
