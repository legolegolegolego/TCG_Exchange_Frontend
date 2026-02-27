import Button from "../Button/Button";
import styles from "./MiCarta.module.css";

const MiCarta = ({ carta, onEdit, onDelete }) => {
  const { nombre, numero, estadoCarta, imagenUrl, disponible } = carta;

  // Mapear estado a color Bootstrap
  const estadoMap = {
    EXCELENTE: "success",
    ACEPTABLE: "warning",
  };
  const estadoColor = estadoMap[estadoCarta] || "secondary";

  return (
    <div
      className={`card h-100 shadow-sm ${styles.card} ${
        !disponible ? styles.noDisponible : ""
      }`}
    >
      {/* Imagen */}
      <div
        className="d-flex align-items-center justify-content-center position-relative"
        style={{ height: "180px", backgroundColor: "#f8f9fa" }}
      >
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={nombre}
            className="img-fluid"
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        ) : (
          <span className="text-muted small">No image</span>
        )}

        {/* Badge de estado */}
        {estadoCarta && (
          <span
            className={`badge position-absolute top-0 start-0 m-2 bg-${estadoColor} text-white`}
          >
            {estadoCarta}
          </span>
        )}
      </div>

      {/* Cuerpo de carta */}
      <div className="card-body d-flex flex-column gap-2 text-center">
        <h6 className="card-title text-truncate">{nombre} #{numero}</h6>

        {!estadoCarta && <p className="mb-2 text-muted">Estado desconocido</p>}

        {disponible && (
          <div className="d-flex justify-content-center gap-2 mt-auto">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onEdit(carta)}
              className={styles.editButton}
            >
              Editar
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onDelete(carta)}
              className={styles.deleteButton}
            >
              Eliminar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiCarta;