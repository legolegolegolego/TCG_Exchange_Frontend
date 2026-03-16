import { useEffect, useState } from "react";
import styles from "./Notification.module.css";

const icons = { success: "✔️", error: "❌", info: "❗" };

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
      className={`${styles.notification} ${styles[type]} ${
        visible ? styles.show : ""
      }`}
    >
      <span className={styles.icon}>{icons[type]}</span>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Notification;