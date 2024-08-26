import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";

import Chat from "./components/chat/Chat";
import Details from "./components/details/Details";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notifications from "./components/notifications/Notifications";

const App = () => {
  // Getting the user, loading state and fetch function from the zustand store
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  // useEffect with event listener for the auth change state
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    // Cleanup function when component unmounts
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  // Show loader if data is loading
  if (isLoading) return <div className="loading">Loading...</div>;

  // Returned JSX
  return (
    <div className="container">
      {currentUser ? (
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
