import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import "./chat.css";

function Chat() {
  // State for Emoji Picker module and Input text
  const [openEmoji, setOpenEmoji] = useState(false);
  const [inputText, setInputText] = useState("");

  // useEffect for closing the Emoji picker once clicked outside or Esc key is pressed
  useEffect(() => {
    // Outside click handler
    const handleClickOutside = (e) =>
      !e.target.closest(".chat-bottom__emoji-picker") &&
      !e.target.className.includes("test") &&
      setOpenEmoji(false);

    //Escape key press handler
    const handleEscKeyPress = (e) => e.key === "Escape" && setOpenEmoji(false);

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKeyPress);

    // Remove event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, []);

  // Click handler to open emoji window
  const handleClick = () => {
    setOpenEmoji((open) => !open);
  };

  // Click handler that adds the emoji after clicking it in the module
  const handleEmoji = (e) => {
    setInputText((currentText) => currentText + e.emoji);
    setOpenEmoji(false);
  };

  // Returned JSX
  return (
    <section className="chat">
      {/* Top part */}
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

      {/* Center part */}
      <div className="chat-center">
        <div className="chat-center__message-container">
          <img src="./avatar.png" className="chat-center__avatar" alt="" />
          <div className="chat-center__texts">
            <p className="chat-center__message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde
              odio illum distinctio nobis exercitationem ad omnis accusantium
              ipsam numquam delectus tempora dignissimos.
            </p>
            <span className="chat-center__tiemstamp">1 minute ago</span>
          </div>
        </div>
        <div className="chat-center__message-container chat-center__message-container--own">
          <div className="chat-center__texts">
            <p className="chat-center__message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde
              odio illum distinctio nobis exercitationem ad omnis accusantium
              ipsam numquam delectus tempora dignissimos.
            </p>
            <span className="chat-center__tiemstamp">1 minute ago</span>
          </div>
        </div>
        <div className="chat-center__message-container">
          <img src="./avatar.png" className="chat-center__avatar" alt="" />
          <div className="chat-center__texts">
            <p className="chat-center__message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde
              odio illum distinctio nobis exercitationem ad omnis accusantium
              ipsam numquam delectus tempora dignissimos.
            </p>
            <span className="chat-center__tiemstamp">1 minute ago</span>
          </div>
        </div>
        <div className="chat-center__message-container">
          <img src="./avatar.png" className="chat-center__avatar" alt="" />
          <div className="chat-center__texts">
            <p className="chat-center__message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde
              odio illum distinctio nobis exercitationem ad omnis accusantium
              ipsam numquam delectus tempora dignissimos.
            </p>
            <span className="chat-center__tiemstamp">1 minute ago</span>
          </div>
        </div>
        <div className="chat-center__message-container chat-center__message-container--own">
          <div className="chat-center__texts">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
              className="chat-center__img"
              alt=""
            />
            <p className="chat-center__message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde
              odio illum distinctio nobis exercitationem ad omnis accusantium
              ipsam numquam delectus tempora dignissimos.
            </p>
            <span className="chat-center__tiemstamp">1 minute ago</span>
          </div>
        </div>
        <div className="chat-center__message-container">
          <img src="./avatar.png" className="chat-center__avatar" alt="" />
          <div className="chat-center__texts">
            <p className="chat-center__message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde
              odio illum distinctio nobis exercitationem ad omnis accusantium
              ipsam numquam delectus tempora dignissimos.
            </p>
            <span className="chat-center__tiemstamp">1 minute ago</span>
          </div>
        </div>
      </div>

      {/* Bottom part */}
      <div className="chat-bottom">
        <div className="chat-bottom__icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          className="chat-bottom__input"
          placeholder="Type a message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="chat-bottom__icons">
          <img
            src="./emoji.png"
            className="test"
            onClick={handleClick}
            alt=""
          />
          <div className="chat-bottom__emoji-picker">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="chat-bottom__send-button">Send</button>
      </div>
    </section>
  );
}

export default Chat;
