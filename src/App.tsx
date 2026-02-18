import { lazy, Suspense, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./lib/firebase";
import { useChatStore } from "./lib/chatStore";
import { useUserStore } from "./lib/userStore";

import Loader from "./ui/loader/Loader";

// Lazy components
const List = lazy(() => import("./components/list/List"));
const Login = lazy(() => import("./components/login/Login"));
const Notifications = lazy(
  () => import("./components/notifications/Notifications"),
);
const OpenedChat = lazy(() => import("./components/openedChat/OpenedChat"));
const ClosedChat = lazy(() => import("./components/closedChat/ClosedChat"));

const App = () => {
  // Getting the user, loading state and fetch function from the store
  const { currentUser, isLoading, fetchUserInfo, clearUserInfo } =
    useUserStore();

  // Getting the chatId from the store
  const { chatId } = useChatStore();

  // useEffect with event listener for the auth change state
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid);
      } else {
        clearUserInfo();
      }
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
    <div className="container">
      <Suspense fallback={<Loader />}>
        {currentUser ? (
          <>
            <List />
            {chatId ? <OpenedChat /> : <ClosedChat />}
          </>
        ) : (
          <Login />
        )}
        <Notifications />
      </Suspense>
    </div>
  );
};

export default App;
