import { useState } from "react";
import { toast } from "react-toastify";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { auth } from "../../../lib/firebase";
import upload from "../../../lib/upload";
import { useUserStore } from "../../../lib/userStore";
import {
  isEmailUnique,
  isUsernameUnique,
  isValidEmail,
} from "../../../utils/helpers";

import Avatar from "../../../ui/avatar/Avatar";
import Button from "../../../ui/button/Button";

import "./settings.css";

function Settings({ showSettings, setShowSettings }) {
  // Getting the current user from the store
  const { currentUser, updateUserInfo } = useUserStore();

  // Setting the state for all user's details
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [description, setDescription] = useState(currentUser.description);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Setting the state for updating process
  const [updating, setUpdating] = useState(false);

  // Update profile handler
  const handleUpdateUser = async (e) => {
    // Preventing default behavior
    e.preventDefault();

    // Getting the form values from form to constants
    const formData = new FormData(e.target);
    const { username, email, description } = Object.fromEntries(formData);

    // Guard clause for empty fields
    if (!username || !email || !description)
      return toast.warn("Make sure all user fields are filled");

    // Checking if email is written in the correct format
    if (!isValidEmail(email))
      return toast.warn("Please check of your email is written correctly");

    // Check if username or email is different from current values
    const usernameChanged = username !== currentUser.username;
    const emailChanged = email !== currentUser.email;

    // Checking if username is unique
    if (usernameChanged) {
      const usernameUnique = await isUsernameUnique(username);
      if (!usernameUnique) {
        return toast.warn("This username is already taken");
      }
    }

    // Checking if email is unique
    if (emailChanged) {
      const emailUnique = await isEmailUnique(email);
      if (!emailUnique) {
        return toast.warn("This email is already taken");
      }
    }

    // Checking if avatar was changed
    const isAvatarUnchanged = avatar === currentUser.avatar;

    // Collecting all data into object
    const updatedData = {
      username,
      email,
      description,
    };

    // If avatar has changed, add it to the update data
    if (!isAvatarUnchanged) {
      try {
        const avatarUrl = await upload(avatar.file); // Upload the new avatar
        updatedData.avatar = avatarUrl; // Update the data with new avatar URL
      } catch (err) {
        // Show error if avatar upload fails
        toast.error("Failed to upload avatar" + err.message);
        return;
      }
    }

    // Enabling the updating state
    setUpdating(true);

    try {
      // Update user information
      await updateUserInfo(currentUser.id, updatedData);
      // Show success message
      toast.success("User successfully updated");
    } catch (err) {
      // Show error
      toast.error(err.message);
    } finally {
      // Disabling the updating state
      setUpdating(false);
    }
  };

  // Update password handler
  const handleUpdatePassword = async (e) => {
    // Preventing default behavior
    e.preventDefault();

    // Getting the current user from the auth
    const user = auth.currentUser;

    // Getting the form values from form to constants
    const formData = new FormData(e.target);
    const { currentPassword, password, passwordConfirm } =
      Object.fromEntries(formData);

    // Guard clause for empty fields
    if (!currentPassword)
      return toast.warn("Please enter your current password");

    // Guard clause for empty fields
    if (!password || !passwordConfirm)
      return toast.warn("Please fill all password fields");

    // Guard clause for different password
    if (password !== passwordConfirm)
      return toast.warn("Passwords do not match");

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Enabling the updating state
    setUpdating(true);

    // Update the current user's password
    updatePassword(user, password)
      .then(() => {
        // Showing success message
        toast.success("Password is updated successfully");
      })
      .catch((err) => {
        // Showing errors
        console.error(err);
        toast.error(err.message);
      });

    // Disabling the updating state
    setUpdating(false);
  };

  // Image upload handler
  const handleAvatar = (e) => {
    e.target.files[0] &&
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
  };

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
      <form className="settings__form" onSubmit={handleUpdateUser}>
        <h4>Update profile:</h4>
        <label htmlFor="file" className="settings__avatar">
          <Avatar src={avatar.url || avatar} size="5rem" />
          Change avatar
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          name="avatar"
          onChange={handleAvatar}
        />
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={updating}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={updating}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            placeholder="Enter description"
            name="description"
            maxLength={80}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={updating}
          />
        </div>
        <Button padding="1.5rem 2rem" disabled={updating}>
          Update profile
        </Button>
      </form>

      {/* Update password */}
      <form className="settings__form" onSubmit={handleUpdatePassword}>
        <h4>Update password:</h4>

        <div>
          <input
            type="password"
            placeholder="Enter current password"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={updating}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Create new password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={updating}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm new password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={updating}
          />
        </div>
        <Button padding="1.5rem 2rem" disabled={updating}>
          Update password
        </Button>
      </form>
    </div>
  );
}

export default Settings;
