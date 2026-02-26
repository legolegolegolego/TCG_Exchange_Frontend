import styles from "./IntercambioHorizontal.module.css";

const IntercambioHorizontal = ({ intercambio, currentUsername }) => {
  if (!intercambio) return null;

  const origen = intercambio.cartaOrigen || {};
  const destino = intercambio.cartaDestino || {};

  const usernameOrigen = intercambio.usernameOrigen;
  const usernameDestino = intercambio.usernameDestino;

  const estadoIntercambio = intercambio.estado || "PENDIENTE";

  // Determinar si el usuario logueado es el origen
  const isOrigen = currentUsername === usernameOrigen;

  const cartaUsuarioActual = isOrigen ? origen : destino;
  const cartaOtroUsuario = isOrigen ? destino : origen;

  const usernameOtro = isOrigen ? usernameDestino : usernameOrigen;

  return (
    <div className={styles.container}>
      <div className={styles.cartas}>
        <div className={styles.carta}>
          <img
            src={cartaUsuarioActual?.imagenUrl || "/placeholder.png"}
            alt={cartaUsuarioActual?.nombre || "Carta"}
          />
          <p>
            {cartaUsuarioActual?.nombre || "Desconocido"} #
            {cartaUsuarioActual?.numero || "?"}
          </p>
          <p>Estado: {cartaUsuarioActual?.estadoCarta || "?"}</p>
        </div>

        <div className={styles.carta}>
          <img
            src={cartaOtroUsuario?.imagenUrl || "/placeholder.png"}
            alt={cartaOtroUsuario?.nombre || "Carta"}
          />
          <p>
            {cartaOtroUsuario?.nombre || "Desconocido"} #
            {cartaOtroUsuario?.numero || "?"}
          </p>
          <p>Estado: {cartaOtroUsuario?.estadoCarta || "?"}</p>
        </div>
      </div>

      <div className={styles.detalle}>
        <p>
          Propuesta {isOrigen ? "a" : "de"}{" "}
          {usernameOtro || "Desconocido"}
        </p>
        <p>Estado intercambio: {estadoIntercambio}</p>
        <button>Ver detalle</button>
      </div>
    </div>
  );
};

export default IntercambioHorizontal;