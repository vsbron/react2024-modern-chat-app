import { useState } from "react";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload";

import Avatar from "../../ui/avatar/Avatar";

import "./login.css";

function Login() {
  console.log(auth);
  // State for an avatar image
  const [avatar, setAvatar] = useState({
    file: null,
    src: "",
  });

  // State for the loading state
  const [loading, setLoading] = useState(false);

  // Image upload handler
  const handleAvatar = (e) => {
    e.target.files[0] &&
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
  };

  // Login handler for the form
  const handleLogin = async (e) => {
    // Preventing default behavior
    e.preventDefault();

    // Enabling the loading state
    setLoading(true);

    // Getting the form values from form to constants
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      // Sending the request to authenticate with the user
      await signInWithEmailAndPassword(auth, email, password);

      // Showing success message
      toast.success("You have successfully logged in");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      // Disabling the loading state
      setLoading(false);
    }
  };

  // Registration handler that creates the user in the database
  const handleRegister = async (e) => {
    // Preventing default behavior
    e.preventDefault();

    // Enabling the loading state
    setLoading(true);

    // Getting the form values from form to constants
    const formData = new FormData(e.target);
    const { username, email, password, avatar } = Object.fromEntries(formData);

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
        blocked: [],
      });

      // Creating the entry in the user chats database with the list of the chats
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      // Showing success message
      toast.success("Account created! You can log in now");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
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
          <button className="login__button" disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Separator */}
      <div className="login__separator"></div>

      {/* Signing up part */}
      <div className="login__item">
        <h2>Create an Account</h2>
        <form className="login__form" onSubmit={handleRegister}>
          <label htmlFor="file" className="login__avatar">
            <Avatar size="5rem" avatarUrl={avatar.url} />
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
          <button className="login__button" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
