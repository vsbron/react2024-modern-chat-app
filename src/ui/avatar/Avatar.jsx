import "./avatar.css";

function Avatar({ src = "./avatar.png", alt, size }) {
  // Returned JSX
  return (
    <img
      src={src}
      className="avatar"
      style={{ width: size, height: size }}
      alt={alt}
    />
  );
}

export default Avatar;
