import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../lib/firebase";

import Avatar from "../../ui/avatar/Avatar";

import "./login.css";

function Login() {
  // State for an avatar image
  const [avatar, setAvatar] = useState({
    file: null,
    src: "",
  });

  // Image upload handler
  const handleAvatar = (e) => {
    e.target.files[0] &&
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
  };

  // Login handler for the form
  const handleLogin = (e) => {
    // Preventing default behavior
    e.preventDefault();

    // Showing the message
    toast.success("Test");
  };

  // Registration handler that creates the user in the database
  const handleRegister = async (e) => {
    // Preventing default behavior
    e.preventDefault();

    // Getting the form values from form to constants
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      // Sending the request to create a new user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Creating the entry in the user database with username, email, id and blocked users
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
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
          <button className="login__button">Sign In</button>
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
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button className="login__button">Sign Up</button>
        </form>
      </div>
    </section>
  );
}

export default Login;
