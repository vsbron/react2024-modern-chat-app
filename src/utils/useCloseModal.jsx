import { useEffect } from "react";

// Custom hook that adds event listeners for Modal outside clicks and Esc key handlers
function useCloseModal({ setter, triggerClass, modalClass }) {
  useEffect(() => {
    // Outside click handler
    const handleClickOutside = (e) =>
      !e.target.closest("." + modalClass) &&
      !e.target.className.includes(triggerClass) &&
      setter(false);

    //Escape key press handler
    const handleEscKeyPress = (e) => e.key === "Escape" && setter(false);

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKeyPress);

    // Remove event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [setter, triggerClass, modalClass]);
}

export default useCloseModal;
