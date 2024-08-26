import "./button.css";

function Button({ children, padding, onClick }) {
  return (
    <button className={"button"} style={{ padding: padding }} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
