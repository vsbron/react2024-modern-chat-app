import Chat from "./components/chat/Chat";
import Details from "./components/details/Details";
import List from "./components/list/List";

const App = () => {
  // Returned JSX
  return (
    <div className="container">
      <List />
      <Chat />
      <Details />
    </div>
  );
};

export default App;
