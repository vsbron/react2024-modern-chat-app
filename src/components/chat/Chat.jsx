import "./chat.css";

function Chat() {
  // Returned JSX
  return (
    <div className="chat">
      <div className="chat-top">
        <div className="chat-top__user">
          <img src="./avatar.png" className="chat-top__avatar" alt="" />
          <div className="chat-top__texts">
            <span className="chat-top__user-name">Jane Doe</span>
            <p className="chat-top__user-description">
              Lorem ipsum dolor sit, amet consectetur.
            </p>
          </div>
        </div>
        <div className="chat-top__icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="chat-center"></div>
      <div className="chat-bottom"></div>
    </div>
  );
}

export default Chat;
