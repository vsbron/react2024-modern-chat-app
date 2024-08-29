import { useChatStore } from "../../../lib/chatStore";
import { auth } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";

import Avatar from "../../../ui/avatar/Avatar";

import "./userInfo.css";

function UserInfo() {
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
        <Avatar src={currentUser.avatar} size="5rem" />
        <div>
          <h2>{currentUser.username}</h2>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./logout.png" alt="" onClick={handleLogout} />
      </div>
    </div>
  );
}

export default UserInfo;
