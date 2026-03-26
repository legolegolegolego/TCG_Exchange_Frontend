import { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { Check, X, Info } from "lucide-react";

const icons = {
  success: <Check size={16} />,
  error: <X size={16} />,
  info: <Info size={16} />
};

const Notification = ({ type = "info", message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // espera animación
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${visible ? styles.show : ""
        }`}
    >
      <span className={styles.icon}>{icons[type]}</span>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Notification;