import { useEffect } from "react";
import { CloseModalProps } from "../lib/types";

// Custom hook that adds event listeners for Modal outside clicks and Esc key handlers
function useCloseModal({ setter, triggerClass, modalClass }: CloseModalProps) {
  useEffect(() => {
    // Outside click handler
    const handleClickOutside = (e: MouseEvent) => {
      // Casting the target to HTML element
      const target = e.target as HTMLElement;

      !target.closest("." + modalClass) &&
        !target.className.includes(triggerClass) &&
        setter(false);
    };

    //Escape key press handler
    const handleEscKeyPress = (e: KeyboardEvent) =>
      e.key === "Escape" && setter(false);

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
