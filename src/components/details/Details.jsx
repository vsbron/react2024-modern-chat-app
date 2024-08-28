import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";

import Avatar from "../../ui/avatar/Avatar";

import "./details.css";

function Details() {
  // Get the current user, other user and blocking constants from the store
  const { currentUser } = useUserStore();
  const {
    user,
    changeBlocked,
    isReceiverBlocked,
    isCurrentUserBlocked,
    resetChat,
  } = useChatStore();

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
            <div className="details__images-item">
              <div className="details__images-details">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
                  alt=""
                />
                <span>Image #1</span>
              </div>
              <img
                src="./download.png"
                className="details__images-download"
                alt=""
              />
            </div>
            <div className="details__images-item">
              <div className="details__images-details">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
                  alt=""
                />
                <span>Image #2</span>
              </div>
              <img
                src="./download.png"
                className="details__images-download"
                alt=""
              />
            </div>
            <div className="details__images-item">
              <div className="details__images-details">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
                  alt=""
                />
                <span>Image #3</span>
              </div>
              <img
                src="./download.png"
                className="details__images-download"
                alt=""
              />
            </div>
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
