import { useState } from "react";

import AddUser from "./addUser/AddUser";

import Avatar from "../../ui/avatar/Avatar";

import "./chatList.css";

function ChatList() {
  // State for adding user mode
  const [addMode, setAddMode] = useState(false);

  // Returned JSX
  return (
    <>
      <div className="chat-list">
        {/* Search bar */}
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

        {/* List of chats */}
        <div className="item">
          <Avatar size="5rem" />
          <div className="item__texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>

        <div className="item">
          <Avatar size="5rem" />
          <div className="item__texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>

        <div className="item">
          <Avatar size="5rem" />
          <div className="item__texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
      </div>

      {/* Conditional add user modal window */}
      {addMode && <AddUser />}
    </>
  );
}

export default ChatList;
