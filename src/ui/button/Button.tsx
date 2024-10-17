import { ButtonProps } from "../../lib/types";
import "./button.css";

function Button({ children, padding, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={"button"}
      style={{ padding: padding }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
