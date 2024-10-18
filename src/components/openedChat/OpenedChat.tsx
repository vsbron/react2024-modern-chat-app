import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";

import Chat from "./chat/Chat";
import Details from "./details/Details";
import { ChatType } from "../../lib/types";

function OpenedChat() {
  // Setting the state for the current chat, and details section
  const [chat, setChat] = useState<ChatType | string>("");
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Getting the chat id from the store
  const { chatId } = useChatStore();

  // useEffect to set the current chat
  useEffect(() => {
    setIsLoading(true);
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      console.log(res.data());
      setChat(res.data() as ChatType);
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
        key={chatId}
        chat={chat}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />
    </>
  );
}

export default OpenedChat;
