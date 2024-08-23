import Chat from "./components/chat/Chat";
import Details from "./components/details/Details";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notifications from "./components/notifications/Notifications";

const App = () => {
  // User const, for testing
  const user = false;

  // Returned JSX
  return (
    <div className="container">
      {user ? (
        <>
          <List />
          <Chat />
          <Details />
        </>
      ) : (
        <Login />
      )}
      <Notifications />
    </div>
  );
};

export default App;
