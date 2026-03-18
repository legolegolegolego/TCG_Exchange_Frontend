import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BackTab.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const BackTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const label = "← Volver a la página anterior";

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