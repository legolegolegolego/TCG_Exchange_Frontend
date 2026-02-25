import styles from "./Button.module.css";

const Button = ({ children, onClick, type = "button", disabled = false }) => {
  const className = disabled ? `${styles.button} ${styles.disabled}` : styles.button;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
};

export default Button;