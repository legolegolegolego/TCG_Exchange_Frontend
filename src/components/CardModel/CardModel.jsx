import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './CardModel.module.css';
import Button from "../Button/Button";

const rarezaLabels = {
  COMUN: "Común",
  INFRECUENTE: "Infrecuente",
  RARA: "Rara",
  RARA_HOLO: "Rara Holo",
};

const tipoColores = {
  AGUA: "#3498db",
  FUEGO: "#e74c3c",
  PLANTA: "#2ecc71",
  ELECTRICO: "#f1c40f",
  PSIQUICO: "#8e44ad",
  LUCHA: "#d35400",
  INCOLORO: "#bdc3c7",
  OSCURO: "#2c3e50",
  METAL: "#95a5a6",
  HADA: "#ff9ff3",
  DRAGON: "#6c5ce7",
  ENTRENADOR: "#ffffff"
};

const rarezaColores = {
  COMUN: "#95a5a6",
  INFRECUENTE: "#3498db",
  RARA: "#ff8c08",
  RARA_HOLO: "#c00ff1"
};

const CardModel = ({ carta }) => {
  const navigate = useNavigate();
  const { id, numero, nombre, rareza, tipoPokemon, tipoCarta, imagenUrl } = carta || {};

  const handleClick = () => { if (id) navigate(`/cartas/${id}`); };
  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && id) navigate(`/cartas/${id}`);
  };

  const glowColor = tipoColores[tipoPokemon] || "#999";

  return (
    <div
      className={`card h-100 shadow-sm rounded ${styles.clickable} ${styles.card}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={id ? "link" : undefined}
      tabIndex={id ? 0 : undefined}
      style={{ "--glow": glowColor }}
    >
      <div className={styles.imageContainer}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={nombre} />
        ) : (
          <div className={styles.noImage}>No image</div>
        )}

        {rareza && (
          <span
            className="badge position-absolute top-0 start-0 m-2"
            style={{
              backgroundColor: rarezaColores[rareza] || "#777",
              color: "#fff",
              fontWeight: 600
            }}
          >
            {rarezaLabels[rareza]}
          </span>
        )}
      </div>

      <div className="card-body p-2 d-flex flex-column gap-1">
        <div className={styles.title}>{nombre || "-"}</div>
        <div className={styles.meta}>
          #{numero ?? "-"} • {tipoCarta || "-"}
        </div>
        <div className={`${styles.meta} ${styles.small}`}>
          {tipoPokemon && tipoPokemon !== "ENTRENADOR" ? (
            <>Tipo: <span className={styles.tipo}>{tipoPokemon}</span></>
          ) : (
            <>&nbsp;</>
          )}
        </div>

        {id && (
          <Button
            variant="primary"
            size="md"
            className="w-100 mt-1"
            onClick={(e) => {
              e.stopPropagation(); // evita que active el onClick del card
              navigate(`/cartas/${id}`);
            }}
          >
            Ver más
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardModel;