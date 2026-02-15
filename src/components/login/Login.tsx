import { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { isUsernameUnique, isValidEmail } from "../../utils/helpers";
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload";

import Avatar from "../../ui/avatar/Avatar";
import Button from "../../ui/button/Button";

import "./login.css";
import { AvatarState } from "../../lib/types";
import { FirebaseError } from "firebase/app";

function Login() {
  // State for an avatar image
  const [avatar, setAvatar] = useState<AvatarState>({
    file: null,
    src: "",
  });

  // State for the loading state
  const [loading, setLoading] = useState(false);

  // Image upload handler
  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        src: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Login handler for the form
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    // Preventing default behavior
    e.preventDefault();

    // Getting the form values from form to constants
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string; // Type assertion
    const password = formData.get("password") as string; // Type assertion

    // Log in input validation
    if (!email || !password) return toast.warn("Please enter log in inputs!");

    // Checking if email is written in the correct format
    if (!isValidEmail(email as string))
      return toast.warn("Please check of your email is written correctly");

    // Enabling the loading state
    setLoading(true);

    try {
      // Sending the request to authenticate with the user
      await signInWithEmailAndPassword(auth, email, password);

      // Showing success message
      toast.success("You have successfully logged in");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        console.error(e.message);
        if (e.code === "auth/invalid-credential") {
          toast.error("Wrong username or password. Please try again");
        }
      } else {
        console.error(e);
        toast.error("Couldn't sign in due to unknown error");
      }
    } finally {
      // Disabling the loading state
      setLoading(false);
    }
  };

  // Registration handler that creates the user in the database
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    // Preventing default behavior
    e.preventDefault();

    // Getting the form values from form to constants
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string; // Type assertion
    const email = formData.get("email") as string; // Type assertion
    const password = formData.get("password") as string; // Type assertion
    const avatar = formData.get("avatar") as File | null; // Type assertion

    // Register input validation
    if (!username || !email || !password)
      return toast.warn("Please enter register inputs!");
    if (!avatar?.name) return toast.warn("Please upload an avatar!");

    // Checking if email is written in the correct format
    if (!isValidEmail(email))
      return toast.warn("Please check of your email is written correctly");

    // Checking if username is unique
    const usernameUnique = await isUsernameUnique(username);
    if (!usernameUnique) {
      return toast.warn("Select another username");
    }

    // Enabling the loading state
    setLoading(true);

    try {
      // Sending the request to create a new user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Uploading the avatar to the storage
      const imgUrl = await upload(avatar);

      // Creating the entry in the user database with username, email, id and blocked users
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        color: "violet",
        blocked: [],
        pinned: [],
      });

      // Creating the entry in the user chats database with the list of the chats
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      // Showing success message
      toast.success("Account created! You can log in now");
    } catch (e: unknown) {
      toast.error("Couldn't create an account due to unknown error");
      console.error(e instanceof Error ? e.message : e);
    } finally {
      // Disabling the loading state
      setLoading(false);
    }
  };

  // Returned JSX
  return (
    <section className="login">
      {/* Signing in part */}
      <div className="login__item">
        <h2>Welcome back,</h2>
        <form className="login__form" onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <Button padding="2rem" disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </form>
      </div>

      {/* Separator */}
      <div className="login__separator"></div>

      {/* Signing up part */}
      <div className="login__item">
        <h2>Create an Account</h2>
        <form className="login__form" onSubmit={handleRegister}>
          <label htmlFor="file" className="login__avatar">
            <Avatar
              size="5rem"
              src={avatar.src || "./avatar.png"}
              altTitle="Avatar"
            />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
            name="avatar"
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <Button padding="2rem" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default Login;
