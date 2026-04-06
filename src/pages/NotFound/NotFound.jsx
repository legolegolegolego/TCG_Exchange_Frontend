import styles from "./NotFound.module.css";
import missingno from "../../assets/missingno.png";

const NotFound = () => {

  return (
    <div className={`container ${styles.wrapper} text-center d-flex flex-column justify-content-center align-items-center`}>
      <img
        src={missingno}
        alt="MissingNo"
        className={`${styles.image}`}
      />

      <h1 className={`display-1 ${styles.code}`}>404</h1>
      <h2>Not Found</h2>
      <p className={`lead`}>
        La funcionalidad que buscas aún no está disponible o no existe en este momento.
      </p>
    </div>
  );
};

export default NotFound;