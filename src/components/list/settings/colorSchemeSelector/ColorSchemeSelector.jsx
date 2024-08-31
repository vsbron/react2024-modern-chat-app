import { useState } from "react";

import { useUserStore } from "../../../../lib/userStore";
import { COLORS } from "../../../../utils/constants";

import "./colorSchemeSelector.css";

function ColorSchemeSelector() {
  // Getting the current user and update function from the store
  const { currentUser, updateUserInfo } = useUserStore();

  // Creating the state for the selected color
  const [selectedColor, setSelectedColor] = useState(currentUser.color);

  // Handle color change
  const handleColorChange = async (color) => {
    if (color === selectedColor) return; // Avoid unnecessary updates

    try {
      // Update the user's color scheme
      await updateUserInfo(currentUser.id, { color });

      // Update the local state
      setSelectedColor(color);
    } catch (err) {
      console.error(err.message);
      // Handle errors if necessary
    }
  };

  return (
    <div className="color-scheme">
      <h4>Change color scheme:</h4>
      <div className="color-scheme__colors">
        {COLORS.map((color) => (
          <div
            key={color.name}
            className={`color-circle ${
              selectedColor === color.name ? "active" : ""
            }`}
            style={{ backgroundColor: color.bg }}
            onClick={() => handleColorChange(color.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorSchemeSelector;
