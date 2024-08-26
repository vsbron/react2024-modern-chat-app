import { useUserStore } from "../../../lib/userStore";

import Avatar from "../../../ui/avatar/Avatar";

import "./userInfo.css";

function UserInfo() {
  // Getting the current user data from the store
  const { currentUser } = useUserStore();

  // Returned JSX
  return (
    <div className="user-info">
      <div className="user">
        <Avatar src={currentUser.avatar} size="5rem" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div>
  );
}

export default UserInfo;
