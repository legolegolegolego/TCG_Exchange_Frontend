import styles from "./CartaVisual.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const estadoColores = {
  EXCELENTE: { bg: "success", text: "white" },
  ACEPTABLE: { bg: "warning", text: "white" },
};

const titleColores = {
  Das: { bg: "primary", text: "white" },
  Recibes: { bg: "info", text: "white" },
};

const CartaVisual = ({ carta, title, placeholderText }) => {
  const nombre = carta?.nombre || "Desconocido";
  const numero = carta?.numero || "?";
  const estadoCarta = carta?.estadoCarta || "?";
  const imagen = carta?.imagenUrl || "/placeholder.png";

  // Color del badge de estado
  const { bg: bgEstado, text: textEstado } = estadoColores[estadoCarta] || { bg: "secondary", text: "white" };

  // Color del badge de título (Das / Recibes)
  const { bg: bgTitle, text: textTitle } = titleColores[title] || { bg: "secondary", text: "white" };

  return (
    <div className={`card shadow-sm ${styles.container}`}>
      {title && (
        <div className="text-center mb-2">
          <span className={`badge bg-${bgTitle} text-${textTitle} ${styles.titleBadge}`}>
            {title}
          </span>
        </div>
      )}

      {carta ? (
        <>
          <div className={styles.imageContainer}>
            <img src={imagen} alt={nombre} className={styles.imagen} />
          </div>

          <div className="card-body p-2 text-center">
            <p className="mb-1 fw-semibold">{nombre} #{numero}</p>
            <span className={`badge bg-${bgEstado} text-${textEstado} ${styles.estadoBadge}`}>
              {estadoCarta}
            </span>
          </div>
        </>
      ) : (
        <div className={styles.placeholder}>{placeholderText || "Sin carta"}</div>
      )}
    </div>
  );
};

export default CartaVisual;