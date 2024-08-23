import "./addUser.css";

function AddUser() {
  // Returned JSX
  return (
    <div className="add-user">
      {/* Input field for searching users */}
      <form action="" className="add-user__form">
        <input type="text" placeholder="Username" name="username" />
        <button className="add-user__search-button">Search</button>
      </form>

      {/* Found users list */}
      <div className="add-user__user">
        <div className="add-user__user-details">
          <img src="./avatar.png" className="add-user__user-avatar" alt="" />
          <span className="add-user__user-name">Jane Doe</span>
        </div>
        <button className="add-user__user-button">Add user</button>
      </div>
    </div>
  );
}

export default AddUser;
