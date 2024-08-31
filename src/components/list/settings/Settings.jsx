import UpdateUser from "./updateUserAndPassword/UpdateUser";
import UpdatePassword from "./updateUserAndPassword/UpdatePassword";
import ColorSchemeSelector from "./colorSchemeSelector/ColorSchemeSelector";

import "./settings.css";

function Settings({ showSettings, setShowSettings }) {
  // Returned JSX
  return (
    <div className={`settings ${showSettings && "settings--visible"}`}>
      <img
        src="./close.svg"
        className="settings__close"
        onClick={() => setShowSettings(false)}
      />
      <h2>Settings</h2>

      {/* Update user */}
      <UpdateUser />

      {/* Update password */}
      <UpdatePassword />

      {/* Update color scheme */}
      <ColorSchemeSelector />
    </div>
  );
}

export default Settings;
