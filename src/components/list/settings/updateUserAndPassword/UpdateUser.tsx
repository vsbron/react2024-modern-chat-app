import { useState } from "react";
import { toast } from "react-toastify";

import upload from "../../../../lib/upload";
import { useUserStore } from "../../../../lib/userStore";
import {
  isEmailUnique,
  isUsernameUnique,
  isValidEmail,
} from "../../../../utils/helpers";

import Avatar from "../../../../ui/avatar/Avatar";
import Button from "../../../../ui/button/Button";

function UpdateUser() {
  // Getting the current user from the store
  const { currentUser, updateUserInfo } = useUserStore();

  if (currentUser === null)
    return toast.error("Couldn't update the user. Please sign in again");

  // Setting the state for all user's details
  const [avatar, setAvatar] = useState<any>(currentUser.avatar);
  const [username, setUsername] = useState<string>(currentUser.username);
  const [email, setEmail] = useState<string>(currentUser.email);
  const [description, setDescription] = useState<string>(
    currentUser.description
  );

  // Setting the state for updating process
  const [updating, setUpdating] = useState<boolean>(false);

  // Update profile handler
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    // Preventing default behavior
    e.preventDefault();

    // Getting the form values from form to constants
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string; // Type assertion
    const email = formData.get("email") as string; // Type assertion
    const description = formData.get("description") as string; // Type assertion

    // Guard clause for empty fields
    if (!username || !email || !description)
      return toast.warn("Make sure all user fields are filled");

    // Checking if email is written in the correct format
    if (!isValidEmail(email as string))
      return toast.warn("Please check of your email is written correctly");

    // Check if username or email is different from current values
    const usernameChanged = username !== currentUser.username;
    const emailChanged = email !== currentUser.email;

    // Checking if username is unique
    if (usernameChanged) {
      const usernameUnique = await isUsernameUnique(username as string);
      if (!usernameUnique) {
        return toast.warn("This username is already taken");
      }
    }

    // Checking if email is unique
    if (emailChanged) {
      const emailUnique = await isEmailUnique(email as string);
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
      avatar,
    };

    // If avatar has changed, add it to the update data
    if (!isAvatarUnchanged) {
      try {
        const avatarUrl = await upload(avatar.file); // Upload the new avatar
        updatedData.avatar = avatarUrl; // Update the data with new avatar URL
      } catch (e) {
        toast.error("Failed to upload the avatar");
        console.error(e instanceof Error ? e.message : e);
      }
    }

    // Enabling the updating state
    setUpdating(true);

    try {
      // Update user information
      await updateUserInfo(currentUser.id, updatedData);
      // Show success message
      toast.success("User successfully updated");
    } catch (e) {
      toast.error("Failed to update the user info");
      console.error(e instanceof Error ? e.message : e);
    } finally {
      // Disabling the updating state
      setUpdating(false);
    }
  };

  // Image upload handler
  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        src: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Returned JSX
  return (
    <form className="settings__form" onSubmit={handleUpdateUser}>
      <h4>Update profile:</h4>
      <label htmlFor="file" className="settings__avatar">
        <Avatar src={avatar.src || avatar} size="5rem" />
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
  );
}

export default UpdateUser;
