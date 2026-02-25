import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <img
        src="https://via.placeholder.com/400x300?text=MissingNo"
        alt="MissingNo"
        className={styles.image}
      />

      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Not Found</h2>
      <p className={styles.message}>
        La funcionalidad que buscas aun no esta disponible o no existe en este
        momento.
      </p>

      <button
        className={styles.homeButton}
        onClick={() => navigate("/")}
        aria-label="Volver a la página principal"
      >
        <span className={styles.houseIcon}>🏠</span>
        Volver a la página principal
      </button>
    </div>
  );
};

export default NotFound;
