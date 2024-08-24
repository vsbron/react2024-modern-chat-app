import "./avatar.css";

function Avatar({ avatarUrl = "./avatar.png", alt, size }) {
  return (
    <img
      src={`${avatarUrl}`}
      className="avatar"
      style={{ width: size, height: size }}
      alt={alt}
    />
  );
}

export default Avatar;
