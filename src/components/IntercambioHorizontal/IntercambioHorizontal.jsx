import styles from "./IntercambioHorizontal.module.css";

const IntercambioHorizontal = ({ intercambio, currentUsername }) => {
  if (!intercambio) return null;

  const origen = intercambio.cartaOrigen || {};
  const destino = intercambio.cartaDestino || {};
  const usuarioOrigen = intercambio.usuarioOrigen || {};
  const usuarioDestino = intercambio.usuarioDestino || {};

  // Determinar si el usuario logueado es origen o destino
  const isOrigen = currentUsername === usuarioOrigen.username;

  const cartaUsuarioActual = isOrigen ? origen : destino;
  const cartaOtroUsuario = isOrigen ? destino : origen;

  const usernameOtro = isOrigen ? usuarioDestino.username : usuarioOrigen.username;
  const estadoIntercambio = intercambio.estado || "PENDIENTE";

  return (
    <div className={styles.container}>
      <div className={styles.cartas}>
        <div className={styles.carta}>
          <img
            src={cartaUsuarioActual?.imagenUrl || "/placeholder.png"}
            alt={cartaUsuarioActual?.nombre || "Carta"}
          />
          <p>{cartaUsuarioActual?.nombre || "Desconocido"} #{cartaUsuarioActual?.numero || "?"}</p>
          <p>Estado: {cartaUsuarioActual?.estadoCarta || "?"}</p>
        </div>

        <div className={styles.carta}>
          <img
            src={cartaOtroUsuario?.imagenUrl || "/placeholder.png"}
            alt={cartaOtroUsuario?.nombre || "Carta"}
          />
          <p>{cartaOtroUsuario?.nombre || "Desconocido"} #{cartaOtroUsuario?.numero || "?"}</p>
          <p>Estado: {cartaOtroUsuario?.estadoCarta || "?"}</p>
        </div>
      </div>

      <div className={styles.detalle}>
        <p>
          Propuesta {isOrigen ? "de" : "a"} {usernameOtro}
        </p>
        <p>Estado intercambio: {estadoIntercambio}</p>
        <button>Ver detalle</button>
      </div>
    </div>
  );
};

export default IntercambioHorizontal;