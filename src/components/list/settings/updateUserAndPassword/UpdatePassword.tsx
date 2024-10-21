import { useState } from "react";
import { toast } from "react-toastify";
import { reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/web-extension";

import { auth } from "../../../../lib/firebase";

import Button from "../../../../ui/button/Button";

function UpdatePassword() {
  // Creating the states for password fields
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  // Setting the state for updating process
  const [updating, setUpdating] = useState<boolean>(false);

  // Update password handler
  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    // Preventing default behavior
    e.preventDefault();

    // Getting the current user from the auth
    const user = auth.currentUser;
    // Getting the form values from form to constants
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string; // Type assertion
    const password = formData.get("password") as string; // Type assertion
    const passwordConfirm = formData.get("passwordConfirm") as string; // Type assertion

    // Guard clause if no user is authenticated
    if (!user) return toast.warn("No user is currently logged in.");

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
      user.email as string,
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
      .catch((e: unknown) => {
        toast.error("Couldn't update the password due to unknown error");
        console.error(e instanceof Error ? e.message : e);
      });

    // Disabling the updating state
    setUpdating(false);
  };

  // Returned JSX
  return (
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
  );
}

export default UpdatePassword;
