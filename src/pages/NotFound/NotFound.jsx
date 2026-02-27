import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";
import missingno from "../../assets/missingno.webp";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={`container ${styles.wrapper} text-center d-flex flex-column justify-content-center align-items-center vh-100`}>
      <img
        src={missingno}
        alt="MissingNo"
        className={`img-fluid ${styles.image}`}
      />

      <h1 className={`display-1 ${styles.code}`}>404</h1>
      <h2 className={`h3 ${styles.title}`}>Not Found</h2>
      <p className={`lead ${styles.message}`}>
        La funcionalidad que buscas aún no está disponible o no existe en este momento.
      </p>
    </div>
  );
};

export default NotFound;