import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const buttonClass = `${styles.button} 
  ${styles[`button-${variant}`]} 
  ${styles[`button-${size}`]} 
  ${fullWidth ? styles.fullWidth : ""}
  ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;