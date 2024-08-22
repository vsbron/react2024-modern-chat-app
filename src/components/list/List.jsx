import ChatList from "./chatList/ChatList";
import UserInfo from "./userInfo/UserInfo";

import "./list.css";

function List() {
  // Returned JSX
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
}

export default List;
