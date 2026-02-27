import { useNavigate } from "react-router-dom";
import CartaVisual from "../CartaVisual/CartaVisual";
import Button from "../Button/Button";
import styles from "./IntercambioHorizontal.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const estadoColores = {
  ACEPTADO: { bg: "success", text: "white" },
  RECHAZADO: { bg: "danger", text: "white" },
  PENDIENTE: { bg: "warning", text: "dark" },
};

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

  const { bg, text } = estadoColores[estadoIntercambio] || { bg: "secondary", text: "white" };

  return (
    <div className={`card shadow-sm ${styles.container}`}>
      <div className="row g-3 align-items-center p-3">
        {/* Cartas */}
        <div className="col-12 col-md-6 d-flex justify-content-center gap-3 flex-wrap">
          <CartaVisual carta={cartaUsuarioActual} title={titleUsuarioActual} />
          <CartaVisual carta={cartaOtroUsuario} title={titleOtroUsuario} />
        </div>

        {/* Detalles */}
        <div className="col-12 col-md-6 d-flex flex-column align-items-md-end gap-2">
          <p className="mb-1">
            Propuesta {isOrigen ? "a" : "de"} <strong>{usernameOtro}</strong>
          </p>
          <p className="mb-2">
            Estado intercambio:{" "}
            <span className={`badge bg-${bg} text-${text} ${styles.estadoBadge}`}>
              {estadoIntercambio}
            </span>
          </p>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/intercambio/${intercambio.id}`)}
          >
            Ver detalle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntercambioHorizontal;