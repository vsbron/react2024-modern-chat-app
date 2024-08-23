import "./details.css";

function Details() {
  // Returned JSX
  return (
    <section className="details">
      <div className="details__user">
        <img src="./avatar.png" className="details__user-avatar" alt="" />
        <h2 className="details__user-name">Jane Doe</h2>
        <p className="details__user-text">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="details__info">
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Shared images</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="details__images">
            <div className="details__images-item">
              <div className="details__images-details">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
                  alt=""
                />
                <span>Image #1</span>
              </div>
              <img
                src="./download.png"
                className="details__images-download"
                alt=""
              />
            </div>
            <div className="details__images-item">
              <div className="details__images-details">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
                  alt=""
                />
                <span>Image #2</span>
              </div>
              <img
                src="./download.png"
                className="details__images-download"
                alt=""
              />
            </div>
            <div className="details__images-item">
              <div className="details__images-details">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s"
                  alt=""
                />
                <span>Image #3</span>
              </div>
              <img
                src="./download.png"
                className="details__images-download"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="details__info-option">
          <div className="details__info-title">
            <span>Shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button className="details__info-block">Block user</button>
      </div>
    </section>
  );
}

export default Details;
