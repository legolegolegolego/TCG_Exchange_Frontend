import { Link, useNavigate } from "react-router-dom";
import styles from "./CardModel.module.css";

const CardModel = ({ carta }) => {
  const navigate = useNavigate();
  const { id, numero, nombre, rareza, tipoPokemon, tipoCarta, imagenUrl } = carta || {};

  const handleClick = () => {
    if (id) navigate(`/cartas/${id}`);
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && id) navigate(`/cartas/${id}`);
  };

  const rootClass = id ? `${styles.card} ${styles.clickable}` : styles.card;

  return (
    <div
      className={rootClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={id ? "link" : undefined}
      tabIndex={id ? 0 : undefined}
    >
      <div className={styles.media}>
        {imagenUrl ? <img src={imagenUrl} alt={nombre} /> : <div className={styles.placeholder}>No image</div>}
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{nombre || "-"}</div>
        <div className={styles.meta}>#{numero ?? "-"} • {tipoCarta || "-"}</div>
        <div className={styles.metaSmall}>Tipo: {tipoPokemon || "-"} • Rareza: {rareza || "-"}</div>
        <div className={styles.actions}>
          {id ? (
            <Link to={`/cartas/${id}`} onClick={(e)=>e.stopPropagation()} className={styles.moreButton}>
              Ver más
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CardModel;
