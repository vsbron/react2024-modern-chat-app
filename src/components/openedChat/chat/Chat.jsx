import { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import upload from "../../../lib/upload";

import EmojiModal from "./emojiModal/EmojiModal";
import Avatar from "../../../ui/avatar/Avatar";
import Button from "../../../ui/button/Button";

import "./chat.css";

function Chat({ chat }) {
  // State for Emoji Picker module, Input text and uploaded image
  const [openEmoji, setOpenEmoji] = useState(false);
  const [inputText, setInputText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  // Getting the current user, other user and chat id variables from the store
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, resetChat } =
    useChatStore();

  // / Reference for the end of the chat
  const endRef = useRef(null);

  // useEffect to focus on the end of the chat
  useEffect(() => {
    endRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  // Click handler to open emoji window
  const handleClick = () => {
    setOpenEmoji((open) => !open);
  };

  // Sending message handler
  const handleSendMessage = async () => {
    // Guard clause
    if (inputText === "" && !img) return;

    // Create a imgUrl variable
    let imgUrl = null;

    try {
      // If file provided - upload it
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      // Add the sent message to the messages array in the database
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: inputText,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      // Create an array of both IDs to loop through them
      const userIds = [currentUser.id, user.id];

      // Update each chat in the userchats with the last message, seen and updatedAt data
      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = inputText;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        }
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      // Reset img state
      setImg({
        file: null,
        url: "",
      });
      // Reset input state
      setInputText("");
    }
  };

  // Image handler
  const handleImage = (e) => {
    e.target.files[0] &&
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
  };

  // Returned JSX
  return (
    <section className="chat">
      {/* Top part */}
      <div className="chat-top">
        <div className="chat-top__user">
          <Avatar src={user?.avatar} size="6rem" />
          <div className="chat-top__texts">
            <span className="chat-top__user-name">
              {user?.username || "User"}
            </span>
            <p className="chat-top__user-email">{user?.email || ""}</p>
          </div>
        </div>
        <div className="chat-top__icons">
          <img
            src="./close.png"
            alt=""
            onClick={() => {
              resetChat();
            }}
          />
        </div>
      </div>

      {/* Center part */}
      <div className="chat-center">
        {chat?.messages?.map((message) => (
          <div
            className={`chat-center__message-container ${
              message.senderId === currentUser.id &&
              "chat-center__message-container--own"
            }`}
            key={message?.createdAt}
          >
            <div className="chat-center__texts">
              {message.img && (
                <img
                  src={message.img}
                  className="chat-center__img"
                  height={80}
                  alt=""
                />
              )}
              {message.text && (
                <p className="chat-center__message">{message.text}</p>
              )}
              <span className="chat-center__timestamp">
                {format(message.createdAt.toDate())}
              </span>
            </div>
          </div>
        ))}

        {img && (
          <div className="chat-center__message-container chat-center__message-container--own">
            <div className="chat-center__texts">
              <img src={img.url} height={80} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      {/* Bottom part */}
      <div className="chat-bottom">
        <div className="chat-bottom__icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          <img src="./camera.png" alt="" />
        </div>
        <input
          type="text"
          className="chat-bottom__input"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message"
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="chat-bottom__icons">
          <img
            src="./emoji.png"
            className="emoji-trigger"
            onClick={handleClick}
            alt=""
          />
          {openEmoji && (
            <EmojiModal
              setInputText={setInputText}
              setOpenEmoji={setOpenEmoji}
            />
          )}
        </div>
        <Button
          padding="1rem 2rem"
          onClick={handleSendMessage}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </Button>
      </div>
    </section>
  );
}

export default Chat;
