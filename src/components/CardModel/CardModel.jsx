import styles from "./CardModel.module.css";

const CardModel = ({ carta }) => {
  const { id, numero, nombre, rareza, tipoPokemon, tipoCarta, imagenUrl } = carta || {};

  return (
    <div className={styles.card}>
      <div className={styles.media}>
        {imagenUrl ? <img src={imagenUrl} alt={nombre} /> : <div className={styles.placeholder}>No image</div>}
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{nombre || "-"}</div>
        <div className={styles.meta}>#{numero ?? "-"} • {tipoCarta || "-"}</div>
        <div className={styles.metaSmall}>Tipo: {tipoPokemon || "-"} • Rareza: {rareza || "-"}</div>
      </div>
    </div>
  );
};

export default CardModel;
