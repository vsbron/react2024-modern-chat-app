import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./lib/firebase";
import { useChatStore } from "./lib/chatStore";
import { useUserStore } from "./lib/userStore";

import List from "./components/list/List";
import Login from "./components/login/Login";
import Notifications from "./components/notifications/Notifications";
import OpenedChat from "./components/openedChat/OpenedChat";
import ClosedChat from "./components/closedChat/ClosedChat";
import Loader from "./ui/loader/Loader";

const App = () => {
  // Getting the user, loading state and fetch function from the store
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  // Getting the chatId from the store
  const { chatId } = useChatStore();

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
  if (isLoading) return <Loader />;

  // Returned JSX
  return (
    <div className="bg-image">
      <div className="container">
        {currentUser ? (
          <>
            <List />
            {chatId ? <OpenedChat /> : <ClosedChat />}
          </>
        ) : (
          <Login />
        )}
        <Notifications />
      </div>
    </div>
  );
};

export default App;
