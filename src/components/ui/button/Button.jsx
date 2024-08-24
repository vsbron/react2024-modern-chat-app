import "./button.css";

function Button({ children, padding }) {
  return (
    <button className={"button"} style={{ padding: padding }}>
      {children}
    </button>
  );
}

export default Button;
