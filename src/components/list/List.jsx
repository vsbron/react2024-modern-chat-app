import { useState } from "react";

import ChatList from "./chatList/ChatList";
import Settings from "./settings/Settings";
import UserInfo from "./userInfo/UserInfo";

import "./list.css";

function List() {
  const [showSettings, setShowSettings] = useState(false);

  // Returned JSX
  return (
    <section className="list">
      <UserInfo setShowSettings={setShowSettings} />
      <ChatList />
      <Settings showSettings={showSettings} setShowSettings={setShowSettings} />
    </section>
  );
}

export default List;
