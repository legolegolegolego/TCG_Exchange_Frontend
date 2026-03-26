import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BackTab.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../Button/Button";

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
      <Button
        onClick={handleClick}
        variant="black"
      >
        {label}
      </Button>
    </div>
  );
};

export default BackTab;