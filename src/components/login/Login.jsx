import { useState } from "react";

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

  // Returned JSX
  return (
    <section className="login">
      {/* Signing in part */}
      <div className="login__item">
        <h2>Welcome back,</h2>
        <form className="login__form">
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
            <img src={avatar.url || "./avatar.png"} alt="" />
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
