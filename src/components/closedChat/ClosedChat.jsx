import "./closedChat.css";

function ClosedChat() {
  return (
    <>
      <div className="start-message">
        <div className="start-message__container">
          <h2>Welcome to the Modern Chat App</h2>
          <p>
            We&apos;re thrilled to have you here! The Modern Chat App is your
            go-to platform for connecting with friends, family, and colleagues.
            Whether you&apos;re catching up with old friends or meeting new
            ones, this app is designed to make your conversations seamless, fun,
            and secure.
          </p>
          <p>
            Our chat platform allows you to exchange messages, share your
            favorite images, and send other files with ease. The intuitive
            design ensures that you can focus on the conversation while the app
            takes care of the rest.
          </p>
          <p>
            To get started, simply select an existing chat from the list or
            search for a new user using their Username or Email address and
            start chatting!
          </p>
        </div>
      </div>
      <div className="copyright">
        <div className="copyright__container">
          <img src="./mca-logo.svg" alt="MCA Logo" title="Modern Chat App" />
          <span>
            Built by VSBroN as a portfolio project
            <br />
            This project is available on{" "}
            <a
              href="https://github.com/vsbron/react2024-modern-chat-app"
              target="_blank"
            >
              GitHub
            </a>
            <br />© 2024. All rights reserved
          </span>
        </div>
      </div>
    </>
  );
}

export default ClosedChat;
