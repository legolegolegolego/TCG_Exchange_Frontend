import styles from "./CartaIntercambio.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const estadoColores = {
  EXCELENTE: { bg: "success", text: "white" },
  ACEPTABLE: { bg: "warning", text: "dark" },
  "NO DISPONIBLE": { bg: "danger", text: "white" },
};

// Colores de los titles, como Das/Recibes
const titleColores = {
  "Carta solicitada": { bg: "primary", text: "white" },
  "Tu selección": { bg: "info", text: "white" },
};

const CartaIntercambio = ({ carta, title, placeholderText }) => {
  const nombre = carta?.nombre || "Desconocido";
  const numero = carta?.numero || "?";
  const estadoCarta = carta?.estadoCarta || "?";
  const imagen = carta?.imagenUrl || "/placeholder.png";

  // Badge de estado
  const { bg, text } = estadoColores[estadoCarta] || { bg: "secondary", text: "white" };

  // Badge de title
  const titleColor = titleColores[title] || { bg: "secondary", text: "white" };

  return (
    <div className={`card shadow-sm ${styles.container}`}>
      {/* Title con color distintivo */}
      {title && (
        <div className="text-center mb-2">
          <span className={`badge bg-${titleColor.bg} text-${titleColor.text} ${styles.titleBadge}`}>
            {title}
          </span>
        </div>
      )}

      {carta ? (
        <div className="d-flex flex-column align-items-center">
          <div className={styles.imageContainer}>
            <img src={imagen} alt={nombre} className={styles.imagen} />
          </div>
          <div className="text-center mt-2">
            <p className="mb-1 fw-semibold">{nombre} #{numero}</p>
            <span className={`badge bg-${bg} text-${text} ${styles.estadoBadge}`}>
              {estadoCarta}
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>{placeholderText || "Selecciona una carta"}</div>
      )}
    </div>
  );
};

export default CartaIntercambio;