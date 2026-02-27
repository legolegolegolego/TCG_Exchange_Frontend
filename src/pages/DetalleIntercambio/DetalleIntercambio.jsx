import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import Notification from "../../components/Notification/Notification";
import Button from "../../components/Button/Button";
import styles from "./DetalleIntercambio.module.css";
import { aceptarIntercambio, rechazarIntercambio } from "../../services/intercambios";

const estadoIntercambioColores = {
  ACEPTADO: { bg: "success", text: "white" },
  RECHAZADO: { bg: "danger", text: "white" },
  PENDIENTE: { bg: "warning", text: "dark" },
};

const titleColores = {
  Das: { bg: "primary", text: "white" },
  Recibes: { bg: "info", text: "white" },
};

const DetalleCarta = ({ carta, title }) => {
  if (!carta) return null;

  const { bg: bgTitle, text: textTitle } = titleColores[title] || { bg: "secondary", text: "white" };
  const estadoCartaColores = {
    EXCELENTE: { bg: "success", text: "white" },
    ACEPTABLE: { bg: "warning", text: "white" },
  };
  const { bg: bgEstado, text: textEstado } = estadoCartaColores[carta.estadoCarta] || { bg: "secondary", text: "white" };

  return (
    <div className={`card shadow-sm ${styles.cartaContainer}`}>
      <span className={`badge bg-${bgTitle} text-${textTitle} ${styles.titleBadge}`}>{title}</span>
      <div className={styles.imageWrapper}>
        <img src={carta.imagenUrl || "/placeholder.png"} alt={carta.nombre || "Carta"} className={styles.imagen} />
      </div>
      <p className="fw-semibold mb-1">{carta.nombre || "Desconocido"} #{carta.numero || "?"}</p>
      <span className={`badge bg-${bgEstado} text-${textEstado} ${styles.estadoBadge}`}>
        {carta.estadoCarta || "?"}
      </span>
    </div>
  );
};

const DetalleIntercambio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [intercambio, setIntercambio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(location.state?.notification || null);
  const [showAceptarModal, setShowAceptarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [actionError, setActionError] = useState("");

  // Función para cargar intercambio desde API
  const fetchIntercambio = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/intercambios/${id}`);
      const data = res.data;
      if (!data) throw { response: { data: { mensaje: "Intercambio no encontrado" } } };

      const modeloCache = {};
      const fetchCartaCompleta = async (idCartaFisica) => {
        if (!idCartaFisica) return null;
        const cfRes = await api.get(`/cartas-fisicas/${idCartaFisica}`);
        const cf = cfRes.data;
        let cm;
        if (modeloCache[cf.idCartaModelo]) cm = modeloCache[cf.idCartaModelo];
        else {
          const cmRes = await api.get(`/cartas-modelo/${cf.idCartaModelo}`);
          cm = cmRes.data;
          modeloCache[cf.idCartaModelo] = cm;
        }
        return {
          ...cf,
          nombre: cm?.nombre || "Desconocido",
          numero: cm?.numero || "?",
          tipoCarta: cm?.tipoCarta,
          rareza: cm?.rareza,
          tipoPokemon: cm?.tipoPokemon,
          evolucion: cm?.evolucion,
          estadoCarta: cf?.estadoCarta || "?",
          imagenUrl: cf?.imagenUrl || cm?.imagenUrl || "/placeholder.png",
        };
      };

      const cartaOrigen = await fetchCartaCompleta(data.idCartaOrigen);
      const cartaDestino = await fetchCartaCompleta(data.idCartaDestino);

      setIntercambio({ ...data, cartaOrigen, cartaDestino });
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al cargar el intercambio";
      setNotification({ type: "error", message: msg });
      navigate("/", { state: { notification: { type: "error", message: msg } } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchIntercambio();
  }, [id]);

  if (loading) return <p>Cargando intercambio...</p>;
  if (!intercambio) return null;

  const isOrigen = currentUser?.username === intercambio.usernameOrigen;
  const usernameOtro = isOrigen ? intercambio.usernameDestino : intercambio.usernameOrigen;
  const esDestino = currentUser?.username === intercambio.usernameDestino;
  const puedeActuar = esDestino && intercambio.estado === "PENDIENTE";

  const { bg: bgEstadoIntercambio, text: textEstadoIntercambio } =
    estadoIntercambioColores[intercambio.estado] || { bg: "secondary", text: "white" };

  // Función para manejar acción de aceptar/rechazar
  const handleAccion = async (accion) => {
    setActionError("");
    try {
      if (accion === "ACEPTAR") await aceptarIntercambio(intercambio.id);
      else if (accion === "RECHAZAR") await rechazarIntercambio(intercambio.id);

      // recarga intercambio actualizado
      await fetchIntercambio();

      setNotification({
        type: "success",
        message: accion === "ACEPTAR" ? "Intercambio aceptado correctamente" : "Intercambio rechazado correctamente",
      });
    } catch (err) {
      setActionError(err.response?.data?.mensaje || "Error al procesar la acción");
    }
  };

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="text-center mb-3">Detalle del intercambio</h1>
      <p className="text-center mb-3">
        Propuesta {isOrigen ? "a" : "de"} <strong>{usernameOtro}</strong>
      </p>

      <div className={styles.cartas}>
        <DetalleCarta
          carta={isOrigen ? intercambio.cartaDestino : intercambio.cartaOrigen}
          title={isOrigen ? "Recibes" : "Das"}
        />
        <DetalleCarta
          carta={isOrigen ? intercambio.cartaOrigen : intercambio.cartaDestino}
          title={isOrigen ? "Das" : "Recibes"}
        />
      </div>

      <div className="text-center mt-3">
        <span className={`badge bg-${bgEstadoIntercambio} text-${textEstadoIntercambio} ${styles.estadoIntercambioBadge}`}>
          {intercambio.estado}
        </span>
      </div>

      {puedeActuar && (
        <div className={styles.actions}>
          <Button variant="success" onClick={() => setShowAceptarModal(true)}>
            Aceptar intercambio
          </Button>
          <Button variant="danger" onClick={() => setShowRechazarModal(true)}>
            Rechazar intercambio
          </Button>
        </div>
      )}

      {showAceptarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h5>¿Aceptar intercambio?</h5>
            {actionError && <p className={styles.error}>{actionError}</p>}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="primary" onClick={() => setShowAceptarModal(false)}>
                Volver
              </Button>
              <Button
                variant="success"
                onClick={async () => {
                  setShowAceptarModal(false);
                  await handleAccion("ACEPTAR");
                }}
              >
                Sí, aceptar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRechazarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h5>¿Rechazar intercambio?</h5>
            {actionError && <p className={styles.error}>{actionError}</p>}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="primary" onClick={() => setShowRechazarModal(false)}>
                Volver
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  setShowRechazarModal(false);
                  await handleAccion("RECHAZAR");
                }}
              >
                Sí, rechazar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleIntercambio;