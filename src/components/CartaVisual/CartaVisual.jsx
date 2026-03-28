import styles from "./CartaVisual.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const estadoColores = {
  EXCELENTE: { bg: "success", text: "white" },
  ACEPTABLE: { bg: "warning", text: "dark" },
  "NO DISPONIBLE": { bg: "danger", text: "white" },
};

const CartaVisual = ({ carta, title, placeholderText }) => {
  const nombre = carta?.nombre || "Desconocido";
  const numero = carta?.numero || "?";
  const estadoCarta = carta?.estadoCarta || "?";
  const imagen = carta?.imagenUrl || "/placeholder.png";

  // Badge de estado
  const { bg, text } = estadoColores[estadoCarta] || { bg: "secondary", text: "white" };

  return (
    <div className="text-center mb-2">
      {/* Título fuera de la carta */}
      {title && <p className={styles.titleText}>{title}</p>}

      <div className={`card shadow-sm ${styles.container}`}>
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
          <div className={styles.placeholderFull}>
            {placeholderText || "Selecciona una carta"}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartaVisual;