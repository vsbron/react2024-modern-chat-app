import EmojiPicker from "emoji-picker-react";

import useCloseModal from "../../../utils/useCloseModal";

import "./emojiModal.css";

function EmojiModal({ setInputText, setOpenEmoji }) {
  // Click handler that adds the emoji after clicking it in the module
  const handleEmoji = (e) => {
    setInputText((currentText) => currentText + e.emoji);
    setOpenEmoji(false);
  };

  // Custom hook that adds the click handlers that will close the Emoji modal
  useCloseModal({
    setter: setOpenEmoji,
    triggerClass: "emoji-trigger",
    modalClass: "emoji-modal",
  });

  // Returned JSX
  return (
    <div className="emoji-modal">
      <EmojiPicker open={true} onEmojiClick={handleEmoji} />
    </div>
  );
}

export default EmojiModal;
