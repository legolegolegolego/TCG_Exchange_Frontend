import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const icons = { success: "✔️", error: "❌", info: "❗" };

const Notification = ({ type = "info", message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgClass = type === "success" ? "alert-success" : type === "error" ? "alert-danger" : "alert-info";

  return (
    <div className={`alert ${bgClass} d-flex align-items-center ${visible ? "show" : "fade"}`} role="alert">
      <span className="me-2">{icons[type]}</span>
      <div>{message}</div>
    </div>
  );
};

export default Notification;