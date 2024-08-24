import { useState } from "react";
import { toast } from "react-toastify";

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
    // Preventing default behaviour
    e.preventDefault();
    toast.success("Test");
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
        <form className="login__form">
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
