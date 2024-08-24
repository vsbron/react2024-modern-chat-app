import Avatar from "../../../ui/avatar/Avatar";
import Button from "../../../ui/button/Button";

import "./addUser.css";

function AddUser() {
  // Returned JSX
  return (
    <div className="add-user">
      {/* Input field for searching users */}
      <form action="" className="add-user__form">
        <input type="text" placeholder="Username" name="username" />
        <Button padding="2rem">Search</Button>
      </form>

      {/* Found users list */}
      <div className="add-user__user">
        <div className="add-user__user-details">
          <Avatar size="5rem" />
          <span className="add-user__user-name">Jane Doe</span>
        </div>
        <Button padding="1rem">Add user</Button>
      </div>
    </div>
  );
}

export default AddUser;
