import { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { saveAs } from "file-saver";

import { useChatStore } from "../../../lib/chatStore";
import { db } from "../../../lib/firebase";
import { DetailsProps, MessageType } from "../../../lib/types";
import { useUserStore } from "../../../lib/userStore";

import Avatar from "../../../ui/avatar/Avatar";

import "./details.css";

function Details({ chat, showDetails, setShowDetails }: DetailsProps) {
  // State for the images and files sections
  const [showImages, setShowImages] = useState<boolean>(false);
  const [showFiles, setShowFiles] = useState<boolean>(false);

  // Get the current user, other user and blocking constants from the store
  const { currentUser } = useUserStore();
  const { user, changeBlocked, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();

  // Getting all the messages with images and files
  const messagesWithImages = chat?.messages
    ?.filter((msg: MessageType) => msg.img)
    .reverse();
  const messagesWithFiles = chat?.messages
    ?.filter((msg: MessageType) => msg.file)
    .reverse();

  // Block user handler
  const handleBlock = async () => {
    // If user blocked you, button does nothing
    if (!user) return;

    // Get a reference to the user
    const userDocRef = doc(db, "users", currentUser.id);

    // Update the blocked list
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      // Use the function from the store
      changeBlocked();
    } catch (e: unknown) {
      console.error(
        e instanceof Error
          ? e.message
          : "Couldn't block the user due to unknown error"
      );
    }
  };

  // Show/hide images toggler
  const toggleImages = () => {
    setShowImages((show) => !show);
  };

  // Show/hide files toggler
  const toggleFiles = () => {
    setShowFiles((show) => !show);
  };
  // Returned JSX
  return (
    <section className={`details ${showDetails ? "details--active" : ""}`}>
      <img
        src="./close.svg"
        alt="Close details"
        title="Close details"
        className="details__close"
        onClick={() => {
          setShowDetails(false);
        }}
      />

      {/* User info */}
      <div className="details__user">
        <Avatar src={user.avatar} size="10rem" altTitle={user.username} />
        <h2 className="details__user-name">{user.username || "User"}</h2>
        <p className="details__email">{user.email || "User"}</p>
        {user.description && (
          <p className="details__user-text">{user.description}</p>
        )}
      </div>

      {/* Togglers to show all images and files in the chat */}
      <div className="details__info">
        <div className="details__info-option">
          <div className="details__info-title" onClick={toggleImages}>
            <span>Shared images</span>
            <img
              src={showImages ? "./arrowUp.svg" : "./arrowDown.svg"}
              alt="Toggle shared images"
              title="Toggle shared images"
            />
          </div>
          {showImages && (
            <div className="details__images">
              {messagesWithImages?.map(
                (message: MessageType, i: number) =>
                  message.img && (
                    <div
                      className="details__images-item"
                      key={i}
                      onClick={() => {
                        saveAs(message.img as string);
                      }}
                    >
                      <div className="details__images-container">
                        <img src={message.img} alt="Shared image" />
                        <div className="details__images-overlay"></div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
        <div className="details__info-option">
          <div className="details__info-title" onClick={toggleFiles}>
            <span>Shared files</span>
            <img
              src={showFiles ? "./arrowUp.svg" : "./arrowDown.svg"}
              alt="Toggle shared files"
              title="Toggle shared files"
            />
          </div>
          {showFiles && (
            <div className="details__files">
              {messagesWithFiles?.map(
                (message: MessageType, i: number) =>
                  message.file && (
                    <div className="details__files-container" key={i}>
                      <img src="./file.svg" alt="Shared file" />
                      <span className="details__filename">
                        {message.fileName}
                      </span>
                      <img
                        src="./download.svg"
                        className="details__files-download"
                        height={20}
                        alt="Download file"
                        title={`Download ${message.fileName}`}
                        onClick={() => {
                          saveAs(message.file as File);
                        }}
                      />
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {/* Block user button */}
        <button className="details__info-block" onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "User blocked"
            : "Block user"}
        </button>
      </div>
    </section>
  );
}

export default Details;
