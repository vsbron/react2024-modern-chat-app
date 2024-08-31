import { useChatStore } from "../../../lib/chatStore";
import { auth } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";

import Avatar from "../../../ui/avatar/Avatar";

import "./userInfo.css";

function UserInfo({ setShowSettings }) {
  // Getting the current user data from the store
  const { currentUser } = useUserStore();
  const { resetChat } = useChatStore();

  // Click handler for logout button
  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  // Returned JSX
  return (
    <div className="user-info">
      <div className="user">
        <Avatar
          src={currentUser.avatar}
          size="5rem"
          altTitle={currentUser.username}
        />
        <div>
          <h2>{currentUser.username}</h2>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <div className="icons">
        <img
          src="./settings.svg"
          alt="Settings"
          title="Settings"
          onClick={() => setShowSettings(true)}
        />
        <img
          src="./logout.svg"
          alt="Log out"
          title="Log out"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

export default UserInfo;
