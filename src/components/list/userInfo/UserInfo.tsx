import { useChatStore } from "../../../lib/chatStore";
import { auth } from "../../../lib/firebase";
import { UserInfoProps } from "../../../lib/types";
import { useUserStore } from "../../../lib/userStore";

import Avatar from "../../../ui/avatar/Avatar";

import "./userInfo.css";

function UserInfo({ setShowSettings }: UserInfoProps) {
  // Getting the current user data from the store
  const { currentUser } = useUserStore();
  const { resetChat } = useChatStore();

  // Click handler for logout button
  const handleLogout = () => {
    auth.signOut();
    resetChat();
    document.body.className = "";
  };

  // Returned JSX
  return (
    <div className="user-info">
      <div className="user">
        <Avatar
          src={currentUser!.avatar}
          size="5rem"
          altTitle={currentUser!.username}
        />
        <div>
          <h2>{currentUser!.username}</h2>
          <p>{currentUser!.email}</p>
        </div>
      </div>
      <div className="icons">
        <img
          src="/settings.svg"
          alt="Settings"
          title="Settings"
          onClick={() => setShowSettings(true)}
        />
        <img
          src="/logout.svg"
          alt="Log out"
          title="Log out"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

export default UserInfo;
