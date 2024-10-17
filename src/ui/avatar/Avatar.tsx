import { AvatarProps } from "../../lib/types";
import "./avatar.css";

function Avatar({ src = "./avatar.png", altTitle, size }: AvatarProps) {
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
