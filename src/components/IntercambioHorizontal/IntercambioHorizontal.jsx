import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import CartaUnificada from "../CartaUnificada/CartaUnificada";
import styles from "./IntercambioHorizontal.module.css";

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

  const usernameOtro = isOrigen ? intercambio.usernameDestino : intercambio.usernameOrigen;
  const estadoIntercambio = intercambio.estado || "PENDIENTE";

  const { bg, text } = estadoColores[estadoIntercambio] || { bg: "secondary", text: "white" };

  return (
    <div className={`card shadow-sm ${styles.container}`}
      onClick={() => navigate(`/intercambio/${intercambio.id}`)}
      style={{cursor: "pointer"}}
      >
      <div className="row g-3 align-items-center p-3">
        {/* Cartas */}
        <div className="col-12 col-md-6 d-flex justify-content-center gap-3 flex-wrap">
          <CartaUnificada 
          carta={cartaOtroUsuario} 
          isSelectable={false}
          subTitle={"Recibes"}
          // disabled={!cartaUsuarioActual?.disponible}
          />
          <CartaUnificada 
          carta={cartaUsuarioActual} 
          isSelectable={false}
          subTitle={"Das"}
          // disabled={!cartaOtroUsuario?.disponible}
          />
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
            variant="cancel"
            size="md"
            onClick={(e) => {
              e.stopPropagation(); // Evita doble trigger con contenedor
              navigate(`/intercambio/${intercambio.id}`);
            }}
          >
            Ver detalle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntercambioHorizontal;