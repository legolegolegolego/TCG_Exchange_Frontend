import styles from "./MiCarta.module.css";

const MiCarta = ({ carta, onEdit, onDelete }) => {
  const {
    nombre,
    numero,
    estadoCarta,
    imagenUrl,
    disponible
  } = carta;

  return (
    <div
      className={`${styles.card} ${
        !disponible ? styles.noDisponible : ""
      }`}
    >
      <img src={imagenUrl} alt={nombre} className={styles.imagen} />

      <p>{nombre} #{numero}</p>
      <p>Estado: {estadoCarta}</p>

      {disponible && (
        <div className={styles.actions}>
          <button onClick={() => onEdit(carta)}>Editar</button>
          <button onClick={() => onDelete(carta)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default MiCarta;