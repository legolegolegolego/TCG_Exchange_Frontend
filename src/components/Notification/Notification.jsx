import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";

// Iconos simples
const icons = {
  success: "✔️",
  error: "❌",
  info: "❗",
};

const Notification = ({ type = "info", message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      // Espera animación antes de eliminar
      setTimeout(onClose, 300);
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
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default Notification;