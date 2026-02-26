import styles from "./IntercambioHorizontal.module.css";
import { useNavigate } from "react-router-dom";
import CartaVisual from "../CartaVisual/CartaVisual";

const IntercambioHorizontal = ({ intercambio, currentUsername }) => {
    const navigate = useNavigate();
    if (!intercambio) return null;

    const isOrigen = currentUsername === intercambio.usernameOrigen;

    const cartaUsuarioActual = isOrigen ? intercambio.cartaOrigen : intercambio.cartaDestino;
    const cartaOtroUsuario = isOrigen ? intercambio.cartaDestino : intercambio.cartaOrigen;

    const titleUsuarioActual = isOrigen ? "Das" : "Recibes";
    const titleOtroUsuario = isOrigen ? "Recibes" : "Das";

    const usernameOtro = isOrigen ? intercambio.usernameDestino : intercambio.usernameOrigen;
    const estadoIntercambio = intercambio.estado || "PENDIENTE";

    return (
        <div className={styles.container}>
            <div className={styles.cartas}>
                <CartaVisual carta={cartaUsuarioActual} title={titleUsuarioActual} />
                <CartaVisual carta={cartaOtroUsuario} title={titleOtroUsuario} />
            </div>

            <div className={styles.detalle}>
                <p>Propuesta {isOrigen ? "a" : "de"} {usernameOtro}</p>
                <p>Estado intercambio: {estadoIntercambio}</p>
                <button onClick={() => navigate(`/intercambio/${intercambio.id}`)}>
                    Ver detalle
                </button>
            </div>
        </div>
    );
};

export default IntercambioHorizontal;