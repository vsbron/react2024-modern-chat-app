import { useState } from "react";

import "./chatList.css";

function ChatList() {
  // State for adding user mode
  const [addMode, setAddMode] = useState(false);

  // Returned JSX
  return (
    <div className="chat-list">
      <div className="search">
        <div className="search__bar">
          <img src="/search.png" className="search__icon" alt="" />
          <input type="text" className="search__input" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          className="search__add"
          onClick={() => setAddMode((mode) => !mode)}
          alt=""
        />
      </div>
    </div>
  );
}

export default ChatList;
