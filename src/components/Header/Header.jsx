import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";

const Header = () => {
  const navigate = useNavigate(); // Hook para navegar

  const handleLoginClick = () => {
    navigate("/login"); // Redirige a la ruta /login
  };
  const handleRegisterClick = () => {
    navigate("/register"); // Redirige a la ruta /register
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <a href="/">
          <img src={logo} alt="Logo App" className={styles.logo} />
          <h1 className={styles.appName}>TCG Exchange</h1>
        </a>
      </div>

      <nav className={styles.nav}>
        <a href="/" className={styles.navLink}>Explorar Cartas</a>
        <input
          type="text"
          placeholder="Buscar cartas..."
          className={styles.searchInput}
        />
      </nav>

      <div className={styles.right}>
        <button className={styles.button} onClick={handleLoginClick}>Iniciar Sesión</button>
        <button className={styles.buttonOutline} onClick={handleRegisterClick}>Registrarse</button>
      </div>
    </header>
  );
};

export default Header;