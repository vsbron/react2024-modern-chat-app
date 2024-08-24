import Avatar from "../../../ui/avatar/Avatar";

import "./userInfo.css";

function UserInfo() {
  // Returned JSX
  return (
    <div className="user-info">
      <div className="user">
        <Avatar size="5rem" />
        <h2>John Doe</h2>
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
