import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { saveAs } from "file-saver";

import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import { ChatProps, FileState, MessageType } from "../../../lib/types";
import upload from "../../../lib/upload";
import { formatDate } from "../../../utils/helpers";

import EmojiModal from "./emojiModal/EmojiModal";
import Avatar from "../../../ui/avatar/Avatar";
import Button from "../../../ui/button/Button";

import LoaderSmall from "../../../ui/loader/LoaderSmall";
import "./chat.css";

// Initial state for an empty file
const fileInitialState = {
  file: null,
  url: "",
  type: "",
};

function Chat({ chat, setShowDetails, isLoading }: ChatProps) {
  // State for Emoji Picker module, Input text and uploaded file
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [file, setFile] = useState<FileState>(fileInitialState);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Getting the current user, other user and chat id variables from the store
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, resetChat } =
    useChatStore();

  // / Reference for the end of the chat and file input
  const endRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect to focus on the end of the chat
  useEffect(() => {
    endRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  // useEffect to reset the input and image when chat is changed
  useEffect(() => {
    resetImage();
    setInputText("");
  }, [chatId]);

  // Click handler to open emoji window
  const handleClick = () => {
    setOpenEmoji((open) => !open);
  };

  // Sending message handler
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    // Preventing default behavior
    e.preventDefault();

    // Guard clause
    if (inputText.trim() === "" && !file?.file) return;

    // Enabling sending state
    setIsSending(true);

    try {
      // Upload the file if provided
      let fileUrl = null;
      if (file?.file) {
        fileUrl = await upload(file.file);
      }

      // Prepare the message data
      const messageData: MessageType = {
        senderId: currentUser.id,
        text: inputText,
        createdAt: new Date(),
      };

      // Add the file data if fileUrl exists
      if (fileUrl !== null) {
        if (file.type.startsWith("image/")) {
          messageData.img = fileUrl;
        } else {
          messageData.file = fileUrl;
          messageData.fileName = file.file!.name;
        }
      }

      // Add the sent message to the messages array in the database
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(messageData),
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
            (c: { chatId: string }) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = inputText;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        }
      });
    } catch (e: unknown) {
      console.error(
        e instanceof Error
          ? e.message
          : "Couldn't send a message due to unknown error"
      );
    } finally {
      // Reset img state
      resetImage();

      // Reset input state
      setInputText("");

      // Disabling sending state
      setIsSending(false);
    }
  };

  // File handler
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Optional chaining in case files is null
    if (file) {
      setFile({
        file,
        url: URL.createObjectURL(file),
        type: file.type,
      });
    }
  };

  // Handle the label click
  const handleLabelClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Helper function that resets the attached file
  const resetImage = () => {
    setFile(fileInitialState);
  };

  // Returned JSX
  return (
    <section className="chat">
      {/* Top part */}
      <div className="chat-top">
        {isLoading ? (
          <LoaderSmall />
        ) : (
          <>
            <div className="chat-top__user">
              <Avatar src={user.avatar} size="6rem" altTitle={user.username} />
              <div className="chat-top__texts">
                <span className="chat-top__user-name">
                  {user.username || "User"}
                </span>
                <p className="chat-top__user-email">{user.email || ""}</p>
              </div>
            </div>
            <div className="chat-top__icons">
              <img
                src="./info.svg"
                alt={`More info about ${user.username}`}
                title={`More info about ${user.username}`}
                className="chat-top__icons--details"
                onClick={() => {
                  setShowDetails(true);
                }}
              />
              <img
                src="./close.svg"
                alt={`Close chat with ${user.username}`}
                title={`Close chat with ${user.username}`}
                onClick={() => {
                  resetChat();
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Center part */}
      <div className="chat-center">
        {isLoading ? (
          <LoaderSmall />
        ) : (
          chat.messages?.map((message: MessageType) => (
            <div
              className={`chat-center__message-container ${
                message.senderId === currentUser.id &&
                "chat-center__message-container--own"
              }`}
              key={
                message.createdAt instanceof Date
                  ? message.createdAt.getTime()
                  : message.createdAt.seconds
              }
            >
              <div className="chat-center__texts">
                {/* Display attached file */}
                {message.file && (
                  <div className="chat-center__file">
                    <span>{message.fileName}</span>
                    <img
                      src="./file.svg"
                      className="chat-center__attached"
                      height={40}
                      alt="Attached file"
                      onClick={() => {
                        saveAs(message.file as File);
                      }}
                    />
                  </div>
                )}
                {/* Display attached img */}
                {message.img && (
                  <img
                    src={message.img}
                    className="chat-center__attached"
                    height={80}
                    alt="Attached image"
                    onClick={() => {
                      saveAs(message.img as string);
                    }}
                  />
                )}
                {/* Display sent text */}
                {message.text && (
                  <p className="chat-center__message">{message.text}</p>
                )}
                {/* Display the timestamp */}
                <span className="chat-center__timestamp">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}

        <div ref={endRef}></div>
      </div>

      {/* Bottom part */}
      <div className="chat-bottom">
        {file.file !== null && (
          <div className="chat-bottom__file-preview">
            Attached file:
            {file.type.startsWith("image/") ? (
              <>
                <img src={file.url} height={40} alt={file.file.name} />
                <span className="chat-bottom__file-name">{file.file.name}</span>
              </>
            ) : (
              <>
                <img src={"./file.svg"} height={40} alt={file.file.name} />
                <span className="chat-bottom__file-name">{file.file.name}</span>
              </>
            )}
            <img
              src="./close.svg"
              className="chat-bottom__img-close"
              onClick={resetImage}
              height={20}
            />
          </div>
        )}
        <form onSubmit={handleSendMessage}>
          <div className="chat-bottom__icons">
            <label onClick={handleLabelClick}>
              <img src="./attach.svg" alt="Attach file" title="Attach file" />
            </label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImage}
            />
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
            disabled={isSending || isCurrentUserBlocked || isReceiverBlocked}
          />
          <div className="chat-bottom__icons">
            <img
              src="./emoji.svg"
              className="emoji-trigger"
              onClick={handleClick}
              alt="Add an Emoji"
              title="Add an Emoji"
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
            disabled={isSending || isCurrentUserBlocked || isReceiverBlocked}
          >
            Send
          </Button>
        </form>
      </div>
    </section>
  );
}

export default Chat;
