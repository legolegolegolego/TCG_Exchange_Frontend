import { useNavigate } from "react-router-dom";
import styles from "./Banner.module.css";
import { getCurrentUser } from "../../utils/token";
import logo from "../../assets/logo.png";

const Banner = () => {
  const navigate = useNavigate();
  const username = getCurrentUser()?.username;

  return (
    <div className={styles.banner}>
      <div className={styles.text}>
        <h1>Intercambia Cartas Pokemon Base Set</h1>
        <p>
          Intercambia cartas auténticas del TCG Pokemon Base Set con
          coleccionistas de todo el mundo.
        </p>
        <div className={styles.buttons}>
          <button onClick={() => navigate("/explorar")}>Explorar Base Set</button>
          <button onClick={() => navigate("/cartas/" + username)}>Añadir Tus Cartas</button>
        </div>
      </div>
      <div className={styles.image}>
        <img src={logo} alt="logo web" />
      </div>
    </div>
  );
};

export default Banner;