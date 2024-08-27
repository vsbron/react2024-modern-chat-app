import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";

import Avatar from "../../ui/avatar/Avatar";
import Button from "../../ui/button/Button";
import EmojiModal from "./emojiModal/EmojiModal";

import "./chat.css";

function Chat() {
  // State for Active chat, Emoji Picker module and Input text
  const [chat, setChat] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [inputText, setInputText] = useState("");

  // Getting the current chat id variable
  const { chatId } = useChatStore();

  // / Reference for the end of the chat
  const endRef = useRef(null);

  // useEffect to focus on the end of the chat
  useEffect(() => {
    endRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // useEffect to focus on the end of the chat
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) =>
      setChat(res.data())
    );

    // Cleanup function when component unmounts
    return () => {
      unSub();
    };
  }, [chatId]);

  // Click handler to open emoji window
  const handleClick = () => {
    setOpenEmoji((open) => !open);
  };

  // Returned JSX
  return (
    <section className="chat">
      {/* Top part */}
      <div className="chat-top">
        <div className="chat-top__user">
          <Avatar size="6rem" />
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
          <Avatar size="3rem" />
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
          <Avatar size="3rem" />
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
          <Avatar size="3rem" />
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
          <Avatar size="3rem" />
          <div className="chat-center__texts">
            <p className="chat-center__message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde
              odio illum distinctio nobis exercitationem ad omnis accusantium
              ipsam numquam delectus tempora dignissimos.
            </p>
            <span className="chat-center__tiemstamp">1 minute ago</span>
          </div>
        </div>
        <div ref={endRef}></div>
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
            className="emoji-trigger"
            onClick={handleClick}
            alt=""
          />
          {openEmoji && (
            <EmojiModal
              setInputText={setInputText}
              setOpenEmoji={setOpenEmoji}
            />
          )}
        </div>
        <Button padding="1rem 2rem">Send</Button>
      </div>
    </section>
  );
}

export default Chat;
