import styles from "./IntercambioHorizontal.module.css";
import { useNavigate } from "react-router-dom";

const IntercambioHorizontal = ({ intercambio, currentUsername }) => {
    const navigate = useNavigate();
    if (!intercambio) return null;

    const origen = intercambio.cartaOrigen || {};
    const destino = intercambio.cartaDestino || {};

    const isOrigen = currentUsername === intercambio.usernameOrigen;

    // Carta del usuario logueado
    const cartaUsuarioActual = isOrigen ? origen : destino;
    // Carta del otro usuario
    const cartaOtroUsuario = isOrigen ? destino : origen;

    // Etiquetas "Recibes" / "Das"
    const titleUsuarioActual = isOrigen ? "Das" : "Recibes";
    const titleOtroUsuario = isOrigen ? "Recibes" : "Das";

    const usernameOtro = isOrigen ? intercambio.usernameDestino : intercambio.usernameOrigen;
    const estadoIntercambio = intercambio.estado || "PENDIENTE";

    return (
        <div className={styles.container}>
            <div className={styles.cartas}>
                <div className={styles.carta}>
                    <h4>{titleUsuarioActual}</h4>
                    <img
                        src={cartaUsuarioActual?.imagenUrl || "/placeholder.png"}
                        alt={cartaUsuarioActual?.nombre || "Carta"}
                    />
                    <p>{cartaUsuarioActual?.nombre || "Desconocido"} #{cartaUsuarioActual?.numero || "?"}</p>
                    <p>Estado: {cartaUsuarioActual?.estadoCarta || "?"}</p>
                </div>

                <div className={styles.carta}>
                    <h4>{titleOtroUsuario}</h4>
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
                    Propuesta {isOrigen ? "a" : "de"} {usernameOtro}
                </p>
                <p>Estado intercambio: {estadoIntercambio}</p>
                <button onClick={() => navigate(`/intercambio/${intercambio.id}`)}>
                    Ver detalle
                </button>
            </div>
        </div>
    );
};

export default IntercambioHorizontal;