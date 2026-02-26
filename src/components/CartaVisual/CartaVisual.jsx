import styles from "./CartaVisual.module.css";

const CartaVisual = ({ carta, title, placeholderText }) => {
  const nombre = carta?.nombre || "Desconocido";
  const numero = carta?.numero || "?";
  const estadoCarta = carta?.estadoCarta || "?";
  const imagen = carta?.imagenUrl || "/placeholder.png";

  return (
    <div className={styles.container}>
      {title && <h4>{title}</h4>}
      {carta ? (
        <>
          <img src={imagen} alt={nombre} className={styles.imagen} />
          <p>{nombre} #{numero}</p>
          <p>Estado: {estadoCarta}</p>
        </>
      ) : (
        <div className={styles.placeholder}>{placeholderText || "Sin carta"}</div>
      )}
    </div>
  );
};

export default CartaVisual;