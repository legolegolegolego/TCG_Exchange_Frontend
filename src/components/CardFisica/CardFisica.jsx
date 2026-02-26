import { useNavigate } from "react-router-dom";
import styles from "./CardFisica.module.css";

const CardFisica = ({ carta }) => {
  const navigate = useNavigate();

  const modelo = carta?.cartaModelo || {};
  const imagen = carta?.imagenUrl || modelo.imagenUrl || null;
  const nombreModelo = modelo.nombre || carta?.nombre || "-";

  const estadoRaw = carta?.estadoCarta; // 'EXCELENTE' | 'ACEPTABLE'
  const estado = estadoRaw
    ? capitalize(estadoRaw)
    : carta?.disponible
    ? "Disponible"
    : "No disponible";

  function capitalize(s) {
    if (!s) return s;
    const str = String(s);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const statusClass = estadoRaw
    ? estadoRaw.toLowerCase() === "excelente"
      ? styles.statusExcelente
      : estadoRaw.toLowerCase() === "aceptable"
      ? styles.statusAceptable
      : styles.status
    : styles.statusUnknown;

  return (
    <div className={styles.card}>
      <div className={styles.media}>
        {imagen ? <img src={imagen} alt={nombreModelo} /> : <div className={styles.placeholder}>No image</div>}
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{nombreModelo}</div>
        <div className={styles.meta}>Estado: <span className={statusClass}>{estado}</span></div>
        <div className={styles.actions}>
          <button
            className={styles.proposeButton}
            onClick={() => navigate(`/proponer-intercambio/${carta.id}`)}
          >
            Proponer intercambio
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardFisica;