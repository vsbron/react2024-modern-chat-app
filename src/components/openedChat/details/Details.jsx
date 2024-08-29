import { saveAs } from "file-saver";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

import { useChatStore } from "../../../lib/chatStore";
import { auth, db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";

import Avatar from "../../../ui/avatar/Avatar";

import "./details.css";

function Details({ chat }) {
  // Get the current user, other user and blocking constants from the store
  const { currentUser } = useUserStore();
  const {
    user,
    changeBlocked,
    isReceiverBlocked,
    isCurrentUserBlocked,
    resetChat,
  } = useChatStore();

  // Getting all the messages with images
  const messagesWithImg = chat?.messages?.filter((msg) => msg.img).reverse();

  // Click handler for logout button
  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

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
    } catch (err) {
      console.error(err.message);
    }
  };

  // Returned JSX
  return (
    <section className="details">
      {/* User info */}
      <div className="details__user">
        <Avatar src={user?.avatar} size="10rem" />
        <h2 className="details__user-name">{user?.username || "User"}</h2>
        <p className="details__user-text">
          Lorem ipsum, dolor sit amet consectetur.
        </p>
      </div>

      {/* Various settings for the chat */}
      <div className="details__info">
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Shared images</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="details__images">
            {messagesWithImg?.map(
              (message, i) =>
                message.img && (
                  <div
                    className="details__images-item"
                    key={i}
                    onClick={() => {
                      saveAs(message.img, "image.jpg");
                    }}
                  >
                    <div className="details__images-container">
                      <img src={message.img} alt="" />
                      <div className="details__images-overlay"></div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        {/* Buttons to block user and to log out? */}
        <button className="details__info-block" onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "User blocked"
            : "Block user"}
        </button>
        <button className="details__info-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </section>
  );
}

export default Details;
