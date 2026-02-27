import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BackTab.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const BackTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate("/");
    }
  };

  const label = location.state && location.state.fromLabel
    ? `← Volver a ${location.state.fromLabel}`
    : "← Volver a la página principal";

  return (
    <div className={styles.wrapper}>
      <button
        className={`btn ${styles.tab} btn-dark`}
        onClick={handleClick}
        aria-label="Volver"
      >
        {label}
      </button>
    </div>
  );
};

export default BackTab;