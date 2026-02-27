import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const buttonClass = `${styles.button} ${styles[`button-${variant}`]} ${styles[`button-${size}`]} ${className}`;
  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;