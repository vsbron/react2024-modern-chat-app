import { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { saveAs } from "file-saver";

import { useChatStore } from "../../../lib/chatStore";
import { db } from "../../../lib/firebase";
import { DetailsProps, MessageType } from "../../../lib/types";
import { useUserStore } from "../../../lib/userStore";

import Avatar from "../../../ui/avatar/Avatar";
import LoaderSmall from "../../../ui/loader/LoaderSmall";

import "./details.css";
import { toast } from "react-toastify";
import {
  LinkIcon,
  LinkSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/solid";
import Button from "../../../ui/button/Button";

function Details({ chat, showDetails, setShowDetails }: DetailsProps) {
  // State for the images and files sections and fetching/pinning state
  const [showImages, setShowImages] = useState<boolean>(false);
  const [showFiles, setShowFiles] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isPinning, setIsPinning] = useState<boolean>(false);

  // Get the current user, other user and blocking constants from the store
  const { currentUser, fetchUserInfo } = useUserStore();
  const {
    user,
    changeBlocked,
    isReceiverBlocked,
    isCurrentUserBlocked,
    isChatPinned,
    changePinned,
  } = useChatStore();

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

    // Enable fetching state
    setIsFetching(true);

    // Get a reference to the user
    const userDocRef = doc(db, "users", currentUser!.id);

    // Update the blocked list
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      await fetchUserInfo(currentUser!.id);

      // Use the function from the store
      changeBlocked();
    } catch (e: unknown) {
      toast.error("Couldn't block the user due to unknown error");
      console.error(e instanceof Error ? e.message : e);
    } finally {
      // Disable fetching state
      setIsFetching(false);
    }
  };
  // Pin chat handler
  const handlePin = async () => {
    // Enable pinning state
    setIsPinning(true);

    // Get a reference to the user
    const userDocRef = doc(db, "users", currentUser!.id);

    // Update the blocked list
    try {
      await updateDoc(userDocRef, {
        pinned: isChatPinned ? arrayRemove(user!.id) : arrayUnion(user!.id),
      });
      await fetchUserInfo(currentUser!.id);

      // Use the function from the store
      changePinned();
    } catch (e: unknown) {
      toast.error("Couldn't pin chat due to unknown error");
      console.error(e instanceof Error ? e.message : e);
    } finally {
      // Disable pinning state
      setIsPinning(false);
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

  // Guard clause
  if (user === null) return <LoaderSmall />;

  // Returned JSX
  return (
    <section className={`details ${showDetails ? "details--active" : ""}`}>
      <img
        src="/close.svg"
        alt="Close details"
        title="Close details"
        className="details__close"
        onClick={() => {
          setShowDetails(false);
        }}
      />

      {/* User info */}
      <div className="details__user">
        <Avatar src={user?.avatar} size="10rem" altTitle={user.username} />
        <h2 className="details__user-name">{user.username || "User"}</h2>
        <p className="details__email">{user.email || "User"}</p>
        {user.description && <p>{user.description}</p>}
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
              {messagesWithImages.length === 0 ? (
                <div className="details__note">
                  There are no shared images in this chat
                </div>
              ) : (
                messagesWithImages.map(
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
                    ),
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
              {messagesWithFiles.length === 0 ? (
                <div className="details__note">
                  There are no shared files in this chat
                </div>
              ) : (
                messagesWithFiles.map(
                  (message: MessageType, i: number) =>
                    message.file && (
                      <div className="details__files-container" key={i}>
                        <img src="/file.svg" alt="Shared file" />
                        <span className="details__filename">
                          {message.fileName}
                        </span>
                        <img
                          src="/download.svg"
                          className="details__files-download"
                          height={20}
                          alt="Download file"
                          title={`Download ${message.fileName}`}
                          onClick={() => {
                            saveAs(message.file as File);
                          }}
                        />
                      </div>
                    ),
                )
              )}
            </div>
          )}
        </div>

        {/* Block user button */}
        <div className="details__buttons">
          <Button
            padding="1.5rem 2rem"
            onClick={handlePin}
            disabled={isPinning}
          >
            <span className="details__button">
              {isPinning ? (
                "Working..."
              ) : isChatPinned ? (
                <>
                  <LinkSlashIcon /> Unpin chat
                </>
              ) : (
                <>
                  <LinkIcon /> Pin chat
                </>
              )}
            </span>
          </Button>
          <button
            className={`details__info-block ${
              isCurrentUserBlocked || isFetching
                ? "details__info-block--blocked"
                : ""
            } `}
            onClick={handleBlock}
            disabled={isFetching}
          >
            {isFetching ? (
              "Working..."
            ) : isCurrentUserBlocked ? (
              <span className="details__button">
                <NoSymbolIcon /> You are blocked
              </span>
            ) : isReceiverBlocked ? (
              <span className="details__button">
                <LockOpenIcon /> Unblock user
              </span>
            ) : (
              <span className="details__button">
                <LockClosedIcon /> Block user
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Details;
