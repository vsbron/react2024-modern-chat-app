import ChatList from "./chatList/ChatList";
import UserInfo from "./userInfo/UserInfo";

import "./list.css";

function List() {
  // Returned JSX
  return (
    <section className="list">
      <UserInfo />
      <ChatList />
    </section>
  );
}

export default List;
