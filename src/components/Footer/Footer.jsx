import styles from "./Footer.module.css";
import logo from "../../assets/logo.png"; // misma imagen que header

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <img src={logo} alt="Logo App" className={styles.logo} />
        <h2 className={styles.appName}>TCG Exchange</h2>
        <p className={styles.description}>
          Proyecto académico desarrollado con fines educativos.<br/><br/>
          Esta aplicación no tiene fines comerciales ni está destinada a uso público.<br/><br/>
          Las imágenes, nombres y referencias a Pokémon TCG se utilizan únicamente con fines de aprendizaje y demostración, sin intención de infringir derechos de autor.<br/><br/>
          Pokémon y Pokémon TCG son marcas registradas de Nintendo, Game Freak y Creatures Inc.
        </p>
      </div>

      <div className={styles.line}></div>

      <p className={styles.copy}>© 2026 TCG Exchange.</p>
    </footer>
  );
};

export default Footer;