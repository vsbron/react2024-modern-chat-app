import "./avatar.css";

function Avatar({ src = "./avatar.png", altTitle, size }) {
  // Returned JSX
  return (
    <img
      src={src}
      className="avatar"
      style={{ width: size, height: size }}
      alt={altTitle}
      title={altTitle}
    />
  );
}

export default Avatar;
